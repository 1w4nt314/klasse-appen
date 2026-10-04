import { existsSync, mkdirSync } from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";

/**
 * SQLite-databasen ligger som en fil på web-instansen. På Render skal den ligge
 * på en persistent disk, ellers forsvinder data ved hvert deploy. Er der monteret
 * en disk på /var/data, bruges den automatisk; ellers kan DATA_DIR sættes.
 */
const RENDER_DISK = "/var/data";
const DATA_DIR =
  process.env.DATA_DIR ||
  (existsSync(RENDER_DISK) ? RENDER_DISK : path.join(process.cwd(), "data"));

const MIGRATIONS = [
  `
  create table users (
    id text primary key,
    email text not null unique,
    full_name text not null,
    school text not null,
    password_hash text not null,
    created_at integer not null
  );

  create table sessions (
    token_hash text primary key,
    user_id text not null references users (id) on delete cascade,
    expires_at integer not null
  );
  create index sessions_user_id on sessions (user_id);

  create table favorites (
    user_id text not null references users (id) on delete cascade,
    app_slug text not null,
    created_at integer not null,
    primary key (user_id, app_slug)
  );
  `,
  // Klasse Zoo er omdøbt til Stillezoonen: flyt lærernes favoritter med.
  `
  update or ignore favorites set app_slug = 'stillezoonen' where app_slug = 'klasse-zoo';
  delete from favorites where app_slug = 'klasse-zoo';
  `,
  // Platform-admin (gives kun via scripts/admin.mjs i serverens shell),
  // deaktivering af brugere og ønskelisten.
  `
  alter table users add column role text not null default 'teacher';
  alter table users add column disabled_at integer;

  create table wishes (
    id text primary key,
    user_id text references users (id) on delete set null,
    title text not null,
    body text not null default '',
    category text not null,
    status text not null default 'open',
    created_at integer not null
  );
  create index wishes_created_at on wishes (created_at);

  create table wish_likes (
    wish_id text not null references wishes (id) on delete cascade,
    user_id text not null references users (id) on delete cascade,
    created_at integer not null,
    primary key (wish_id, user_id)
  );
  `,
  // Serverens egne hemmeligheder (fx nøglen til "kendt enhed"-cookien).
  `
  create table app_secrets (
    name text primary key,
    value text not null
  );
  `,
  // Bekræftelse af e-mail og nulstilling af adgangskode. Eksisterende
  // brugere regnes som bekræftede.
  `
  alter table users add column email_verified_at integer;
  update users set email_verified_at = created_at;

  create table auth_tokens (
    token_hash text primary key,
    user_id text not null references users (id) on delete cascade,
    purpose text not null check (purpose in ('verify', 'reset')),
    expires_at integer not null,
    created_at integer not null
  );
  create index auth_tokens_user on auth_tokens (user_id, purpose);
  `,
  // Ventende oprettelser: brugeren oprettes først, når e-mailen er bekræftet.
  // Hver oprettelse har sit eget link, så ingen kan overskrive en andens.
  `
  create table pending_signups (
    token_hash text primary key,
    email text not null,
    full_name text not null,
    school text not null,
    password_hash text not null,
    expires_at integer not null,
    created_at integer not null
  );
  create index pending_signups_email on pending_signups (email);
  `,
  // Stillezoonen: lærerens klasser og hvilke dyr hver samling har spottet.
  // collection = 'mine' (lærerens egen samling) eller et klasse-id.
  `
  create table zoo_classes (
    id text primary key,
    user_id text not null references users (id) on delete cascade,
    name text not null,
    created_at integer not null,
    unique (user_id, name)
  );

  create table zoo_sightings (
    user_id text not null references users (id) on delete cascade,
    collection text not null,
    theme text not null,
    creature text not null,
    first_seen integer not null,
    last_seen integer not null,
    count integer not null default 1,
    primary key (user_id, collection, theme, creature)
  );
  `,
];

/** Hvor databasen ligger. scripts/admin.mjs finder den på samme måde (DATA_DIR → /var/data → ./data). */
export const DATABASE_FILE = () => path.join(DATA_DIR, "klasse-appen.db");

function open() {
  mkdirSync(DATA_DIR, { recursive: true });
  console.info(`[db] SQLite i ${DATA_DIR}`);
  const db = new DatabaseSync(DATABASE_FILE());
  db.exec("pragma journal_mode = wal; pragma foreign_keys = on; pragma busy_timeout = 5000;");

  const { user_version: version } = db.prepare("pragma user_version").get() as {
    user_version: number;
  };
  for (let v = version; v < MIGRATIONS.length; v++) {
    db.exec("begin");
    try {
      db.exec(MIGRATIONS[v]);
      db.exec(`pragma user_version = ${v + 1}`);
      db.exec("commit");
    } catch (err) {
      db.exec("rollback");
      throw err;
    }
  }
  return db;
}

// Genbruges på tværs af hot reloads i udvikling.
const globalForDb = globalThis as unknown as { klasseDb?: DatabaseSync };

/** Åbnes først ved første kald, så `next build` ikke rører databasen. */
export function db() {
  globalForDb.klasseDb ??= open();
  return globalForDb.klasseDb;
}

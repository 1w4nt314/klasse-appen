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
];

function open() {
  mkdirSync(DATA_DIR, { recursive: true });
  console.info(`[db] SQLite i ${DATA_DIR}`);
  const db = new DatabaseSync(path.join(DATA_DIR, "klasse-appen.db"));
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

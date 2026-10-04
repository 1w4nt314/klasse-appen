#!/usr/bin/env node
/**
 * Platform-admin kan KUN gives herfra — i serverens shell (Render → Shell).
 *
 *   npm run admin -- list                 vis alle admins
 *   npm run admin -- grant <e-mail>       gør en bruger til admin
 *   npm run admin -- revoke <e-mail>      fjern admin-rettigheden
 *
 * Databasen findes på samme måde som i appen: DATA_DIR, ellers /var/data
 * (Render-disk), ellers ./data.
 */
import { existsSync } from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";

const dir =
  process.env.DATA_DIR || (existsSync("/var/data") ? "/var/data" : path.join(process.cwd(), "data"));
const file = path.join(dir, "klasse-appen.db");
const [command, rawEmail] = process.argv.slice(2);
const email = rawEmail?.trim().toLowerCase();

const fail = (msg) => {
  console.error(`✗ ${msg}`);
  process.exit(1);
};

if (!existsSync(file)) fail(`Fandt ingen database i ${file}.`);
const db = new DatabaseSync(file);
db.exec("pragma busy_timeout = 5000;");

const columns = db.prepare("pragma table_info(users)").all().map((c) => c.name);
if (!columns.includes("role"))
  fail("Databasen er ikke opdateret endnu. Åbn sitet én gang i browseren (så kører migrationen), og prøv igen.");

switch (command) {
  case "list": {
    const admins = db.prepare("select email, full_name, school from users where role = 'admin' order by email").all();
    if (admins.length === 0) console.log("Ingen admins endnu.");
    for (const a of admins) console.log(`• ${a.email} — ${a.full_name}, ${a.school}`);
    break;
  }
  case "grant":
  case "revoke": {
    if (!email) fail(`Skriv en e-mail: npm run admin -- ${command} lærer@skole.dk`);
    const user = db.prepare("select id, full_name, role, disabled_at from users where email = ?").get(email);
    if (!user) fail(`Ingen bruger med e-mailen ${email}. Brugeren skal oprette sig på sitet først.`);
    const role = command === "grant" ? "admin" : "teacher";
    if (user.role === role) {
      console.log(
        role === "admin"
          ? `• ${user.full_name} (${email}) er allerede platform-admin. Intet ændret.`
          : `• ${user.full_name} (${email}) er ikke admin. Intet ændret.`,
      );
      break;
    }
    if (role === "admin" && user.disabled_at)
      console.warn(`! ${email} er deaktiveret og kan ikke logge ind, før en anden admin genaktiverer brugeren.`);
    db.prepare("update users set role = ? where id = ?").run(role, user.id);
    console.log(
      command === "grant"
        ? `✓ ${user.full_name} (${email}) er nu platform-admin. Genindlæs siden for at se menuen "Brugere".`
        : `✓ ${user.full_name} (${email}) er ikke længere admin.`,
    );
    break;
  }
  default:
    console.log("Brug: npm run admin -- list | grant <e-mail> | revoke <e-mail>");
    process.exit(command ? 1 : 0);
}

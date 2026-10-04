import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/session";
import { UserTable, type UserRow } from "./UserTable";

export const metadata: Metadata = { title: "Brugere" };

export default async function AdminPage() {
  const admin = await requireAdmin("/admin");
  // Kun mail, navn og skole (+ status) — ikke mere end der er brug for.
  const users = (
    db()
      .prepare(
        `select id, email, full_name, school, role, disabled_at
           from users order by created_at desc`,
      )
      .all() as {
      id: string;
      email: string;
      full_name: string;
      school: string;
      role: string;
      disabled_at: number | null;
    }[]
  ).map(
    (u): UserRow => ({
      id: u.id,
      email: u.email,
      name: u.full_name,
      school: u.school,
      isAdmin: u.role === "admin",
      disabled: u.disabled_at !== null,
      isSelf: u.id === admin.id,
    }),
  );

  const active = users.filter((u) => !u.disabled).length;

  return (
    <>
      <SiteHeader teacher={admin} current="admin" />
      <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-10">
        <h1 className="font-display text-3xl font-semibold tracking-tight text-brand-strong">
          Brugere
        </h1>
        <p className="mt-2 text-muted">
          <span className="tabular-nums">{users.length}</span> brugere på platformen ·{" "}
          <span className="tabular-nums">{active}</span> aktive. Kun du som platform-admin kan se
          denne side.
        </p>
        <UserTable users={users} />
      </main>
    </>
  );
}

"use client";

import { useMemo, useState } from "react";
import { ConfirmButton } from "@/components/ConfirmButton";
import { setUserDisabled } from "./actions";

export type UserRow = {
  id: string;
  email: string;
  name: string;
  school: string;
  isAdmin: boolean;
  disabled: boolean;
  isSelf: boolean;
};

export function UserTable({ users }: { users: UserRow[] }) {
  const [query, setQuery] = useState("");
  const [error, setError] = useState<string | null>(null);

  const shown = useMemo(() => {
    const q = query.trim().toLocaleLowerCase("da");
    if (!q) return users;
    return users.filter((u) =>
      [u.email, u.name, u.school].some((v) => v.toLocaleLowerCase("da").includes(q)),
    );
  }, [users, query]);

  const run = async (id: string, disabled: boolean) => {
    setError(null);
    const res = await setUserDisabled(id, disabled);
    if (!res.ok) setError(res.error ?? "Noget gik galt.");
  };

  return (
    <div className="mt-6">
      <label className="block max-w-sm">
        <span className="sr-only">Søg</span>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Søg på navn, mail eller skole"
          className="block w-full rounded-control border border-line-strong bg-surface px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
        />
      </label>

      {error && (
        <p role="alert" className="mt-3 rounded-control bg-danger-soft px-3 py-2 text-sm text-danger">
          {error}
        </p>
      )}

      <div className="mt-4 overflow-x-auto rounded-card border border-line bg-surface">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-line bg-canvas text-xs uppercase tracking-wider text-muted">
            <tr>
              <th className="px-4 py-2.5 font-bold">Navn</th>
              <th className="px-4 py-2.5 font-bold">Mail</th>
              <th className="px-4 py-2.5 font-bold">Skole</th>
              <th className="px-4 py-2.5 font-bold">Status</th>
              <th className="px-4 py-2.5" />
            </tr>
          </thead>
          <tbody>
            {shown.map((u) => (
              <tr key={u.id} className={`border-b border-line last:border-0 ${u.disabled ? "text-muted" : ""}`}>
                <td className="px-4 py-3 font-bold">
                  {u.name}
                  {u.isAdmin && (
                    <span className="ml-2 rounded-control bg-brand-soft px-1.5 py-0.5 text-xs font-bold text-brand">
                      Admin
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">{u.email}</td>
                <td className="px-4 py-3">{u.school}</td>
                <td className="px-4 py-3">
                  {u.disabled ? (
                    <span className="rounded-control bg-danger-soft px-2 py-0.5 text-xs font-bold text-danger">
                      Deaktiveret
                    </span>
                  ) : (
                    <span className="rounded-control bg-accent-soft px-2 py-0.5 text-xs font-bold text-accent">
                      Aktiv
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  {u.isSelf ? (
                    <span className="text-xs text-muted">Dig</span>
                  ) : u.disabled ? (
                    <ConfirmButton
                      title={`Genaktivér ${u.name}?`}
                      message={`${u.name} (${u.email}) kan logge ind igen med sin gamle adgangskode.`}
                      confirmLabel="Ja, genaktivér"
                      tone="brand"
                      onConfirm={() => run(u.id, false)}
                      className="rounded-control border border-line-strong px-3 py-1.5 text-xs font-bold hover:border-brand hover:text-brand"
                    >
                      Genaktivér
                    </ConfirmButton>
                  ) : (
                    <ConfirmButton
                      title={`Deaktivér ${u.name}?`}
                      message={
                        <>
                          <strong className="text-ink">{u.name}</strong> ({u.email}, {u.school}) bliver
                          logget ud med det samme og kan ikke logge ind igen. Intet slettes – du kan
                          genaktivere brugeren senere.
                        </>
                      }
                      confirmLabel="Ja, deaktivér"
                      onConfirm={() => run(u.id, true)}
                      className="rounded-control px-3 py-1.5 text-xs font-bold text-danger hover:bg-danger-soft"
                    >
                      Deaktivér
                    </ConfirmButton>
                  )}
                </td>
              </tr>
            ))}
            {shown.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-muted">
                  Ingen brugere matcher søgningen.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

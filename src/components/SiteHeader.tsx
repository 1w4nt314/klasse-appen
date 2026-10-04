import Link from "next/link";
import type { Teacher } from "@/lib/session";
import { Logo } from "./Logo";

type Section = "apps" | "wishes" | "admin";

export function SiteHeader({
  teacher,
  current,
}: {
  teacher: Teacher | null;
  current?: Section;
}) {
  const links: { id: Section; href: string; label: string }[] = teacher
    ? [
        { id: "apps", href: "/apps", label: "Apps" },
        { id: "wishes", href: "/onsker", label: "Ønsker" },
        ...(teacher.isAdmin ? [{ id: "admin" as const, href: "/admin", label: "Brugere" }] : []),
      ]
    : [];

  return (
    <header className="border-b border-line bg-surface">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-4 gap-y-2 px-5 py-3.5">
        {/* På mobil: logo og "Log ud" på første linje, menuen på linjen under. */}
        <Logo href={teacher ? "/apps" : "/"} />
        {links.length > 0 && (
          <nav
            className="order-last flex w-full items-center gap-1 sm:order-none sm:mr-auto sm:w-auto"
            aria-label="Hovedmenu"
          >
            {links.map((l) => (
              <Link
                key={l.id}
                href={l.href}
                aria-current={current === l.id ? "page" : undefined}
                className="whitespace-nowrap rounded-control px-2.5 py-1.5 text-sm font-bold text-muted hover:bg-brand-soft hover:text-brand aria-[current=page]:bg-brand-soft aria-[current=page]:text-brand"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        )}
        {teacher ? (
          <div className="flex items-center gap-3">
            <div className="hidden text-right leading-tight sm:block">
              <div className="text-sm font-bold">{teacher.name || teacher.email}</div>
              {teacher.school && <div className="text-xs text-muted">{teacher.school}</div>}
            </div>
            <form action="/auth/logout" method="post">
              <button
                type="submit"
                className="rounded-control border border-line-strong px-3 py-1.5 text-sm font-bold hover:border-brand hover:text-brand"
              >
                Log ud
              </button>
            </form>
          </div>
        ) : (
          <nav className="flex items-center gap-1.5 sm:gap-2">
            <Link
              href="/login"
              className="whitespace-nowrap rounded-control px-2.5 py-2 text-sm font-bold text-ink hover:bg-brand-soft hover:text-brand"
            >
              Log ind
            </Link>
            <Link
              href="/opret"
              className="whitespace-nowrap rounded-control bg-brand px-3 py-2 text-sm font-bold text-white hover:bg-brand-strong"
            >
              Opret bruger
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}

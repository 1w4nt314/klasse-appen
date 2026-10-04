import Link from "next/link";
import type { Teacher } from "@/lib/session";
import { Logo } from "./Logo";

export function SiteHeader({ teacher }: { teacher: Teacher | null }) {
  return (
    <header className="border-b border-line bg-surface">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3.5">
        <Logo href={teacher ? "/apps" : "/"} />
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

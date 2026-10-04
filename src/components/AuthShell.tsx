import type { ReactNode } from "react";
import { Logo } from "./Logo";

/** Den smalle ramme om login, oprettelse og links fra mails. */
export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="mx-auto flex w-full max-w-6xl items-center px-5 py-5">
        <Logo />
      </header>
      <main className="flex flex-1 items-start justify-center px-5 pt-6 pb-16 sm:pt-12">
        <div className="w-full max-w-md">{children}</div>
      </main>
    </div>
  );
}

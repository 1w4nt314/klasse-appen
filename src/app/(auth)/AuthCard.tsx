import type { ReactNode } from "react";

export function AuthCard({
  title,
  intro,
  children,
  footer,
}: {
  title: string;
  intro?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <>
      <div className="rounded-card border border-line bg-surface p-6 sm:p-8">
        <h1 className="font-display text-3xl font-semibold tracking-tight text-brand-strong">
          {title}
        </h1>
        {intro && <p className="mt-2 text-muted">{intro}</p>}
        <div className="mt-6">{children}</div>
      </div>
      {footer && <p className="mt-5 text-center text-sm text-muted">{footer}</p>}
    </>
  );
}

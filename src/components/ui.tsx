"use client";

import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { useFormStatus } from "react-dom";

const base =
  "inline-flex items-center justify-center gap-2 rounded-control px-4 py-2.5 font-bold transition-colors disabled:cursor-progress disabled:opacity-70";

export const buttonStyles = {
  primary: `${base} bg-brand text-white hover:bg-brand-strong`,
  secondary: `${base} border border-line-strong bg-surface text-ink hover:border-brand hover:text-brand`,
  ghost: `${base} text-muted hover:bg-brand-soft hover:text-brand`,
};

export function SubmitButton({
  children,
  pendingText,
}: {
  children: ReactNode;
  pendingText: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={`${buttonStyles.primary} w-full`}>
      {pending ? pendingText : children}
    </button>
  );
}

export function Field({
  label,
  hint,
  ...props
}: ComponentProps<"input"> & { label: string; hint?: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-bold">{label}</span>
      <input
        {...props}
        className="block w-full rounded-control border border-line-strong bg-surface px-3 py-2.5 text-base outline-none placeholder:text-muted/70 focus:border-brand focus:ring-2 focus:ring-brand/20"
      />
      {hint && <span className="mt-1 block text-xs text-muted">{hint}</span>}
    </label>
  );
}

export function FormMessage({ state }: { state?: { error?: string; message?: string } }) {
  if (state?.error)
    return (
      <p role="alert" className="rounded-control bg-danger-soft px-3 py-2.5 text-sm text-danger">
        {state.error}
      </p>
    );
  if (state?.message)
    return (
      <p role="status" className="rounded-control bg-accent-soft px-3 py-2.5 text-sm text-accent">
        {state.message}
      </p>
    );
  return null;
}

export function TextLink(props: ComponentProps<typeof Link>) {
  return (
    <Link
      {...props}
      className={`font-bold text-brand underline-offset-2 hover:underline ${props.className ?? ""}`}
    />
  );
}

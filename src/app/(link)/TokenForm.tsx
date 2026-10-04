"use client";

import { useActionState, type ReactNode } from "react";
import type { FormState } from "@/app/actions";
import { FormMessage, SubmitButton } from "@/components/ui";

/** Formular med det skjulte token fra mailen og en server-handling. */
export function TokenForm({
  token,
  action,
  submit,
  pendingText,
  children,
}: {
  token: string;
  action: (state: FormState, form: FormData) => Promise<FormState>;
  submit: string;
  pendingText: string;
  children?: ReactNode;
}) {
  const [state, formAction] = useActionState(action, undefined);
  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="token" value={token} />
      {children}
      <FormMessage state={state} />
      <SubmitButton pendingText={pendingText}>{submit}</SubmitButton>
    </form>
  );
}

"use client";

import { useActionState } from "react";
import { login } from "@/app/actions";
import { Field, FormMessage, SubmitButton } from "@/components/ui";

export function LoginForm({ next }: { next: string }) {
  const [state, action] = useActionState(login, undefined);
  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="next" value={next} />
      <Field
        label="E-mail"
        name="email"
        type="email"
        autoComplete="email"
        defaultValue={state?.values?.email}
        required
      />
      <Field
        label="Adgangskode"
        name="password"
        type="password"
        autoComplete="current-password"
        required
      />
      <FormMessage state={state} />
      <SubmitButton pendingText="Logger ind …">Log ind</SubmitButton>
    </form>
  );
}

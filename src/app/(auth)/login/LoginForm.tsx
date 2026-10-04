"use client";

import { useActionState } from "react";
import { login } from "@/app/actions";
import { Field, FormMessage, SubmitButton, TextLink } from "@/components/ui";

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
      <div className="-mt-2 text-right text-sm">
        <TextLink href="/glemt">Glemt adgangskode?</TextLink>
      </div>
      <FormMessage state={state} />
      <SubmitButton pendingText="Logger ind …">Log ind</SubmitButton>
    </form>
  );
}

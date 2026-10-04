"use client";

import { useActionState } from "react";
import { login } from "@/app/actions";
import { Field, FormMessage, SubmitButton, TextLink } from "@/components/ui";

export function LoginForm({ next, linkError }: { next: string; linkError: boolean }) {
  const [state, action] = useActionState(
    login,
    linkError
      ? { error: "Linket er udløbet eller allerede brugt. Log ind, eller bed om et nyt." }
      : undefined,
  );
  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="next" value={next} />
      <Field label="E-mail" name="email" type="email" autoComplete="email" required />
      <Field
        label="Adgangskode"
        name="password"
        type="password"
        autoComplete="current-password"
        required
      />
      <div className="-mt-1 text-right text-sm">
        <TextLink href="/glemt-adgangskode">Glemt adgangskode?</TextLink>
      </div>
      <FormMessage state={state} />
      <SubmitButton pendingText="Logger ind …">Log ind</SubmitButton>
    </form>
  );
}

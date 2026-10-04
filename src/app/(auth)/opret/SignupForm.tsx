"use client";

import { useActionState } from "react";
import { signup } from "@/app/actions";
import { Field, FormMessage, SubmitButton } from "@/components/ui";

export function SignupForm() {
  const [state, action] = useActionState(signup, undefined);
  return (
    <form action={action} className="space-y-4">
      <Field
        label="Navn"
        name="full_name"
        autoComplete="name"
        defaultValue={state?.values?.full_name}
        required
      />
      <Field
        label="Skole"
        name="school"
        autoComplete="organization"
        placeholder="Fx Søndermarkskolen"
        defaultValue={state?.values?.school}
        required
      />
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
        autoComplete="new-password"
        minLength={8}
        hint="Mindst 8 tegn."
        required
      />
      <FormMessage state={state} />
      <SubmitButton pendingText="Opretter …">Opret bruger</SubmitButton>
    </form>
  );
}

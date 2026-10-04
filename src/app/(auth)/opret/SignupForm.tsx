"use client";

import { useActionState } from "react";
import { signup } from "@/app/actions";
import { NewPasswordFields } from "@/components/NewPasswordFields";
import { Field, FormMessage, SubmitButton, TextLink } from "@/components/ui";

export function SignupForm() {
  const [state, action] = useActionState(signup, undefined);

  if (state?.sent)
    return (
      <div role="status" className="space-y-3">
        <p className="rounded-control bg-brand-soft px-4 py-3 text-ink">
          Vi har sendt en mail til <strong>{state.sent}</strong> med et link. Klik på det for at
          bekræfte din e-mail — så er din bruger klar.
        </p>
        <p className="text-sm text-muted">
          Ingen mail efter et par minutter? Tjek spam, eller <TextLink href="/login">log ind</TextLink> for at få et nyt link.
        </p>
      </div>
    );

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
      <NewPasswordFields />
      <FormMessage state={state} />
      <SubmitButton pendingText="Opretter …">Opret bruger</SubmitButton>
    </form>
  );
}

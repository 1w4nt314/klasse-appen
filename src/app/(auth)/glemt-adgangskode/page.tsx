"use client";

import { useActionState } from "react";
import { requestPasswordReset } from "@/app/actions";
import { Field, FormMessage, SubmitButton, TextLink } from "@/components/ui";
import { AuthCard } from "../AuthCard";

export default function ForgotPasswordPage() {
  const [state, action] = useActionState(requestPasswordReset, undefined);
  return (
    <AuthCard
      title="Glemt adgangskode"
      intro="Skriv din e-mail, så sender vi et link hvor du kan vælge en ny."
      footer={<TextLink href="/login">Tilbage til log ind</TextLink>}
    >
      {state?.message ? (
        <FormMessage state={state} />
      ) : (
        <form action={action} className="space-y-4">
          <Field label="E-mail" name="email" type="email" autoComplete="email" required />
          <FormMessage state={state} />
          <SubmitButton pendingText="Sender …">Send link</SubmitButton>
        </form>
      )}
    </AuthCard>
  );
}

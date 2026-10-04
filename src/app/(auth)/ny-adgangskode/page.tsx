"use client";

import { useActionState } from "react";
import { updatePassword } from "@/app/actions";
import { Field, FormMessage, SubmitButton } from "@/components/ui";
import { AuthCard } from "../AuthCard";

export default function NewPasswordPage() {
  const [state, action] = useActionState(updatePassword, undefined);
  return (
    <AuthCard title="Vælg ny adgangskode">
      <form action={action} className="space-y-4">
        <Field
          label="Ny adgangskode"
          name="password"
          type="password"
          autoComplete="new-password"
          minLength={8}
          hint="Mindst 8 tegn."
          required
        />
        <FormMessage state={state} />
        <SubmitButton pendingText="Gemmer …">Gem adgangskode</SubmitButton>
      </form>
    </AuthCard>
  );
}

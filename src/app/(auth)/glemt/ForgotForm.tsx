"use client";

import { useActionState } from "react";
import { requestPasswordReset } from "@/app/actions";
import { Field, FormMessage, SubmitButton } from "@/components/ui";

export function ForgotForm() {
  const [state, action] = useActionState(requestPasswordReset, undefined);
  if (state?.notice)
    return (
      <p role="status" className="rounded-control bg-brand-soft px-4 py-3 text-ink">
        {state.notice}
      </p>
    );
  return (
    <form action={action} className="space-y-4">
      <Field
        label="E-mail"
        name="email"
        type="email"
        autoComplete="email"
        defaultValue={state?.values?.email}
        required
      />
      <FormMessage state={state} />
      <SubmitButton pendingText="Sender …">Send link</SubmitButton>
    </form>
  );
}

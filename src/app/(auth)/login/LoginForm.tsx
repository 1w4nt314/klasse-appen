"use client";

import { useActionState } from "react";
import { login, resendVerification } from "@/app/actions";
import { buttonStyles, Field, FormMessage, SubmitButton, TextLink } from "@/components/ui";

export function LoginForm({ next }: { next: string }) {
  const [state, action] = useActionState(login, undefined);
  return (
    <div className="space-y-4">
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
      {state?.unverified && <ResendVerification email={state.values?.email ?? ""} />}
    </div>
  );
}

function ResendVerification({ email }: { email: string }) {
  const [state, action, pending] = useActionState(resendVerification, undefined);
  if (state?.notice)
    return (
      <p role="status" className="rounded-control bg-brand-soft px-3 py-2.5 text-sm text-ink">
        {state.notice}
      </p>
    );
  return (
    <form action={action}>
      <input type="hidden" name="email" value={email} />
      <button type="submit" disabled={pending} className={`${buttonStyles.secondary} w-full`}>
        {pending ? "Sender …" : "Send bekræftelseslinket igen"}
      </button>
    </form>
  );
}

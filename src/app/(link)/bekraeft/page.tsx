import type { Metadata } from "next";
import { AuthCard } from "@/app/(auth)/AuthCard";
import { confirmSignup } from "@/app/actions";
import { Field, TextLink } from "@/components/ui";
import { findPendingSignup } from "@/lib/pending-signups";
import { TokenForm } from "../TokenForm";

// Tokenet står i adressen — send det aldrig videre i en Referer.
export const metadata: Metadata = { title: "Bekræft e-mail", referrer: "no-referrer" };

export default async function ConfirmPage({ searchParams }: PageProps<"/bekraeft">) {
  const { token } = await searchParams;
  const pending = typeof token === "string" ? findPendingSignup(token) : null;

  if (!pending || typeof token !== "string")
    return (
      <AuthCard
        title="Linket virker ikke"
        intro="Linket er udløbet eller allerede brugt. Er din bruger allerede oprettet, kan du bare logge ind. Ellers kan du oprette dig igen."
        footer={
          <>
            <TextLink href="/login">Log ind</TextLink> · <TextLink href="/opret">Opret igen</TextLink>
          </>
        }
      >
        {null}
      </AuthCard>
    );

  return (
    <AuthCard
      title="Bekræft din e-mail"
      intro={
        <>
          Skriv den adgangskode, du valgte til <strong>{pending.email}</strong>. Har du ikke selv prøvet at
          oprette en bruger, kan du bare lukke siden — så bliver der ikke oprettet noget.
        </>
      }
    >
      <TokenForm token={token} action={confirmSignup} submit="Bekræft min e-mail" pendingText="Bekræfter …">
        <Field
          label="Adgangskode"
          name="password"
          type="password"
          autoComplete="current-password"
          maxLength={200}
          required
        />
      </TokenForm>
    </AuthCard>
  );
}

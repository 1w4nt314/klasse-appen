import type { Metadata } from "next";
import { AuthCard } from "@/app/(auth)/AuthCard";
import { resetPassword } from "@/app/actions";
import { NewPasswordFields } from "@/components/NewPasswordFields";
import { TextLink } from "@/components/ui";
import { peekToken } from "@/lib/auth-tokens";
import { TokenForm } from "../TokenForm";

// Tokenet står i adressen — send det aldrig videre i en Referer.
export const metadata: Metadata = { title: "Ny adgangskode", referrer: "no-referrer" };

export default async function ResetPage({ searchParams }: PageProps<"/nulstil">) {
  const { token } = await searchParams;
  const valid = typeof token === "string" && peekToken(token, "reset") !== null;

  if (!valid)
    return (
      <AuthCard
        title="Linket virker ikke"
        intro="Linket er udløbet eller allerede brugt. Links til at nulstille adgangskoden virker i 1 time og kun én gang."
        footer={<TextLink href="/glemt">Bed om et nyt link</TextLink>}
      >
        {null}
      </AuthCard>
    );

  return (
    <AuthCard
      title="Vælg ny adgangskode"
      intro="Når du gemmer, bliver du logget ud alle andre steder."
    >
      <TokenForm token={token} action={resetPassword} submit="Gem ny adgangskode" pendingText="Gemmer …">
        <NewPasswordFields />
      </TokenForm>
    </AuthCard>
  );
}

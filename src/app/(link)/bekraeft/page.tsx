import type { Metadata } from "next";
import { AuthCard } from "@/app/(auth)/AuthCard";
import { confirmEmail } from "@/app/actions";
import { TextLink } from "@/components/ui";
import { peekToken } from "@/lib/auth-tokens";
import { TokenForm } from "../TokenForm";

// Tokenet står i adressen — send det aldrig videre i en Referer.
export const metadata: Metadata = { title: "Bekræft e-mail", referrer: "no-referrer" };

export default async function ConfirmPage({ searchParams }: PageProps<"/bekraeft">) {
  const { token } = await searchParams;
  const valid = typeof token === "string" && peekToken(token, "verify") !== null;

  if (!valid)
    return (
      <AuthCard
        title="Linket virker ikke"
        intro="Linket er udløbet eller allerede brugt. Er din e-mail allerede bekræftet, kan du bare logge ind. Ellers kan du få et nyt link, når du logger ind."
        footer={<TextLink href="/login">Til log ind</TextLink>}
      >
        {null}
      </AuthCard>
    );

  return (
    <AuthCard title="Bekræft din e-mail" intro="Ét klik, så er din bruger klar.">
      <TokenForm
        token={token}
        action={confirmEmail}
        submit="Bekræft min e-mail"
        pendingText="Bekræfter …"
      />
    </AuthCard>
  );
}

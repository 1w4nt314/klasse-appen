import type { Metadata } from "next";
import { TextLink } from "@/components/ui";
import { emailEnabled } from "@/lib/mail";
import { AuthCard } from "../AuthCard";
import { ForgotForm } from "./ForgotForm";

export const metadata: Metadata = { title: "Glemt adgangskode" };

export default function ForgotPage() {
  if (!emailEnabled())
    return (
      <AuthCard
        title="Glemt adgangskode"
        intro="Nulstilling via e-mail er ikke slået til endnu. Kontakt Klasse-appen, så hjælper vi dig."
        footer={<TextLink href="/login">Tilbage til log ind</TextLink>}
      >
        {null}
      </AuthCard>
    );
  return (
    <AuthCard
      title="Glemt adgangskode"
      intro="Skriv den e-mail, du bruger på Klasse-appen. Findes den, sender vi et link, så du kan vælge en ny adgangskode."
      footer={
        <>
          Kom du i tanke om den? <TextLink href="/login">Log ind</TextLink>
        </>
      }
    >
      <ForgotForm />
    </AuthCard>
  );
}

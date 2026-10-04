import type { Metadata } from "next";
import { TextLink } from "@/components/ui";
import { AuthCard } from "../AuthCard";
import { ForgotForm } from "./ForgotForm";

export const metadata: Metadata = { title: "Glemt adgangskode" };

export default function ForgotPage() {
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

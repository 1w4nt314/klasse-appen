import type { Metadata } from "next";
import { TextLink } from "@/components/ui";
import { AuthCard } from "../AuthCard";
import { SignupForm } from "./SignupForm";

export const metadata: Metadata = { title: "Opret bruger" };

export default function SignupPage() {
  return (
    <AuthCard
      title="Opret gratis bruger"
      intro="Det tager et minut. Så har du adgang til alle apps."
      footer={
        <>
          Har du allerede en bruger? <TextLink href="/login">Log ind</TextLink>
        </>
      }
    >
      <SignupForm />
    </AuthCard>
  );
}

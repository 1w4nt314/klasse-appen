import type { Metadata } from "next";
import { TextLink } from "@/components/ui";
import { AuthCard } from "../AuthCard";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = { title: "Log ind" };

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const { next } = await searchParams;
  return (
    <AuthCard
      title="Log ind"
      intro="Velkommen tilbage. Dine apps venter."
      footer={
        <>
          Ny her? <TextLink href="/opret">Opret en gratis bruger</TextLink>
        </>
      }
    >
      <LoginForm next={typeof next === "string" ? next : "/apps"} />
    </AuthCard>
  );
}

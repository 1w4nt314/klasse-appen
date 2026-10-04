import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { requireAdmin } from "@/lib/session";
import { CreatureGallery } from "./CreatureGallery";

export async function generateMetadata(): Promise<Metadata> {
  await requireAdmin();
  return { title: "Figurer i Stillezoonen" };
}

/** Kun for platform-admin: alle figurer pr. tema, til at se nye tegninger igennem. */
export default async function CreaturesPage() {
  const admin = await requireAdmin();
  return (
    <>
      <SiteHeader teacher={admin} current="admin" />
      <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-10">
        <Link href="/admin" className="text-sm font-bold text-brand hover:underline">
          ← Brugere
        </Link>
        <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-brand-strong">
          Figurer i Stillezoonen
        </h1>
        <p className="mt-2 text-muted">
          Alle figurer pr. tema med sjældenhed. Figurer med særlig opførsel vises også i den positur
          (animeret), som de har, mens de står stille.
        </p>
        <CreatureGallery />
      </main>
    </>
  );
}

import type { Metadata } from "next";
import { apps } from "@/apps/registry";
import { SiteHeader } from "@/components/SiteHeader";
import { db } from "@/lib/db";
import { requireTeacher } from "@/lib/session";
import { AppGrid, type AppCardData } from "./AppGrid";

export const metadata: Metadata = { title: "Dine apps" };

export default async function AppsPage() {
  const teacher = await requireTeacher("/apps");

  const favorites = (
    db()
      .prepare("select app_slug from favorites where user_id = ? order by created_at")
      .all(teacher.id) as { app_slug: string }[]
  ).map((f) => f.app_slug);

  const cards: AppCardData[] = apps.map(({ Thumbnail, ...app }) => ({
    ...app,
    thumbnail: <Thumbnail />,
  }));

  const firstName = teacher.name.split(" ")[0];

  return (
    <>
      <SiteHeader teacher={teacher} />
      <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-10">
        <h1 className="font-display text-3xl font-semibold tracking-tight text-brand-strong sm:text-4xl">
          {firstName ? `Hej ${firstName}` : "Dine apps"}
        </h1>
        <p className="mt-2 text-muted">
          Vælg en app og sæt den op på tavlen. Stjern dem du bruger mest, så ligger de øverst.
        </p>
        <AppGrid apps={cards} initialFavorites={favorites} />
      </main>
    </>
  );
}

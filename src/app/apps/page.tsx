import type { Metadata } from "next";
import { apps } from "@/apps/registry";
import { SiteHeader } from "@/components/SiteHeader";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";
import { getTeacher } from "@/lib/session";
import { AppGrid, type AppCardData } from "./AppGrid";

export const metadata: Metadata = { title: "Dine apps" };

export default async function AppsPage() {
  const teacher = await getTeacher();

  let favorites: string[] = [];
  if (teacher) {
    const supabase = await createClient();
    const { data } = await supabase
      .from("favorites")
      .select("app_slug")
      .order("created_at");
    favorites = (data ?? []).map((f) => f.app_slug as string);
  }

  const cards: AppCardData[] = apps.map(({ Thumbnail, ...app }) => ({
    ...app,
    thumbnail: <Thumbnail />,
  }));

  const firstName = teacher?.name.split(" ")[0];

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
        {!isSupabaseConfigured && (
          <p className="mt-4 rounded-control border border-line bg-surface px-4 py-3 text-sm text-muted">
            <strong className="text-ink">Demo-tilstand:</strong> login er ikke koblet på, så
            favoritter gemmes kun i denne browser.
          </p>
        )}
        <AppGrid apps={cards} initialFavorites={favorites} persist={Boolean(teacher)} />
      </main>
    </>
  );
}

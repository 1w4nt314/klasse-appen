import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { db } from "@/lib/db";
import { requireTeacher } from "@/lib/session";
import { isCategory, isStatus } from "@/lib/wishes";
import { WishBoard, type Wish } from "./WishBoard";

export const metadata: Metadata = { title: "Ønsker" };

export default async function WishesPage({ searchParams }: PageProps<"/onsker">) {
  const teacher = await requireTeacher("/onsker");
  const { sort } = await searchParams;
  const newest = sort === "nyeste";

  const rows = db()
    .prepare(
      `select w.id, w.title, w.body, w.category, w.status, w.created_at, w.user_id,
              case when u.disabled_at is null then u.full_name end as author,
              case when u.disabled_at is null then u.school end as school,
              (select count(*) from wish_likes l join users lu on lu.id = l.user_id
                where l.wish_id = w.id and lu.disabled_at is null) as likes,
              exists(select 1 from wish_likes l where l.wish_id = w.id and l.user_id = ?) as liked
         from wishes w left join users u on u.id = w.user_id
        order by ${newest ? "w.created_at desc" : "likes desc, w.created_at desc"}
        limit 500`,
    )
    .all(teacher.id) as {
    id: string;
    title: string;
    body: string;
    category: string;
    status: string;
    created_at: number;
    user_id: string | null;
    author: string | null;
    school: string | null;
    likes: number;
    liked: number;
  }[];

  const wishes: Wish[] = rows.map((r) => ({
    id: r.id,
    title: r.title,
    body: r.body,
    // Tåler gamle eller ugyldige værdier i databasen.
    category: isCategory(r.category) ? r.category : "other",
    status: isStatus(r.status) ? r.status : "open",
    createdAt: r.created_at,
    author: r.author ?? "Tidligere bruger",
    school: r.school ?? "",
    likes: r.likes,
    liked: r.liked === 1,
    mine: r.user_id === teacher.id,
  }));

  return (
    <>
      <SiteHeader teacher={teacher} current="wishes" />
      <main className="mx-auto w-full max-w-4xl flex-1 px-5 py-10">
        <h1 className="font-display text-3xl font-semibold tracking-tight text-brand-strong sm:text-4xl">
          Ønsker
        </h1>
        <p className="mt-2 max-w-2xl text-muted">
          Hvad mangler du i klasseværelset? Foreslå en ny app eller en forbedring, og giv et
          hjerte til de ønsker, du også gerne vil have. De mest efterspurgte bliver bygget først.
        </p>
        <WishBoard wishes={wishes} sort={newest ? "nyeste" : "populære"} isAdmin={teacher.isAdmin} />
      </main>
    </>
  );
}

"use client";

import Link from "next/link";
import { useActionState, useOptimistic, useState, useTransition } from "react";
import { ConfirmButton } from "@/components/ConfirmButton";
import {
  MAX_BODY,
  MAX_TITLE,
  WISH_CATEGORIES,
  WISH_STATUSES,
  type WishCategory,
  type WishStatus,
} from "@/lib/wishes";
import { createWish, deleteWish, setLike, setWishStatus, type WishFormState } from "./actions";

export type Wish = {
  id: string;
  title: string;
  body: string;
  category: WishCategory;
  status: WishStatus;
  createdAt: number;
  author: string;
  school: string;
  likes: number;
  liked: boolean;
  mine: boolean;
};

const STATUS_STYLE: Record<WishStatus, string> = {
  open: "bg-canvas text-muted",
  planned: "bg-brand-soft text-brand",
  in_progress: "bg-accent-soft text-accent",
  done: "bg-[#e6f4ea] text-ok",
};

const dateFmt = new Intl.DateTimeFormat("da-DK", { day: "numeric", month: "short", year: "numeric" });

export function WishBoard({
  wishes,
  sort,
  isAdmin,
}: {
  wishes: Wish[];
  sort: "populære" | "nyeste";
  isAdmin: boolean;
}) {
  return (
    <div className="mt-8 space-y-8">
      <NewWishForm />

      <section aria-labelledby="wishes-heading">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 id="wishes-heading" className="text-lg font-extrabold">
            {wishes.length} {wishes.length === 1 ? "ønske" : "ønsker"}
          </h2>
          <nav className="flex rounded-control border border-line-strong p-0.5" aria-label="Sortering">
            {(
              [
                ["populære", "Mest efterspurgte", "/onsker"],
                ["nyeste", "Nyeste", "/onsker?sort=nyeste"],
              ] as const
            ).map(([key, label, href]) => (
              <Link
                key={key}
                href={href}
                aria-current={sort === key ? "page" : undefined}
                className="rounded-[4px] px-3 py-1 text-sm font-bold text-muted aria-[current=page]:bg-brand aria-[current=page]:text-white"
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>

        {wishes.length === 0 ? (
          <p className="mt-6 rounded-card border border-dashed border-line-strong p-8 text-center text-muted">
            Ingen ønsker endnu. Vær den første!
          </p>
        ) : (
          <ol className="mt-4 space-y-3">
            {wishes.map((w, i) => (
              <WishCard key={w.id} wish={w} rank={sort === "populære" ? i + 1 : null} isAdmin={isAdmin} />
            ))}
          </ol>
        )}
      </section>
    </div>
  );
}

function NewWishForm() {
  const [open, setOpen] = useState(false);
  const [state, action, pending] = useActionState(
    async (prev: WishFormState, form: FormData) => {
      const result = await createWish(prev, form);
      // Lukket igen efter et vellykket ønske, med en tak på knappen.
      if (result?.ok) setOpen(false);
      return result;
    },
    undefined,
  );

  if (!open)
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-expanded={false}
        className="w-full rounded-card border border-dashed border-line-strong bg-surface px-5 py-4 text-left font-bold text-brand hover:border-brand"
      >
        + Skriv et ønske
        {state?.ok && <span className="ml-2 font-normal text-ok">Tak! Dit ønske er på listen.</span>}
      </button>
    );

  return (
    <form action={action} className="space-y-4 rounded-card border border-line bg-surface p-5">
      <fieldset>
        <legend className="mb-1.5 text-sm font-bold">Hvad handler det om?</legend>
        <div className="flex flex-wrap gap-2">
          {(Object.entries(WISH_CATEGORIES) as [WishCategory, string][]).map(([key, label], i) => (
            <label
              key={key}
              className="cursor-pointer rounded-control border border-line-strong px-3 py-1.5 text-sm font-bold has-checked:border-brand has-checked:bg-brand has-checked:text-white"
            >
              <input type="radio" name="category" value={key} defaultChecked={i === 0} className="sr-only" />
              {label}
            </label>
          ))}
        </div>
      </fieldset>
      <label className="block">
        <span className="mb-1.5 block text-sm font-bold">Overskrift</span>
        <input
          name="title"
          required
          minLength={3}
          maxLength={MAX_TITLE}
          placeholder="Fx “En app til at øve tabeller”"
          className="block w-full rounded-control border border-line-strong bg-surface px-3 py-2.5 outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
        />
      </label>
      <label className="block">
        <span className="mb-1.5 block text-sm font-bold">
          Beskrivelse <span className="font-normal text-muted">(valgfri)</span>
        </span>
        <textarea
          name="body"
          rows={4}
          maxLength={MAX_BODY}
          placeholder="Hvordan skal det virke, og hvordan vil du bruge det i klassen?"
          className="block w-full rounded-control border border-line-strong bg-surface px-3 py-2.5 outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
        />
      </label>
      {state?.error && (
        <p role="alert" className="rounded-control bg-danger-soft px-3 py-2 text-sm text-danger">
          {state.error}
        </p>
      )}
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={pending}
          className="rounded-control bg-brand px-5 py-2.5 font-bold text-white hover:bg-brand-strong disabled:opacity-60"
        >
          {pending ? "Gemmer …" : "Del ønsket"}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="rounded-control border border-line-strong px-4 py-2.5 font-bold hover:border-brand hover:text-brand"
        >
          Annullér
        </button>
      </div>
      <p className="text-xs text-muted">Dit navn og din skole vises ved ønsket.</p>
    </form>
  );
}

function WishCard({ wish, rank, isAdmin }: { wish: Wish; rank: number | null; isAdmin: boolean }) {
  const [, start] = useTransition();
  const [like, setOptimistic] = useOptimistic({ liked: wish.liked, likes: wish.likes });

  const toggle = () =>
    start(async () => {
      const next = !like.liked;
      setOptimistic({ liked: next, likes: like.likes + (next ? 1 : -1) });
      await setLike(wish.id, next);
    });

  return (
    <li className="flex gap-4 rounded-card border border-line bg-surface p-4">
      <button
        type="button"
        onClick={toggle}
        aria-pressed={like.liked}
        aria-label={`${like.liked ? "Fjern dit hjerte fra" : "Giv et hjerte til"} “${wish.title}” (${like.likes})`}
        className="flex w-14 shrink-0 flex-col items-center justify-center rounded-control border border-line-strong py-2 text-muted hover:border-danger hover:text-danger aria-pressed:border-danger aria-pressed:bg-danger-soft aria-pressed:text-danger"
      >
        <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
          <path
            d="M12 20.5s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.6a4.3 4.3 0 0 1 7.5 2.7c0 5.6-7.5 10.2-7.5 10.2Z"
            fill={like.liked ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
        </svg>
        <span className="mt-0.5 text-sm font-extrabold tabular-nums">{like.likes}</span>
      </button>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          {rank !== null && <span className="text-sm font-extrabold text-muted tabular-nums">#{rank}</span>}
          <h3 className="font-extrabold">{wish.title}</h3>
        </div>
        <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs">
          <span className="rounded-control bg-brand-soft px-1.5 py-0.5 font-bold text-brand">
            {WISH_CATEGORIES[wish.category] ?? wish.category}
          </span>
          <span className={`rounded-control px-1.5 py-0.5 font-bold ${STATUS_STYLE[wish.status] ?? ""}`}>
            {WISH_STATUSES[wish.status] ?? wish.status}
          </span>
          <span className="text-muted">
            {wish.author}
            {wish.school && `, ${wish.school}`} · {dateFmt.format(wish.createdAt)}
          </span>
        </div>
        {wish.body && <p className="mt-2 whitespace-pre-line text-sm leading-relaxed">{wish.body}</p>}

        {(isAdmin || wish.mine) && (
          <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-line pt-3">
            {isAdmin && (
              <label className="flex items-center gap-1.5 text-xs font-bold text-muted">
                Status
                <select
                  defaultValue={wish.status}
                  onChange={(e) => start(() => setWishStatus(wish.id, e.target.value as WishStatus).then(() => {}))}
                  className="rounded-control border border-line-strong bg-surface px-2 py-1 text-xs font-bold text-ink"
                >
                  {(Object.entries(WISH_STATUSES) as [WishStatus, string][]).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>
            )}
            <ConfirmButton
              title="Slet ønsket?"
              message={
                <>
                  “{wish.title}” og alle dets hjerter bliver slettet. Det kan ikke fortrydes.
                </>
              }
              confirmLabel="Ja, slet"
              onConfirm={() => deleteWish(wish.id)}
              className="ml-auto rounded-control px-2.5 py-1 text-xs font-bold text-danger hover:bg-danger-soft"
            >
              Slet
            </ConfirmButton>
          </div>
        )}
      </div>
    </li>
  );
}

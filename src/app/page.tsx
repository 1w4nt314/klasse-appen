import Link from "next/link";
import { Thumbnail as ZooScene } from "@/apps/stillezoonen/Thumbnail";
import { SiteHeader } from "@/components/SiteHeader";
import { getTeacher } from "@/lib/session";

const STEPS = [
  {
    n: "1",
    title: "Sæt grænsen",
    text: "Træk stregen på lydmåleren til det niveau der passer til timen – gruppearbejde må gerne summe mere end stillelæsning.",
  },
  {
    n: "2",
    title: "Ro lokker dyrene frem",
    text: "Så længe klassen er under grænsen, kommer dyrene stille og roligt frem. Vælg mellem jungle, bondegård, akvarium, en planet fuld af søde rumvæsner, en dal med dinosaurer og den danske skov.",
  },
  {
    n: "3",
    title: "Larm skræmmer dem væk",
    text: "Bliver det for højt, stikker dyrene af. De kommer først tilbage, når der har været ro et øjeblik.",
  },
];

const PROMISES = [
  {
    title: "Gratis",
    text: "Alle apps er gratis for lærere. Ingen prøveperiode, ingen reklamer.",
  },
  {
    title: "Direkte i browseren",
    text: "Intet skal installeres. Åbn siden på smartboardet og tryk start.",
  },
  {
    title: "Lyd bliver i lokalet",
    text: "Stillezoonen måler kun lydniveauet lokalt. Intet optages eller sendes.",
  },
  {
    title: "Flere apps på vej",
    text: "Stillezoonen, Navnetrækker og Opgavelab er de første. Nye apps dukker op på din liste, når de er klar.",
  },
];

export default async function Home() {
  const teacher = await getTeacher();
  const primaryHref = teacher ? "/apps" : "/opret";

  return (
    <>
      <SiteHeader teacher={teacher} />
      <main className="flex-1">
        <section className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-14 md:grid-cols-[1fr_1.15fr] md:py-20">
          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-accent">
              Til lærere i grundskolen
            </p>
            <h1 className="mt-3 font-display text-4xl leading-[1.08] font-semibold tracking-tight text-brand-strong sm:text-5xl">
              Små apps til tavlen, der gør hverdagen i klassen lidt lettere.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted">
              Klasse-appen samler enkle, gratis værktøjer, du kan sætte op på
              smartboardet med ét klik. Opret en bruger, og du har adgang til
              alle apps – også dem der kommer senere.
            </p>
            <p className="mt-3 max-w-xl leading-relaxed text-muted">
              Fx Stillezoonen til ro i timen, Navnetrækker til tilfældige elever
              og Opgavelab, hvor du laver opgaveark med figurer og får svararket
              med ét klik.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={primaryHref}
                className="rounded-control bg-brand px-5 py-3 font-bold text-white hover:bg-brand-strong"
              >
                {teacher ? "Gå til dine apps" : "Opret gratis bruger"}
              </Link>
              {!teacher && (
                <Link
                  href="/login"
                  className="rounded-control border border-line-strong bg-surface px-5 py-3 font-bold hover:border-brand hover:text-brand"
                >
                  Log ind
                </Link>
              )}
            </div>
          </div>

          <figure>
            <div className="rounded-card border-[10px] border-[#2b3440] bg-[#2b3440] shadow-float">
              <div className="aspect-[16/10] overflow-hidden rounded-[3px]">
                <ZooScene />
              </div>
            </div>
            <div className="mx-auto h-3 w-1/3 rounded-b-card bg-[#3a4553]" />
            <figcaption className="mt-3 text-center text-sm text-muted">
              Stillezoonen på smartboardet: jo mere ro, jo flere dyr.
            </figcaption>
          </figure>
        </section>

        <section className="border-y border-line bg-surface">
          <div className="mx-auto max-w-6xl px-5 py-14">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="font-display text-3xl font-semibold tracking-tight text-brand-strong">
                Første app: Stillezoonen
              </h2>
              <p className="text-muted">Lydniveau gjort til noget eleverne kan se.</p>
            </div>
            <ol className="mt-8 grid gap-6 md:grid-cols-3">
              {STEPS.map((s) => (
                <li key={s.n} className="rounded-card border border-line p-5">
                  <span className="grid size-9 place-items-center rounded-control bg-accent-soft font-extrabold text-accent">
                    {s.n}
                  </span>
                  <h3 className="mt-4 text-lg font-extrabold">{s.title}</h3>
                  <p className="mt-1.5 leading-relaxed text-muted">{s.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 py-14">
          <dl className="grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
            {PROMISES.map((p) => (
              <div key={p.title} className="border-l-2 border-brand pl-4">
                <dt className="font-extrabold">{p.title}</dt>
                <dd className="mt-1 leading-relaxed text-muted">{p.text}</dd>
              </div>
            ))}
          </dl>
        </section>
      </main>
      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-wrap justify-between gap-2 px-5 py-6 text-sm text-muted">
          <span>Klasse-appen – gratis apps til klasseværelset</span>
        </div>
      </footer>
    </>
  );
}

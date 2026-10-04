# Klasse-appen

Gratis apps som lærere kan bruge i klasseværelset. Lærere opretter en bruger
(navn, skole, e-mail), og ser derefter en oversigt over alle apps, hvor de kan
stjerne deres favoritter.

**Stack:** Next.js 16 (App Router, TypeScript), Tailwind CSS v4, SQLite (Node's
indbyggede `node:sqlite`) — alt kører på én web-instans på Render. Ingen eksterne
tjenester.

## Apps

Hver app ligger i sin egen mappe under [`src/apps/`](src/apps):

```
src/apps/
  registry.ts        ← liste over alle apps (manifester)
  runtime.tsx        ← slug → app-komponent (indlæses først når appen åbnes)
  types.ts
  stillezoonen/        ← én mappe pr. app
    manifest.ts      ← navn, beskrivelse, tags, thumbnail
    Stillezoonen.tsx    ← selve appen (default export)
    ...
```

Alle apps vises automatisk for alle lærere på `/apps` og køres på `/apps/<slug>`.

**Ny app:** opret `src/apps/<slug>/` med `manifest.ts` og en default-eksporteret
klientkomponent, og tilføj den i `registry.ts` og `runtime.tsx`.

### Stillezoonen (V1)

Måler lydniveauet i klassen via mikrofonen (kun lokalt i browseren — intet
optages eller sendes). Så længe lyden er under lærerens grænse, kommer dyr
langsomt ind på skærmen. Bliver det for højt i mere end ¼ sekund, stikker
dyrene hurtigt af og kommer først igen efter 2 sekunders ro.

Der er fire temaer — jungle, bondegård, akvarium og alien planet — hver med sin
egen baggrund og sine egne figurer i `src/apps/stillezoonen/themes/<tema>/`
(`creatures.tsx`, `Background.tsx`, `index.ts`). Nyt tema: lav en mappe efter
samme skabelon og tilføj det i `themes/index.ts`. Felter og bevægelsesformer er
dokumenteret i `themes/types.ts`.

Læreren kan justere grænsen (træk i stregen på lydmåleren), hvor ofte der kommer
nye dyr (hvert 20./10./5. sekund) og hvor mange dyr der højst må være. Indstillingerne
huskes i browseren.

## Lokal udvikling

```bash
npm install
npm run dev
```

Databasen oprettes automatisk i `./data/klasse-appen.db` ved første request.
Findes mappen `/var/data` (Render-disk), bruges den i stedet. `DATA_DIR`
overstyrer begge. Tabellerne (`users`, `sessions`, `favorites`)
oprettes/migreres af [`src/lib/db.ts`](src/lib/db.ts).

## Login

Egen login uden eksterne tjenester: adgangskoder hashes med scrypt, sessioner er
tilfældige tokens i en httpOnly-cookie (30 dage), og loginforsøg begrænses pr.
IP/e-mail. Der er ingen mailudsendelse, så der er hverken e-mailbekræftelse eller
"glemt adgangskode" i V1.

## Deploy på Render

`render.yaml` er et Blueprint: *New → Blueprint* og vælg repoet. Det opretter en
web service med en 1 GB persistent disk monteret på `/var/data`, hvor databasen
ligger.

> Persistent disk kræver en betalt instans (Starter). På gratis-planen er
> filsystemet midlertidigt, så alle brugere forsvinder ved hvert deploy.
> Med disk kan der kun køre én instans ad gangen (det er fint her).

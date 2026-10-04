# Klasse-appen

Gratis apps som lærere kan bruge i klasseværelset. Lærere opretter en bruger
(navn, skole, e-mail), og ser derefter en oversigt over alle apps, hvor de kan
stjerne deres favoritter.

**Stack:** Next.js 16 (App Router, TypeScript), Tailwind CSS v4, Supabase (Auth +
Postgres), hosting på Render.

## Apps

Hver app ligger i sin egen mappe under [`src/apps/`](src/apps):

```
src/apps/
  registry.ts        ← liste over alle apps (manifester)
  runtime.tsx        ← slug → app-komponent (indlæses først når appen åbnes)
  types.ts
  klasse-zoo/        ← én mappe pr. app
    manifest.ts      ← navn, beskrivelse, tags, thumbnail
    KlasseZoo.tsx    ← selve appen (default export)
    ...
```

Alle apps vises automatisk for alle lærere på `/apps` og køres på `/apps/<slug>`.

**Ny app:** opret `src/apps/<slug>/` med `manifest.ts` og en default-eksporteret
klientkomponent, og tilføj den i `registry.ts` og `runtime.tsx`.

### Klasse Zoo (V1)

Måler lydniveauet i klassen via mikrofonen (kun lokalt i browseren — intet
optages eller sendes). Så længe lyden er under lærerens grænse, går jungledyr
langsomt ind på skærmen. Bliver det for højt i mere end ¼ sekund, stikker
dyrene hurtigt af og kommer først igen efter 2 sekunders ro.

Læreren kan justere grænsen (træk i stregen på lydmåleren), hvor ofte der kommer
nye dyr (hvert 20./10./5. sekund) og hvor mange dyr der højst må være. Indstillingerne
huskes i browseren.

## Lokal udvikling

```bash
npm install
cp .env.example .env.local   # udfyld Supabase-nøgler (valgfrit)
npm run dev
```

Uden Supabase-nøgler kører sitet i **demo-tilstand**: alle apps kan åbnes uden
login, og favoritter gemmes kun i browseren.

## Opsætning af Supabase

1. Opret et Supabase-projekt (region EU).
2. Kør [`supabase/migrations/0001_init.sql`](supabase/migrations/0001_init.sql)
   i SQL-editoren (opretter `profiles`, `favorites`, RLS og trigger).
3. **Authentication → URL Configuration:** sæt *Site URL* til sitets adresse og
   tilføj `https://<dit-domæne>/auth/confirm` (og `http://localhost:3000/auth/confirm`)
   under *Redirect URLs*.
4. Sæt `NEXT_PUBLIC_SUPABASE_URL` og `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.

## Deploy på Render

`render.yaml` er et Blueprint: *New → Blueprint* og vælg repoet. Udfyld de tre
miljøvariabler (`NEXT_PUBLIC_*` bages ind ved build, så redeploy efter ændringer).

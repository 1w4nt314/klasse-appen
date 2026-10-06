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

### Opgavelab (V1)

Laver opgaveark i A4 med figurer, regneark og formler – og et ét-klik-svarark.
Læreren lægger objekter på arket, trækker i figurernes hjørner og håndtag (mål
følger med live), skjuler og omdøber størrelser (fx vinkel A → X) og trykker
"Find X" for at få et nummereret regnestykke (`1a  X = ________`). "Eksporter"
henter to PDF-filer: opgaven (uden facit) og svararket (med udregning og alle
værdier).

- **Figurer (11):** retvinklet trekant, fri trekant, rektangel, kvadrat,
  parallelogram, trapez, cirkel (2D) og kasse, terning, cylinder, kugle (3D i
  kavalerperspektiv med stiplede skjulte kanter). Afledte mål (areal, omkreds,
  rumfang, overflade) kan vises eller findes. Svararket regner på de *viste* tal
  og skriver "≈" ved afrunding og ved π.
- **Regneark:** plus-, minus-, gange- og divisionsstykker (også "med rest" og
  decimaler) i 1-4 kolonner, nummereret 1a, 1b … Opgaverne laves ud fra et
  gemt seed, så arket er det samme ved genindlæsning; "Nye tal" trækker et nyt.
- **Formler:** egne stykker, ét pr. linje (`3*(4+5)`, `10 : 4`, `2 · π`, `√16`).
  Facit regnes ud af en lille indbygget parser (ingen `eval`); fejl vises pr.
  linje i panelet og som "= ?" på svararket. Højst 20 linjer à 80 tegn.
- **Datamodel:** et dokument er `{ schemaVersion: 1, objects: [...] }` med
  objekttyperne `text`, `figure` (`figure` = nøglen i registry'et, `shape` = de
  rå mål i mm, `params` = synlighed/alias), `calc` (Find-regnestykke), `drill`
  (regneark: `seed` + `config`) og `formula` (`lines`, `decimals`). Typerne ligger
  i `model/types.ts`, valideringen i `model/validate.ts` (alt fra klienten
  valideres igen på serveren). Regnearks-opgaver gemmes ikke, kun `seed` og
  `config`; `core/drill.ts` genskaber dem deterministisk.
- **Koden** ligger i `src/apps/opgavelab/`: `core/` (ren matematik: figurer,
  løsningsmotor `solveKit`, regneark, formelparser, nummerering — testes uden
  browser), `figures/` (tegning og værktøjsknap pr. figur), `model/`
  (dokumentformat og validering), `render/` (arket som ren SVG, samme komponent
  på skærmen og i PDF), `editor/` (værktøjer, ark, egenskabspanel) og `export/`
  (PDF med jsPDF + svg2pdf.js og indlejret DejaVu Sans fra `public/fonts/`).
- **Ny figur:** lav `core/<figur>.ts` (geometri + Find-regler som en `FigureSpec`),
  `figures/<figur>.tsx` (tegning og etiketter) og tilføj én linje i `DEFS` i
  `figures/registry.ts`, hvor fremgangsmåden står trin for trin. Værktøjsknap,
  validering, træk, svarark, nummerering og PDF følger automatisk.
- Gem/indlæs sker som server actions i `actions.ts` på lærerens egen konto
  (ejerskab tjekkes i hver action; JSON maks. 200 KB og valideres i
  `model/validate.ts`).
- Tastatur: Tab når alle knapper og objekter på arket, Enter markerer, piletaster
  flytter (1 mm, Shift 5 mm) eller ændrer et markeret hjørne, Delete sletter,
  Ctrl+Z fortryder, Escape afmarkerer.

## Lokal udvikling

```bash
npm install
npm run dev
```

Databasen oprettes automatisk i `./data/klasse-appen.db` ved første request.
Findes mappen `/var/data` (Render-disk), bruges den i stedet. `DATA_DIR`
overstyrer begge. Tabellerne (`users`, `sessions`, `favorites`,
`opgavelab_docs` — lærerens gemte opgaveark, unikke navne pr. lærer)
oprettes/migreres af [`src/lib/db.ts`](src/lib/db.ts).

## Login

Egen login: adgangskoder hashes med scrypt, sessioner er tilfældige tokens i en
httpOnly-cookie (30 dage), og loginforsøg begrænses pr. IP, IP+e-mail og konto
(med "kendt enhed"-cookie, så en elev på skolens net ikke låser lærerne ude).

Ved oprettelse skrives adgangskoden to gange. **E-mailbekræftelse** og **glemt
adgangskode** sender mails via [Resend](https://resend.com), når disse
miljøvariabler er sat (fx på Render → Environment):

| Variabel | Eksempel | |
|---|---|---|
| `RESEND_API_KEY` | `re_…` | API-nøgle fra Resend |
| `EMAIL_FROM` | `Klasse-appen <noreply@klasse-appen.dk>` | Afsender på et domæne, der er verificeret i Resend |
| `APP_URL` | `https://klasse-appen.dk` | Adressen i links. Sæt den, når sitet får sit eget domæne — ellers peger links på Renders `RENDER_EXTERNAL_URL` (`*.onrender.com`). I produktion bruges Host-headeren aldrig |

- **Uden** `RESEND_API_KEY`/`EMAIL_FROM` oprettes nye brugere som før (straks
  aktive), og "glemt adgangskode" siger, at det ikke er slået til endnu.
- **Med** dem oprettes brugeren først, når linket i mailen er brugt (gælder 24
  timer) *sammen med* den adgangskode, der blev valgt. Indtil da er oprettelsen
  kun "ventende" (egen tabel), så en fremmed hverken kan reservere, slette eller
  overtage en lærers mail. Linket åbner en side med en knap, så mail-scannere
  ikke bruger det op. /opret og login svarer det samme, uanset om mailen findes
  (ejeren af en eksisterende bruger får en mail om, at nogen prøvede).
- Mails begrænses pr. IP (30 pr. kvarter — så får man en ærlig fejl) og pr.
  modtager (3 pr. kvarter, sendes bare ikke) med separate grænser for
  oprettelse og nulstilling. Fra lærerens egen kendte enhed
  gælder grænsen pr. modtager ikke for nulstilling.
- "Glemt adgangskode" svarer altid det samme, uanset om mailen findes. Linket
  virker i 1 time og én gang; en ny adgangskode logger brugeren ud alle andre
  steder.
- Brugere, der fandtes før bekræftelsen kom til, regnes som bekræftede.

## Platform-admin

Admin-rettigheder kan **kun** gives fra serverens shell (på Render: servicen →
*Shell*). Brugeren skal have oprettet sig på sitet først.

```bash
npm run admin -- list                  # vis alle admins
npm run admin -- grant lærer@skole.dk  # gør en bruger til admin
npm run admin -- revoke lærer@skole.dk # fjern admin igen
```

En admin har alt det samme som en lærer plus menupunktet **Brugere**, hvor alle
brugere vises (mail, navn, skole) og kan deaktiveres eller genaktiveres efter en
bekræftelse. Deaktiverede brugere logges ud med det samme; intet slettes.

## Ønsker

Under **Ønsker** kan alle lærere foreslå nye apps og forbedringer og give
hjerter til hinandens forslag. Listen kan sorteres efter mest efterspurgte.
Admin kan sætte status (Planlagt, I gang, Lavet) og fjerne opslag.

## Deploy på Render

`render.yaml` er et Blueprint: *New → Blueprint* og vælg repoet. Det opretter en
web service med en 1 GB persistent disk monteret på `/var/data`, hvor databasen
ligger.

> Persistent disk kræver en betalt instans (Starter). På gratis-planen er
> filsystemet midlertidigt, så alle brugere forsvinder ved hvert deploy.
> Med disk kan der kun køre én instans ad gangen (det er fint her).

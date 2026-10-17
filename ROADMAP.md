# Roadmap

Hvad der er lavet, hvad der kommer, og hvad der venter. Detaljer om hver app
står i [README.md](README.md). Lærernes egne forslag samles under **Ønsker** på
sitet. Prioriteringen her kan ændre sig, når de forslag kommer ind.

Sidst opdateret: oktober 2026.

## Lavet (live på Render)

### Platform
- Login med egen bruger (navn, skole, e-mail) og sessioner i httpOnly-cookie.
  Loginforsøg begrænses.
- E-mailbekræftelse og "glemt adgangskode" via Resend. Det slås til, når
  miljøvariablerne er sat (se *Åbne punkter*).
- App-oversigt med favoritter (stjerner).
- **Ønsker:** lærere foreslår apps og giver hjerter. Admin sætter status.
- **Platform-admin:** brugerliste (mail, navn, skole) og deaktivering med
  bekræftelse. Admin gives kun fra serverens shell.

### Stillezoonen
- Lydmåler i browseren (intet optages eller sendes). Dyr kommer ind, når der
  er stille, og stikker af ved larm.
- 6 temaer med 50 figurer hver: Jungle, Bondegård, Akvarium, Alien planet,
  Dino-dalen og Den danske skov.
- Justerbar grænse, tempo og maks. antal dyr, som huskes i browseren.

### Navnetrækker
- Træk tilfældige elever med animation. Ingen trækkes igen, før alle har været
  oppe, og fraværende springes over.
- Tilfældige grupper i valgfri størrelse.
- Klasselisterne gemmes kun i browseren.

### Opgavelab
- **Trin 1-3:**
  - A4-editor med retvinklet trekant, træk i hjørner og live mål.
  - Vis/skjul og omdøb størrelser.
  - "Find X" giver nummererede regnestykker (1a, 1b …).
  - Gem og indlæs på lærerens konto.
  - PDF-eksport af opgaven og svararket.
- **Trin 4-5:**
  - Fri trekant, rektangel, kvadrat, parallelogram, trapez og cirkel.
  - 3D-figurer: kasse, terning, cylinder og kugle.
  - Areal, omkreds, rumfang og overflade.
  - Regneark (+ − · :) og formelblok.
- **Flere A4-sider:**
  - Op til 20 sider med sidebjælke.
  - Objekter kan flyttes til en anden side.
  - Nummereringen fortsætter på tværs af siderne.
  - PDF'en får flere sider med "Side n af N".
- **Rettelse:** regnestykker følger altid deres figurs nummer, også når
  figuren flyttes.

## Næste skridt

1. **Opgavelab trin 6: ligninger.**
   - Opgaver med en ubekendt, fx `x + 3 = 7` og `2x − 5 = 9`.
   - Facit står på svararket.
   - Formelblokken regner i dag kun udtryk ud. Den kan ikke løse for x.
2. **Opgavelab trin 7: flere fag.** Datamodellen har allerede et fag-felt pr.
   dokument. Hvilke fag og opgavetyper skal afklares først.
3. **Flere figurer i Opgavelab** (måske):
   - Kegle og pyramide.
   - Sinus/cosinus-relationer som valgfri regel for trekanter.
4. **Sideoversigt i Opgavelab** (måske): små miniaturer af siderne, så man
   hurtigt kan hoppe mellem dem.

## Idéer til senere

- Dele opgaveark mellem lærere, fx på samme skole.
- Autogem eller kladde, så intet går tabt, hvis browseren lukkes.
- Deploy uden nedetid. I dag er der et kort udfald (502) ved hvert deploy,
  fordi der kører én instans med disk. Det kræver en anden Render-opsætning
  eller plan.

## Åbne punkter (drift)

- **Domæne:** `klasse-appen.dk` venter på aktivering hos Punktum dk. Når
  Render har verificeret domænet, sættes `APP_URL=https://klasse-appen.dk`.
- **Mail:** `RESEND_API_KEY` og `EMAIL_FROM` sættes på Render → Environment.
  Afsenderdomænet skal være verificeret i Resend.

## Kendte begrænsninger

- **Meget flade trekanter i Opgavelab:** facit på de afrundede tal kan afvige
  fra tegningen. Editoren viser en advarsel.
- **Gamle gemte opgaveark:** ark med regnestykker, der står forkert i forhold
  til deres figur, viser en advarsel, når de åbnes.

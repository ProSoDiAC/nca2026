# Prompt per Claude Code: NCA 2026 mobile web app su GitHub Pages

Incolla tutto quello che segue (da "CONTESTO" in giù) in Claude Code, da una cartella di repository vuota che contiene già `mock/` e `data/`.

---

## CONTESTO

Devi costruire una web app mobile-first (PWA statica) per la conferenza **NCA 2026 – The 24th IEEE International Symposium on Network Computing and Applications**, 10–13 novembre 2026, Syracuse Urban Center, Via Nino Bixio 1, 96100 Siracusa (Ortigia), Sicilia. Sito ufficiale di riferimento: https://www.nca-ieee.org/2026/

L'app sarà **ospitata su GitHub Pages** (solo file statici, nessun backend) e usata dai partecipanti sullo smartphone durante la conferenza.

Nella repository trovi:

- `mock/` – 4 file `.dc.html` con il mock visivo delle schermate (Main = Home, Program, News, Sessions). Sono la **fonte di verità per layout, colori, spaziature, tipografia, testi e comportamento**. Non sono eseguibili da soli (richiamano un runtime esterno): leggili come codice sorgente di riferimento e ricostruisci le schermate come componenti React. Leggi tutti e quattro i file prima di scrivere codice.
- `data/` – `program.json`, `sessions.json`, `news.json` con dati di esempio nel formato definitivo. Contengono segnaposto tra parentesi quadre (`[Chair name]`, `[Paper title 1]`…): vanno mostrati così come sono finché non vengono sostituiti con i dati reali.

## STACK

- React 18 + TypeScript + Vite
- Tailwind CSS (i design token sotto vanno in `tailwind.config`)
- React Router in modalità **HashRouter** (GitHub Pages non gestisce le rotte client-side con il refresh)
- Nessuna libreria UI pesante; icone SVG a tratto inline (copiale dal mock), niente emoji
- PWA: `manifest.webmanifest` + service worker (precache degli asset e dei JSON, funziona offline). Usa `vite-plugin-pwa` oppure un service worker scritto a mano

## CONFIGURAZIONE PER GITHUB PAGES

1. In `vite.config.ts` imposta `base: './'` (percorsi relativi, così funziona sia su `utente.github.io/repo/` sia con dominio custom).
2. I JSON stanno in `public/data/` e vanno letti con `fetch(`${import.meta.env.BASE_URL}data/program.json`)`, mai con percorsi assoluti che iniziano con `/`.
3. Manifest e service worker con `start_url` e `scope` relativi (`./`). Icone PWA 192 e 512 px generate dal motivo "rete di nodi" dell'hero (sfondo #0A2540, nodi teal e ocra).
4. Aggiungi `public/.nojekyll`.
5. Crea `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
  workflow_dispatch:
permissions:
  contents: read
  pages: write
  id-token: write
concurrency:
  group: pages
  cancel-in-progress: true
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist
  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

6. Nel `README.md` spiega: come avviare in locale (`npm i && npm run dev`), come attivare Pages (Settings → Pages → Source: **GitHub Actions**), come aggiornare i dati (modificare i JSON in `public/data/` e fare push), come usare un dominio custom.

## NAVIGAZIONE

Barra a tab fissa in basso con 4 voci: **Home, Program, News, Sessions**. Target touch ≥ 44 px, voce attiva evidenziata (bordo superiore teal + etichetta in grassetto), come nel mock. Il contenuto scorre sopra la barra; l'header di ogni pagina resta fisso dove il mock lo prevede (selettori giorno/sala nel Program).

## SEZIONI

**1. Home** (`mock/Main.dc.html`)
Hero blu notte con motivo a rete, "NCA 2026", nome esteso, date, luogo, due CTA ("View program", "Latest news"). Accessi rapidi in griglia 2×2 (Program, Chairs & papers, News, Venue → link a Google Maps https://www.google.com/maps/place/Syracuse+Urban+Center+congresso). Poi: About NCA, indirizzo sede, anteprima ultima news (da `news.json`), sponsor e patronage, contatto SpeakSicily (telefono cliccabile `tel:`).

**2. Program** (`mock/Program.dc.html`, dati `program.json`)
- Selettore giorno: Tue 10, Wed 11, Thu 12, Fri 13.
- Segmented control **"Sala A" / "Sala B"** (i testi devono essere in italiano come qui; anche nelle card e nei chip: "Sala A", "Sala B").
- Timeline verticale: orario a sinistra; a destra card con codice sessione, sala, titolo, chair, numero di paper. Le entry con `room: "all"` (pause, pranzo, registrazione) compaiono in entrambe le sale come righe sottili tratteggiate. Keynote e cerimonie hanno la card in ocra chiaro con chip scuro.
- Tap su una card `session` apre la sessione corrispondente in Sessions (apre già l'accordion giusto, giorno incluso, tramite query nell'hash, es. `#/sessions?id=A6`).
- Giorno e sala scelti vengono salvati in `localStorage`. All'apertura, se la data odierna rientra nel 10–13 novembre 2026 seleziona quel giorno, altrimenti il 10.

**3. News** (`mock/News.dc.html`, dati `news.json`)
Elenco in ordine inverso, la prima news come card in evidenza blu notte. Ogni news: chip categoria, data (se `null` mostra "[Date]"), titolo, sommario. Tap apre una pagina di dettaglio (`#/news/:id`) con il `body`.

**4. Sessions** (`mock/Sessions.dc.html`, dati `sessions.json`)
Filtro per giorno, elenco ad accordion. Sessione aperta: blocco **Session chair** (nome, affiliazione) e lista paper con orario, titolo, autori. Una sola sessione aperta per volta. Supporta il deep-link `?id=` dal Program. Aggiungi una ricerca testuale su titolo paper, autori e chair, con il campo sopra i filtri.

## DESIGN (dal mock, non cambiare)

- Colori: blu notte `#0A2540`, teal `#0E7C86` (testo teal su bianco `#0A5E66`), ocra `#E8A33D`, sfondo `#F4F7F8`, card bianche `#FFFFFF`, testo secondario `#4A5B6B`, tab inattive `#546574`.
- Font: **Sora** (titoli, 500/600/700) e **Inter** (testo, 400/500/600), autoospitati in `public/fonts` per funzionare offline.
- Raggi: card 16–20 px, chip 999 px. Nessuna ombra pesante, niente gradienti decorativi.
- Viewport di riferimento 390×844; deve funzionare da 360 a 430 px. Su schermi larghi centra l'app in una colonna max 480 px su sfondo `#E1E8EC`.
- Accessibilità: elementi interattivi come `<button>`/`<a>` reali, `aria-pressed` sui toggle, `aria-expanded` sugli accordion, `aria-label` sulle icone, contrasto testo ≥ 4.5:1, rispetta `prefers-reduced-motion`.

## DATI E CONTENUTI

- Non inventare mai orari, nomi, titoli o autori. Se un campo è un segnaposto `[…]`, mostralo così.
- Tutte le stringhe di interfaccia in un unico file `src/strings.ts` (inglese, tranne "Sala A/Sala B"), così si possono tradurre in seguito.
- Valida i JSON all'avvio con uno schema (zod) e mostra uno stato di errore leggibile se un file è malformato.
- Fuso orario della conferenza: Europe/Rome. Formatta le date da ISO (`2026-11-10`), senza dipendere dal fuso del dispositivo.

## CRITERI DI ACCETTAZIONE

1. `npm run build` passa senza errori TypeScript.
2. Le 4 schermate corrispondono al mock per layout, colori e testi.
3. Il toggle Sala A / Sala B e il selettore giorno cambiano davvero l'elenco, e la scelta è ricordata al riavvio.
4. Il tap su una sessione nel Program apre quella sessione in Sessions.
5. Dopo un primo caricamento, l'app funziona offline.
6. Il workflow GitHub Actions pubblica `dist/` su Pages e l'app si apre da `https://<utente>.github.io/<repo>/` con refresh su qualsiasi schermata senza 404.
7. Lighthouse mobile: Accessibility ≥ 95, PWA installabile.

## COME LAVORARE

Procedi per passi e committa a ogni passo: 1) scaffolding Vite + Tailwind + token, 2) layout con tab bar, 3) Home, 4) Program, 5) Sessions, 6) News, 7) PWA e offline, 8) workflow di deploy e README. Alla fine elenca eventuali differenze rispetto al mock e cosa serve per sostituire i dati segnaposto con quelli reali.

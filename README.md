# NCA 2026 – conference app

Mobile-first web app (installable PWA, works offline) for **NCA 2026 – The 24th IEEE International Symposium on Network Computing and Applications**, 10–13 November 2026, Syracuse Urban Center, Siracusa (Ortigia).

Static files only, hosted on GitHub Pages. Stack: React 18, TypeScript, Vite, Tailwind CSS, React Router (HashRouter), zod, vite-plugin-pwa.

## Run locally

```bash
npm i
npm run dev        # http://localhost:5173
npm run build      # production build in dist/
npm run preview    # serve dist/ locally (service worker active here)
```

Requires Node 20 or newer.

## Publish on GitHub Pages

1. Create a repository on GitHub and push this folder to the `main` branch:
   ```bash
   git remote add origin https://github.com/<user>/<repo>.git
   git push -u origin main
   ```
2. On GitHub: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. Every push to `main` runs `.github/workflows/deploy.yml`, which builds the app and publishes `dist/`. Progress is under the **Actions** tab.
4. The app is then at `https://<user>.github.io/<repo>/`.

Routes use the hash (`#/program`, `#/sessions?id=A6`, `#/news/<id>`), so refreshing any screen never gives a 404 on Pages.

## Update the data

All content lives in three JSON files in `public/data/`:

| File | Content |
|---|---|
| `program.json` | `rooms` (toggle order, first = default) and the timeline per day. Entry types: `break`, `social`, `session` (points to `sessions.json` via `sessionId`), `keynote`, `plenary`. `room: "all"` shows the entry in both rooms; `"showInAllRooms": true` shows an entry held in one room also in the other room's view (used for keynotes, opening and closing in Sala B). A workshop over two slots is two `session` entries with the same `sessionId`. |
| `sessions.json` | One item per session/workshop/track: `id`, `code` (chip label, e.g. `S1`, `W3`), `kind`, day, room, `start`/`end`, optional `slots` (when split by a break), `title`, `chair` (or `null` until known), `papers`. |
| `news.json` | News items, newest first. `date` is `"YYYY-MM-DD"` or `null` (shown as "[Date]"). Paragraphs in `body` are separated by a blank line (`\n\n`). |

### Adding papers and chairs

Find the session by `id` in `public/data/sessions.json` and fill `chair` and `papers`:

```json
{
  "id": "s1",
  "code": "S1",
  "title": "Network Protocols, Configuration & Management",
  "chair": { "name": "Jane Doe", "affiliation": "University of Somewhere" },
  "papers": [
    { "time": "11:00", "title": "Paper title", "authors": "A. Author, B. Author" }
  ]
}
```

`time`, `end` and `affiliation` are optional.

A workshop with its own running order can mix other items into `papers` with a `kind`:

```json
{ "kind": "talk", "time": "09:00", "end": "09:10", "title": "Opening" },
{ "kind": "keynote", "time": "09:10", "end": "09:50", "title": "Keynote Talk", "authors": "Speaker name" },
{ "kind": "heading", "title": "Session 1: Sub-session title" },
{ "time": "09:50", "end": "10:10", "title": "Paper title", "authors": "A. Author; B. Author" },
{ "kind": "break", "time": "10:30", "end": "11:00", "title": "Coffee Break" }
```

Only items without `kind` (or `"kind": "paper"`) are counted as papers in the Program. While `papers` is empty the session shows "The paper list will be published soon."; while `chair` is `null` the chair block is hidden.

Session ids: `s1`–`s9` (conference sessions), `w1`–`w8` (workshops), `industry`, `phd-forum`, `demo-poster`.

Edit the files, commit and push: the workflow republishes in about a minute. Phones that already installed the app pick up the new data the next time they open it while online (the service worker updates itself and reloads).

The files are validated at startup. If one is malformed (wrong field name, a time not in `HH:MM`, a date not in `YYYY-MM-DD`…), the app shows a readable error naming the file and the field instead of a blank screen. Check locally with `npm run dev` before pushing.

Values in square brackets (`[Chair name]`, `[Paper title 1]`…) are placeholders and are displayed as they are until replaced.

Interface texts are in `src/strings.ts`.

## Custom domain

1. In **Settings → Pages → Custom domain**, enter the domain (for example `app.nca-ieee.org`) and save. GitHub stores it with the Pages deployment.
2. At the DNS provider, add a `CNAME` record from that host to `<user>.github.io`.
3. When the certificate is issued, tick **Enforce HTTPS**.

No code change is needed: the build uses relative paths (`base: './'`), so the same build works under `/<repo>/` and at the root of a custom domain. If you prefer to keep the domain in the repository, add a file `public/CNAME` containing just the domain.

## PWA icons

The icons in `public/icons/` are generated from the hero's network motif. To regenerate after changing `scripts/make-icons.mjs`: `npm run icons`.

## Project layout

```
public/data/        JSON data (edit these)
public/fonts/       Sora and Inter, self-hosted for offline use
public/icons/       PWA icons
src/strings.ts      all interface texts
src/lib/            data loading + zod schemas, dates (Europe/Rome), storage
src/components/     tab bar, layout, day picker, icons
src/pages/          Home, Program, Sessions, News, News detail
mock/               original visual mocks (reference only, not built)
```

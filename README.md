# Bookshaven — Book Discovery Website

A book discovery, information, and reading-tracker site: search, curated "best of"
lists, a rule-based recommendation engine, an in-browser public-domain reader, and a
personal reading tracker (stored in the browser via `localStorage`).

This is a **plain, standard Vite + React + TypeScript + Tailwind CSS v4** project.
It was originally scaffolded in Figma Make; this version has the Figma-Make-only
tooling removed (a custom `vite.config.ts` plugin set, a `.figma/make/site.json`
import, and placeholder comments in `index.html`) so it installs and builds
cleanly in any normal environment — GitHub, your local machine, or any static
host — with **no design, color, or page changes**.

## Requirements

- Node.js 18.18+ (Node 20 LTS recommended)
- npm (or pnpm/yarn if you prefer — just delete the other lockfile mechanism)

## Getting started

```bash
npm install
npm run dev
```

Open the URL Vite prints (default `http://localhost:5173`).

## Building for production

```bash
npm run build
npm run preview   # optional: serve the production build locally to sanity-check it
```

The static output is written to `dist/`.

## Project structure

```
src/
  main.tsx            # React entrypoint, mounts <App /> and imports index.css
  App.tsx              # Wraps the router
  routes.tsx           # All page routes
  index.css            # Tailwind v4 import + design tokens (colors, fonts)
  components/
    Layout.tsx          # Header, footer, nav, search bar
    BookCard.tsx         # Book cover card (grid + horizontal variants)
    StarRating.tsx       # Star rating display
  pages/                # One file per route (Home, Search, Discover, Book,
                         # Genre, Author, Collection, FreeBooks, Reader,
                         # Tracker, 404)
  data/
    books.ts             # In-memory book catalog + lookup helpers
    collections.ts       # Curated "Best of" list definitions
  lib/
    discovery.ts         # Rule-based "What should I read?" + similar-books engine
    tracker.ts           # localStorage-backed reading tracker (shelves, goals)
    gutenberg.ts          # Fetches + parses plain-text Project Gutenberg editions
    readerPrefs.ts         # Reader background themes, font size, chapter progress
  styles/
    reader.css            # Typography for the in-browser reader (see below)
```

## In-browser reader (`/read/:slug`)

Public-domain books ("Read Free" on the book page or in `/free-books`) open in
`ReaderPage` instead of linking out to gutenberg.org. On load it:

1. Pulls the Project Gutenberg ebook ID out of the book's `gutenbergUrl`.
2. Fetches the plain-text edition directly from Project Gutenberg's file
   servers in the browser (`src/lib/gutenberg.ts`), tries a couple of known
   URL patterns, strips the legal boilerplate header/footer, and splits the
   remaining text into chapters (falling back to evenly sized "Parts" if no
   `CHAPTER`/`BOOK`/`PART` headings are detected).
3. Renders one chapter at a time in a styled `<article>` (serif typography,
   a rotated chapter label in the margin, an italic lead-in word on each
   paragraph) with a "Continue reading" teaser into the next chapter.
4. Lets the reader pick a background/paper theme (Parchment, Sepia, Bright
   White, Soft Gray, Night) and a text size, persisted to `localStorage` via
   `src/lib/readerPrefs.ts`.
5. If the person already has the book on their "Currently Reading" shelf
   (see the Tracker), turning pages updates that shelf's progress
   percentage automatically.

**A known limitation:** Project Gutenberg's servers don't reliably send
`Access-Control-Allow-Origin` headers, so this client-only fetch can be
blocked by the browser's CORS policy depending on network/browser — when
that happens the reader shows a clear error with a "Try again" button and a
direct link to read the book on gutenberg.org instead, rather than failing
silently. The reliable fix, and the one assumed by the site's broader
architecture plan, is a small backend proxy (e.g. a Cloudflare Worker) that
fetches and caches the parsed text server-side — see Section 21/22 of the
project plan for the intended `book_links`/caching design. This frontend
already isolates all of that logic behind `src/lib/gutenberg.ts`, so once
that proxy exists, only this one file needs to change.

## Notes on the current data layer

All book/collection data lives in `src/data/*.ts` as plain in-memory arrays —
there's no backend yet. The reading tracker (`src/lib/tracker.ts`) reads and
writes directly to `localStorage`, so shelves and reading goals are per-browser
and not synced anywhere.

This mirrors the "Phase 1–2" scope of the larger project plan (basic site +
discovery engine, no database yet). Swapping in a real backend later (e.g. an
API-backed `lib/books.ts`) shouldn't require touching any page component, since
every page already goes through the `data/` and `lib/` helper functions rather
than reaching into a database directly.

## Deployment

This is a standard client-rendered Vite SPA, so it deploys anywhere that serves
static files: Vercel, Netlify, Cloudflare Pages, GitHub Pages, or your own
server. Two things to check per host:

- **Client-side routing:** since this uses `react-router`'s `createBrowserRouter`,
  your host needs a rewrite rule that serves `index.html` for unknown paths
  (a "SPA fallback"). Most hosts (Vercel, Netlify, Cloudflare Pages) do this
  automatically; GitHub Pages needs a small workaround (a duplicated
  `404.html`, or switch to `createHashRouter`).
- **Base path:** if you deploy under a sub-path (e.g.
  `https://username.github.io/repo-name/`), set `base: '/repo-name/'` in
  `vite.config.ts`.

## What changed from the Figma Make export

- Removed the `.figma/make/site.json` import and the Figma-only Vite plugins
  (HTML placeholder injection, dev-server error-overlay replay, HMR boundary
  fallback, and the Figma "kit" preview route) from `vite.config.ts`.
- Replaced the `<!-- figma:... -->` placeholder comments in `index.html` with
  a normal static `<title>` and meta description.
- Swapped Figma-pinned pre-release dependency versions (an RC build of Vite 8,
  a nonexistent `react-router@8`) for real, current stable releases
  (`vite@^6`, `react-router@^7`).
- Dropped the `oxfmt` formatter and the `figma/make/*` CLI hook scripts, which
  call the Figma Make CLI and have no equivalent outside that environment.
- Everything under `src/` — every page, component, color, and font — is
  unchanged.

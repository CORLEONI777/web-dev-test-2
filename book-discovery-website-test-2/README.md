# Librarium — Book Discovery Website

A book discovery, information, and reading-tracker site: search, curated "best of"
lists, a rule-based recommendation engine, public-domain reading links, and a
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
                         # Genre, Author, Collection, FreeBooks, Tracker, 404)
  data/
    books.ts             # In-memory book catalog + lookup helpers
    collections.ts       # Curated "Best of" list definitions
  lib/
    discovery.ts         # Rule-based "What should I read?" + similar-books engine
    tracker.ts           # localStorage-backed reading tracker (shelves, goals)
```

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

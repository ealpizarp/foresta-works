# Foresta Works website

Static marketing site for Foresta Works, a Costa Rica studio that builds and maintains websites and light automation for local small businesses. Built with [Astro](https://astro.build) 7 and strict TypeScript.

Costa Rican Spanish lives at `/es/`; English at `/en/`. There is no database, CMS, authentication, or server-side rendering.

## Stack

| Layer | Choice |
| --- | --- |
| Site | Astro 7, static output, TypeScript (`astro/tsconfigs/strict` plus extra flags) |
| Runtime | Node.js 22.12 or newer (see `.nvmrc`) |
| i18n | `es` (html `es-CR`) default, `en`. Default locale is prefixed. Slugs differ by language. |
| Fonts | Fontsource at build time: Cormorant Garamond (serif), Instrument Sans (sans) |
| Images | `astro:assets` + sharp for editorial photos; decorative hero mockups in `public/images/mockup/` |
| Tests | Vitest (`npm test`) |
| Deploy | Cloudflare Workers: static `dist/` plus `src/edge/worker.ts`. Wrangler is not a project dependency; use `npx wrangler`. |

## Requirements

- Node.js 22.12 or newer.

## Run locally

From this directory:

```bash
nvm use          # 22.12+
npm install
npm run dev      # http://localhost:4321
```

| Command | What it does |
| --- | --- |
| `npm install` | Install dependencies. |
| `npm run dev` | Development server at `http://localhost:4321`. |
| `npm run check` | Typecheck and Astro diagnostics. |
| `npm test` | Tests for routes, locale cookie/nav, null contact URLs, and JSON-LD. |
| `npm run build` | Write the static site to `dist/`. |
| `npm run preview` | Serve `dist/` to review the production build. |

The first build downloads fonts from Fontsource and caches them under `node_modules/.astro/fonts`. That download needs network; later builds reuse the cache.

## Languages and URLs

Every page lives under `/es/…` or `/en/…`. Public slugs follow the language:

| Page | Spanish | English |
| --- | --- | --- |
| Home | `/es/` | `/en/` |
| Services | `/es/servicios/` | `/en/services/` |
| Automation | `/es/automatizacion/` | `/en/automation/` |
| Process | `/es/proceso/` | `/en/process/` |
| About | `/es/nosotros/` | `/en/about/` |
| Contact | `/es/contacto/` | `/en/contact/` |

Copy lives in `src/i18n/es.ts` (Costa Rican *usted*) and `src/i18n/en.ts`. Product names **Arranque**, **Crecimiento**, and **Inteligente** stay in Spanish in both locales.

Facts that do not change with language (business name, founder, contact IDs, plan IDs) live in `src/data/`. English and Spanish inner pages are separate files under `src/pages/[locale]/` that share a template; each file calls `localeStaticPathsFor(['es'])` or `(['en'])`.

### Locale cookie

`/` and legacy URLs without a locale prefix (`/servicios`, `/services`, …) redirect using the `fw_locale` cookie:

- In `astro dev`: Vite integration `src/edge/dev-locale.ts` plus `src/middleware.ts` (dev only).
- On Cloudflare: `src/edge/worker.ts`.

No cookie means Spanish. `astro.config.ts` only fixes cross-language slugs (`/en/servicios/` → `/en/services/`). Unprefixed URLs are **not** pinned to Spanish at build time; if they were, the cookie could not choose English.

In `astro dev`, `src/edge/dev-locale.ts` is inserted at the front of Vite’s middleware stack so it can read the request `Cookie` header. Astro middleware on prerendered pages does not see `Cookie` reliably, which is why the Vite integration exists.

`public/index.html` is a last-resort cookie/localStorage redirect for `/` if the worker is not in front of the assets.

## Layout

```
astro.config.ts             site URL, i18n, fonts, sitemap, cross-slug redirects
vitest.config.ts            `@/` alias for tests
wrangler.jsonc              dist/ assets + locale worker
public/                     favicon, webmanifests, cookie fallback `/`, mockup photos
src/
  assets/images/            editorial photos (astro:assets)
  data/                     business facts, plans, navigation, JSON-LD
  edge/dev-locale.ts        cookie redirects in `astro dev`
  edge/worker.ts            cookie redirects on Cloudflare
  i18n/                     locales, slugs, dictionaries, static paths
  layouts/BaseLayout.astro  <head>, SEO, fonts, header and footer
  middleware.ts             locale cookie in `astro dev` only
  pages/[locale]/           one file per public slug (es vs en)
  templates/                shared page bodies
  components/               header, footer, sections, UI
  styles/                   tokens and global CSS
```

Editorial photos (positioning, founder, closing band) go through `astro:assets`. Decorative hero mockups stay in `public/images/mockup/`.

## Unconfirmed business facts

Anything the business has not confirmed is `null` in `src/data/site.ts` (or the matching i18n field) and marked `TODO(business)` or `TODO(assets)`. While a field is `null`, the matching UI is omitted rather than filled with a placeholder:

- **WhatsApp** (`contact.whatsappNumber`): WhatsApp buttons and the contact form.
- **Email** (`contact.email`).
- **Hours** (`contact.hoursValue` in both i18n dictionaries).
- **Social** (`social.linkedin`, `social.instagram`, `social.facebook`).
- **Production origin**: environment variable `SITE_URL` (canonical URLs, Open Graph, sitemap, robots.txt). The default in `astro.config.ts` is a placeholder; confirm it before the first indexable deploy.
- **Official logo**: text wordmark (`Wordmark.astro`) and `public/favicon.svg`.
- **Street address**: omitted from JSON-LD until a public location is confirmed.

Stay, cancellation notice, and extra-hour amounts live in `src/data/services.ts` (`subscriptionNumbers`) and are interpolated into the subscription terms.

`ContactPanel.astro` logs a console warning in dev and builds when neither WhatsApp nor email is set.

## Contact form

There is no form backend. When a WhatsApp number is configured, the form is a `GET` to `https://wa.me/<number>`: the message travels in the `text` query parameter and WhatsApp opens with it ready. Nothing is stored here. The form is not rendered until a number exists.

## Deploy on Cloudflare Workers

```bash
npm run build
npx wrangler login      # once
npx wrangler deploy
```

`wrangler.jsonc` serves `dist/` and runs `src/edge/worker.ts` first, so `/` and legacy URLs respect the saved language. There are no secrets in this repository.

`dist/` is gitignored. Do not deploy a stale `dist/` folder: run `npm run build` immediately before `npx wrangler deploy`.

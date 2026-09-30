import { defineConfig, fontProviders } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { localeDevIntegration } from './src/edge/dev-locale';
import { hrefLang, locales } from './src/i18n/locales';
import { crossSlugRedirects, localeRedirect, localizePath } from './src/i18n/paths';

/**
 * Canonical production origin. Used for canonical URLs, Open Graph, the
 * sitemap and robots.txt. Override with a shell/CI environment variable,
 * e.g. `SITE_URL=https://staging.example.com npm run build`.
 *
 * TODO(business): confirm the final production domain before launch.
 */
const SITE_URL = process.env.SITE_URL ?? 'https://forestaworks.com';

export default defineConfig({
  site: SITE_URL,
  // Pages build to /ruta/index.html; Cloudflare's `auto-trailing-slash`
  // redirects /ruta → /ruta/ so each page has one canonical URL.
  trailingSlash: 'ignore',

  // Static output; deployable as plain files on Cloudflare Workers static assets.
  output: 'static',

  // Astro 7 defaults to JSX whitespace rules, which drop the space between
  // adjacent inline elements. This is a copy-heavy site; HTML-aware
  // compression is the safer default here.
  compressHTML: true,

  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en'],
    routing: {
      prefixDefaultLocale: true,
      redirectToDefaultLocale: false,
    },
  },

  redirects: crossSlugRedirects(),

  image: {
    // Emits a few :where() rules so `layout="constrained"|"full-width"` images
    // resize with their container without per-image CSS.
    responsiveStyles: true,
  },

  // Fonts are downloaded at build time and served from this origin; no
  // request to Google Fonts is made by visitors.
  fonts: [
    {
      provider: fontProviders.fontsource(),
      name: 'Cormorant Garamond',
      cssVariable: '--font-serif',
      weights: [400, 500, 600],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['Georgia', 'serif'],
    },
    {
      provider: fontProviders.fontsource(),
      name: 'Cormorant Garamond',
      cssVariable: '--font-serif',
      weights: [500],
      styles: ['italic'],
      subsets: ['latin'],
      fallbacks: ['Georgia', 'serif'],
    },
    {
      provider: fontProviders.fontsource(),
      name: 'Instrument Sans',
      cssVariable: '--font-sans',
      weights: [400, 500, 600],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['system-ui', 'sans-serif'],
    },
  ],

  integrations: [
    localeDevIntegration(),
    sitemap({
      i18n: {
        defaultLocale: 'es',
        locales: {
          es: 'es-CR',
          en: 'en',
        },
      },
      namespaces: { news: false, video: false, image: false, xhtml: true },
      filter(page) {
        const path = new URL(page).pathname;
        const locale = path.startsWith('/en') ? 'en' : 'es';
        return localeRedirect(path, locale) === null;
      },
      serialize(item) {
        const url = new URL(item.url);
        return {
          ...item,
          links: locales.map((locale) => ({
            url: new URL(localizePath(url.pathname, locale), url.origin).href,
            lang: hrefLang(locale),
          })),
        };
      },
    }),
  ],
});

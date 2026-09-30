import { locales, type Locale } from './locales';

/** Builds `/es/…` and `/en/…` from a single page file under `src/pages/[locale]/`. */
export function localeStaticPaths() {
  return locales.map((locale) => ({ params: { locale } }));
}

/** Restrict a shared page file to one locale so English can use a different slug. */
export function localeStaticPathsFor(only: readonly Locale[]) {
  return only.map((locale) => ({ params: { locale } }));
}

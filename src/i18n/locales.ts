/**
 * Locale registry. Mirrors the `i18n` block in astro.config.ts.
 * Routing prefixes are `es` and `en`. Spanish pages still use `es-CR` in
 * <html lang>, Open Graph and hreflang.
 */
export const locales = ['es', 'en'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'es';

export const LOCALE_COOKIE = 'fw_locale';

export function isLocale(value: string | undefined): value is Locale {
  return value === 'es' || value === 'en';
}

export function getLocale(currentLocale: string | undefined, pathname: string): Locale {
  if (isLocale(currentLocale)) return currentLocale;
  if (pathname === '/en' || pathname.startsWith('/en/')) return 'en';
  return defaultLocale;
}

/** BCP 47 tag for <html lang>. */
export function htmlLang(locale: Locale): string {
  return locale === 'en' ? 'en' : 'es-CR';
}

/** Open Graph expects an underscore-separated locale. */
export function toOpenGraphLocale(locale: Locale): string {
  return locale === 'en' ? 'en_US' : 'es_CR';
}

/** hreflang values: Costa Rican Spanish, generic English. */
export function hrefLang(locale: Locale): string {
  return locale === 'en' ? 'en' : 'es-CR';
}

import { en } from './en';
import { es } from './es';
import { getLocale, type Locale } from './locales';
import { localizePath } from './paths';

export { en } from './en';
export { es } from './es';
export {
  defaultLocale,
  getLocale,
  hrefLang,
  htmlLang,
  isLocale,
  locales,
  LOCALE_COOKIE,
  toOpenGraphLocale,
  type Locale,
} from './locales';
export {
  crossSlugRedirects,
  legacyRedirects,
  localeRedirect,
  localizePath,
  pageKeyFromSlug,
  routeSlugs,
  routes,
  staticLegacyRedirects,
  stripLocale,
  switchLocalePath,
  unprefixedFallbackRedirects,
  type RouteKey,
} from './paths';
export { localeStaticPaths, localeStaticPathsFor } from './static-paths';
export { applyLocaleNav } from './locale-nav';
export { localeFromCookieHeader, serializeLocaleCookie } from './cookie';

export type Messages = typeof es;

export function getMessages(locale: Locale): Messages {
  return locale === 'en' ? en : es;
}

export function interpolate(template: string, vars: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => vars[key] ?? '');
}

export function useI18n(
  astro: { currentLocale?: string | undefined; url: URL },
  override?: Locale,
) {
  const locale = override ?? getLocale(astro.currentLocale, astro.url.pathname);
  const t = getMessages(locale);
  return {
    locale,
    t,
    path: (href: string) => localizePath(href, locale),
  };
}

import { defaultLocale, isLocale, type Locale } from './locales';
import { localeFromCookieHeader } from './cookie';
import { localeRedirect } from './paths';

export interface LocaleNavDecision {
  readonly status: 301 | 302;
  readonly location: string;
  readonly locale: Locale;
}

/**
 * Shared by the Cloudflare worker, `astro dev` middleware, and tests.
 * `cookieHeader` is the raw `Cookie` request header (or null).
 */
export function applyLocaleNav(
  pathname: string,
  search: string,
  cookieHeader: string | null,
): LocaleNavDecision | null {
  const preferred = localeFromCookieHeader(cookieHeader) ?? defaultLocale;
  const target = localeRedirect(pathname, preferred);
  if (target === null) return null;

  const locale = target.match(/^\/(es|en)(?=\/|$)/)?.[1];
  if (!isLocale(locale)) return null;

  const status = pathname === '/' || pathname === '' ? 302 : 301;
  return { status, location: `${target}${search}`, locale };
}

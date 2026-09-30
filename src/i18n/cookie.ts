import { isLocale, LOCALE_COOKIE, type Locale } from './locales';

export const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

/** `Set-Cookie` / `document.cookie` value. Pass `secure` on HTTPS. */
export function serializeLocaleCookie(name: string, locale: string, secure: boolean): string {
  return (
    `${name}=${locale}; Path=/; Max-Age=${String(LOCALE_COOKIE_MAX_AGE)}; SameSite=Lax` +
    (secure ? '; Secure' : '')
  );
}

export function localeFromCookieHeader(header: string | null): Locale | null {
  if (header === null || header === '') return null;
  for (const part of header.split(';')) {
    const separator = part.indexOf('=');
    if (separator === -1) continue;
    const name = part.slice(0, separator).trim();
    const value = part.slice(separator + 1).trim();
    if (name === LOCALE_COOKIE && isLocale(value)) return value;
  }
  return null;
}

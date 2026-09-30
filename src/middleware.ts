import { defineMiddleware } from 'astro:middleware';
import { isLocale, LOCALE_COOKIE } from '@/i18n/locales';
import { LOCALE_COOKIE_MAX_AGE } from '@/i18n/cookie';
import { applyLocaleNav } from '@/i18n/locale-nav';

function setLocaleCookie(
  cookies: { set: (name: string, value: string, opts: object) => void },
  locale: string,
  secure: boolean,
) {
  cookies.set(LOCALE_COOKIE, locale, {
    path: '/',
    maxAge: LOCALE_COOKIE_MAX_AGE,
    sameSite: 'lax',
    secure,
  });
}

/**
 * Stores the language when a visitor lands on `/es/…` or `/en/…`.
 * Redirects for `/` and unprefixed URLs run in `src/edge/dev-locale.ts`
 * (dev) and `src/edge/worker.ts` (Cloudflare), which can read Cookie.
 */
export const onRequest = defineMiddleware((context, next) => {
  if (!import.meta.env.DEV) {
    return next();
  }

  const { pathname } = context.url;
  const current = context.currentLocale;
  const secure = context.url.protocol === 'https:';
  const cookieHeader =
    context.request.headers.get('cookie') ?? context.request.headers.get('Cookie');
  const decision = applyLocaleNav(pathname, context.url.search, cookieHeader);

  if (decision !== null) {
    setLocaleCookie(context.cookies, decision.locale, secure);
    return context.redirect(decision.location, decision.status);
  }

  if (isLocale(current)) {
    setLocaleCookie(context.cookies, current, secure);
  }

  return next();
});

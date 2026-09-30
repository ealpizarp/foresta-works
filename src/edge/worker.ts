import { isLocale, LOCALE_COOKIE } from '../i18n/locales';
import { serializeLocaleCookie } from '../i18n/cookie';
import { applyLocaleNav } from '../i18n/locale-nav';

interface AssetEnv {
  readonly ASSETS: { fetch: (request: Request) => Promise<Response> };
}

/**
 * Cookie-aware locale redirects for Cloudflare static assets.
 * `astro dev` uses `src/edge/dev-locale.ts` for the same decisions.
 */
export default {
  async fetch(request: Request, env: AssetEnv): Promise<Response> {
    const url = new URL(request.url);
    const decision = applyLocaleNav(url.pathname, url.search, request.headers.get('cookie'));

    if (decision !== null) {
      const headers = new Headers({ Location: decision.location });
      headers.set(
        'Set-Cookie',
        serializeLocaleCookie(LOCALE_COOKIE, decision.locale, url.protocol === 'https:'),
      );
      return new Response(null, { status: decision.status, headers });
    }

    const response = await env.ASSETS.fetch(request);
    const prefix = url.pathname.match(/^\/(es|en)(?=\/|$)/)?.[1];
    if (!isLocale(prefix)) return response;

    const headers = new Headers(response.headers);
    headers.append(
      'Set-Cookie',
      serializeLocaleCookie(LOCALE_COOKIE, prefix, url.protocol === 'https:'),
    );
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  },
};

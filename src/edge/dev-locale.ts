import type { IncomingMessage, ServerResponse } from 'node:http';
import type { AstroIntegration } from 'astro';
import { LOCALE_COOKIE } from '../i18n/locales';
import { serializeLocaleCookie } from '../i18n/cookie';
import { applyLocaleNav } from '../i18n/locale-nav';

/**
 * Cookie-aware locale redirects for `astro dev`. Injected at the front of
 * Vite's stack so `/` and unprefixed URLs never hit the prerendered 404
 * (which cannot read the Cookie header).
 */
export function localeDevIntegration(): AstroIntegration {
  return {
    name: 'fw-locale-dev',
    hooks: {
      'astro:server:setup'({ server }) {
        const handle = (req: IncomingMessage, res: ServerResponse, next: () => void): void => {
          if (req.method !== 'GET' && req.method !== 'HEAD') {
            next();
            return;
          }

          const host = req.headers.host ?? '127.0.0.1';
          const url = new URL(req.url ?? '/', `http://${host}`);
          const cookieHeader = typeof req.headers.cookie === 'string' ? req.headers.cookie : null;
          const decision = applyLocaleNav(url.pathname, url.search, cookieHeader);
          if (decision === null) {
            next();
            return;
          }

          res.statusCode = decision.status;
          res.setHeader('Location', decision.location);
          res.setHeader(
            'Set-Cookie',
            serializeLocaleCookie(LOCALE_COOKIE, decision.locale, url.protocol === 'https:'),
          );
          res.end();
        };

        server.middlewares.stack.unshift({
          route: '',
          handle: handle as (typeof server.middlewares.stack)[number]['handle'],
        });
      },
    },
  };
}

import { defaultLocale, isLocale, type Locale } from './locales';

/** Route keys. Spanish slugs are the code names; English has its own public slugs. */
export const routes = {
  home: '/',
  servicios: '/servicios/',
  automatizacion: '/automatizacion/',
  proceso: '/proceso/',
  nosotros: '/nosotros/',
  contacto: '/contacto/',
} as const;

export type RouteKey = keyof typeof routes;

type PageKey = Exclude<RouteKey, 'home'>;

/** Public pathname per locale, including trailing slash. */
export const routeSlugs: Record<PageKey, Record<Locale, string>> = {
  servicios: { es: '/servicios/', en: '/services/' },
  automatizacion: { es: '/automatizacion/', en: '/automation/' },
  proceso: { es: '/proceso/', en: '/process/' },
  nosotros: { es: '/nosotros/', en: '/about/' },
  contacto: { es: '/contacto/', en: '/contact/' },
};

const LOCALE_PREFIX = /^\/(es|en)(?=\/|$)/;

const slugToKey = new Map<string, PageKey>();
for (const key of Object.keys(routeSlugs) as PageKey[]) {
  for (const locale of ['es', 'en'] as const) {
    slugToKey.set(routeSlugs[key][locale], key);
  }
}

export function pageKeyFromSlug(unprefixed: string): PageKey | null {
  return slugToKey.get(unprefixed) ?? null;
}

/** Path without `/es` or `/en`, always starting with `/`. */
export function stripLocale(pathname: string): string {
  const [path] = pathname.split('#');
  const stripped = (path ?? '/').replace(LOCALE_PREFIX, '');
  if (stripped === '' || stripped === '/') return '/';
  return stripped.endsWith('/') || stripped.includes('.') ? stripped : `${stripped}/`;
}

function localeFromPathname(pathname: string): Locale | null {
  const match = pathname.match(LOCALE_PREFIX);
  return match && isLocale(match[1]) ? match[1] : null;
}

/** Locale-prefixed path, using the slug that belongs to that language. */
export function localizePath(path: string, locale: Locale): string {
  const clean = stripLocale(path);
  if (clean === '/') return `/${locale}/`;
  const key = pageKeyFromSlug(clean);
  const slug = key ? routeSlugs[key][locale] : clean.startsWith('/') ? clean : `/${clean}`;
  return `/${locale}${slug}`;
}

export function switchLocalePath(pathname: string, target: Locale): string {
  return localizePath(pathname, target);
}

/**
 * If this pathname should not be served as-is, the canonical path to send
 * the visitor to. `preferred` is used for `/` and unprefixed legacy URLs.
 */
export function localeRedirect(pathname: string, preferred: Locale): string | null {
  const [path] = pathname.split('#');
  const current = path ?? '/';

  if (current === '/' || current === '') {
    return `/${preferred}/`;
  }

  const prefix = localeFromPathname(current);
  if (prefix === null) {
    const unprefixed = stripLocale(current);
    if (pageKeyFromSlug(unprefixed) !== null) {
      return localizePath(unprefixed, preferred);
    }
    return null;
  }

  const canonical = localizePath(current, prefix);
  const normalized = current.endsWith('/') || current.includes('.') ? current : `${current}/`;
  return normalized === canonical ? null : canonical;
}

/** Build-time redirects for hosts that cannot read cookies (always Spanish). */
export function unprefixedFallbackRedirects(): Record<string, string> {
  const redirects: Record<string, string> = {};
  for (const key of Object.keys(routeSlugs) as PageKey[]) {
    for (const slug of Object.values(routeSlugs[key])) {
      const bare = slug.replace(/\/$/, '');
      redirects[bare] = localizePath(slug, defaultLocale);
    }
  }
  return redirects;
}

/** Prefixed but wrong-language slugs, e.g. `/en/servicios/` → `/en/services/`. */
export function crossSlugRedirects(): Record<string, string> {
  const redirects: Record<string, string> = {};
  for (const locale of ['es', 'en'] as const) {
    for (const key of Object.keys(routeSlugs) as PageKey[]) {
      for (const other of ['es', 'en'] as const) {
        if (other === locale) continue;
        const wrong = `/${locale}${routeSlugs[key][other]}`.replace(/\/$/, '');
        const right = localizePath(routeSlugs[key][locale], locale);
        if (`${wrong}/` !== right) {
          redirects[wrong] = right;
        }
      }
    }
  }
  return redirects;
}

export function staticLegacyRedirects(): Record<string, string> {
  return { ...unprefixedFallbackRedirects(), ...crossSlugRedirects() };
}

export const legacyRedirects = staticLegacyRedirects();

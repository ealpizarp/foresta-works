import { getMessages, type Locale } from '@/i18n';
import { defaultLocale, locales } from '@/i18n/locales';
import { localizePath, routes, stripLocale } from '@/i18n/paths';

/** True when `currentPath` is the item's page, ignoring locale prefix and trailing slash. */
export function isCurrentPage(itemHref: string, currentPath: string): boolean {
  const normalize = (path: string): string => {
    const stripped = stripLocale(path);
    return stripped === '/' ? stripped : stripped.replace(/\/+$/, '');
  };
  return normalize(itemHref) === normalize(currentPath);
}

export interface NavItem {
  readonly label: string;
  readonly href: string;
  readonly summary: string;
}

const NAV_KEYS = ['servicios', 'automatizacion', 'proceso', 'nosotros', 'contacto'] as const;

export function primaryNav(locale: Locale): readonly NavItem[] {
  const t = getMessages(locale);
  return NAV_KEYS.map((key) => ({
    label: t.nav.items[key].label,
    href: localizePath(routes[key], locale),
    summary: t.nav.items[key].summary,
  }));
}

export function localeAlternates(pathname: string): { locale: Locale; href: string }[] {
  const path = stripLocale(pathname);
  return locales.map((locale) => ({ locale, href: localizePath(path, locale) }));
}

export function xDefaultHref(pathname: string): string {
  return localizePath(stripLocale(pathname), defaultLocale);
}

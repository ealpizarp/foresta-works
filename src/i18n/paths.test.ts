import assert from 'node:assert/strict';
import { describe, it } from 'vitest';
import {
  crossSlugRedirects,
  localeRedirect,
  localizePath,
  pageKeyFromSlug,
  routes,
  switchLocalePath,
  unprefixedFallbackRedirects,
} from './paths';

describe('localizePath', () => {
  it('prefixes home with the locale', () => {
    assert.equal(localizePath(routes.home, 'es'), '/es/');
    assert.equal(localizePath(routes.home, 'en'), '/en/');
  });

  it('uses English slugs on English pages', () => {
    assert.equal(localizePath(routes.servicios, 'en'), '/en/services/');
    assert.equal(localizePath(routes.automatizacion, 'en'), '/en/automation/');
    assert.equal(localizePath(routes.proceso, 'en'), '/en/process/');
    assert.equal(localizePath(routes.nosotros, 'en'), '/en/about/');
    assert.equal(localizePath(routes.contacto, 'en'), '/en/contact/');
  });

  it('keeps Spanish slugs on Spanish pages', () => {
    assert.equal(localizePath(routes.servicios, 'es'), '/es/servicios/');
    assert.equal(localizePath('/services/', 'es'), '/es/servicios/');
  });
});

describe('switchLocalePath', () => {
  it('maps a Spanish services URL to the English slug', () => {
    assert.equal(switchLocalePath('/es/servicios/', 'en'), '/en/services/');
  });

  it('maps an English contact URL back to Spanish', () => {
    assert.equal(switchLocalePath('/en/contact/', 'es'), '/es/contacto/');
  });
});

describe('localeRedirect', () => {
  it('sends / to the preferred locale', () => {
    assert.equal(localeRedirect('/', 'en'), '/en/');
    assert.equal(localeRedirect('/', 'es'), '/es/');
  });

  it('sends unprefixed legacy URLs to the preferred locale slug', () => {
    assert.equal(localeRedirect('/servicios', 'en'), '/en/services/');
    assert.equal(localeRedirect('/services/', 'es'), '/es/servicios/');
  });

  it('corrects English pages that still use a Spanish slug', () => {
    assert.equal(localeRedirect('/en/servicios/', 'en'), '/en/services/');
    assert.equal(localeRedirect('/es/about', 'es'), '/es/nosotros/');
  });

  it('leaves canonical localized paths alone', () => {
    assert.equal(localeRedirect('/en/services/', 'es'), null);
    assert.equal(localeRedirect('/es/contacto/', 'en'), null);
  });
});

describe('pageKeyFromSlug', () => {
  it('recognizes both language slugs', () => {
    assert.equal(pageKeyFromSlug('/servicios/'), 'servicios');
    assert.equal(pageKeyFromSlug('/services/'), 'servicios');
    assert.equal(pageKeyFromSlug('/unknown/'), null);
  });
});

describe('build-time redirects', () => {
  it('only maps prefixed wrong-language slugs in astro.config', () => {
    const redirects = crossSlugRedirects();
    assert.equal(redirects['/en/servicios'], '/en/services/');
    assert.equal(redirects['/es/about'], '/es/nosotros/');
    assert.equal(redirects['/services'], undefined);
    assert.equal(redirects['/servicios'], undefined);
  });

  it('maps unprefixed URLs to Spanish for hosts without a worker', () => {
    const redirects = unprefixedFallbackRedirects();
    assert.equal(redirects['/services'], '/es/servicios/');
    assert.equal(redirects['/servicios'], '/es/servicios/');
  });
});

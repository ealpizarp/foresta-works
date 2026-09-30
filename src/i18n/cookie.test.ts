import assert from 'node:assert/strict';
import { describe, it } from 'vitest';
import { LOCALE_COOKIE } from './locales';
import { localeFromCookieHeader, serializeLocaleCookie } from './cookie';

describe('localeFromCookieHeader', () => {
  it('reads fw_locale from a cookie header', () => {
    assert.equal(localeFromCookieHeader(`${LOCALE_COOKIE}=en`), 'en');
    assert.equal(localeFromCookieHeader(`${LOCALE_COOKIE}=en; Path=/`), 'en');
    assert.equal(localeFromCookieHeader(`other=1; ${LOCALE_COOKIE}=es`), 'es');
  });

  it('returns null when the cookie is missing or invalid', () => {
    assert.equal(localeFromCookieHeader(null), null);
    assert.equal(localeFromCookieHeader('fw_locale=fr'), null);
  });
});

describe('serializeLocaleCookie', () => {
  it('adds Secure only on HTTPS', () => {
    assert.equal(serializeLocaleCookie(LOCALE_COOKIE, 'en', false).includes('Secure'), false);
    assert.equal(serializeLocaleCookie(LOCALE_COOKIE, 'en', true).includes('Secure'), true);
  });
});

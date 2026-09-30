import assert from 'node:assert/strict';
import { describe, it } from 'vitest';
import { applyLocaleNav } from './locale-nav';

describe('applyLocaleNav', () => {
  it('sends / to English when the cookie says en', () => {
    const decision = applyLocaleNav('/', '', 'fw_locale=en');
    assert.deepEqual(decision, { status: 302, location: '/en/', locale: 'en' });
  });

  it('sends unprefixed /services/ to the English slug', () => {
    const decision = applyLocaleNav('/services/', '', 'fw_locale=en');
    assert.deepEqual(decision, { status: 301, location: '/en/services/', locale: 'en' });
  });

  it('defaults unprefixed URLs to Spanish without a cookie', () => {
    const decision = applyLocaleNav('/services/', '', null);
    assert.deepEqual(decision, { status: 301, location: '/es/servicios/', locale: 'es' });
  });

  it('preserves the query string', () => {
    const decision = applyLocaleNav('/', '?ref=nav', 'fw_locale=en');
    assert.equal(decision?.location, '/en/?ref=nav');
  });

  it('leaves canonical localized URLs alone', () => {
    assert.equal(applyLocaleNav('/en/services/', '', 'fw_locale=es'), null);
  });
});

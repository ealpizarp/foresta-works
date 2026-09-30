import assert from 'node:assert/strict';
import { describe, it } from 'vitest';
import { interpolate } from '@/i18n';
import { subscriptionOffersJsonLd } from './structured-data';
import { subscriptionNumbers } from './services';
import { es } from '@/i18n/es';

describe('subscriptionOffersJsonLd', () => {
  it('does not publish a numeric construction price', () => {
    const catalog = subscriptionOffersJsonLd(new URL('https://forestaworks.com'), 'es');
    const offers = catalog['itemListElement'] as Array<Record<string, unknown>>;
    assert.ok(offers.length === 3);
    for (const offer of offers) {
      assert.equal('price' in offer, false);
      const spec = offer['priceSpecification'] as Record<string, unknown>;
      assert.equal('price' in spec, false);
      assert.equal(typeof spec['description'], 'string');
    }
  });
});

describe('subscriptionNumbers', () => {
  it('are interpolated into the terms copy', () => {
    const vars = {
      months: String(subscriptionNumbers.recommendedMonths),
      days: String(subscriptionNumbers.noticeDays),
      hour: String(subscriptionNumbers.extrasHourUsd),
    };
    assert.match(interpolate(es.services.commitment, vars), /6 meses/);
    assert.match(interpolate(es.services.cancellation, vars), /30 días/);
    assert.match(interpolate(es.services.extras, vars), /USD 55/);
  });
});

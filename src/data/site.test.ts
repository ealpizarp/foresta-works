import assert from 'node:assert/strict';
import { describe, it } from 'vitest';
import { emailUrl, whatsappUrl } from './site';

describe('contact URLs', () => {
  it('returns null when WhatsApp and email are not configured', () => {
    assert.equal(whatsappUrl('Hola'), null);
    assert.equal(emailUrl('Consulta'), null);
  });
});

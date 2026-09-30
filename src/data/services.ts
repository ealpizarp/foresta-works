import { getMessages, type Locale } from '@/i18n';

export type TierId = 'arranque' | 'crecimiento' | 'inteligente';

export interface ServiceTierFact {
  readonly id: TierId;
  readonly name: string;
  readonly recommended?: boolean;
}

/** Locale-agnostic facts. Copy lives in `src/i18n`. Names are product names. */
export const serviceTierFacts: readonly ServiceTierFact[] = [
  { id: 'arranque', name: 'Arranque' },
  { id: 'crecimiento', name: 'Crecimiento', recommended: true },
  { id: 'inteligente', name: 'Inteligente' },
];

export interface ServiceTier extends ServiceTierFact {
  readonly audience: string;
  readonly description: string;
  readonly highlights: readonly string[];
  readonly setupIncludes: readonly string[];
  readonly monthlyIncludes: readonly string[];
  readonly billedSeparately: readonly string[];
  readonly upgrade: string;
  readonly outcome: string;
  readonly badge: string | null;
}

export function getServiceTiers(locale: Locale): readonly ServiceTier[] {
  const copy = getMessages(locale).services.tiers;
  return serviceTierFacts.map((fact) => ({
    ...fact,
    ...copy[fact.id],
  }));
}

export type CompareMark = 'yes' | 'no' | 'add' | 'extra';

export type CompareRowKey =
  | 'responsiveSite'
  | 'googleProfile'
  | 'seoAi'
  | 'hosting'
  | 'report'
  | 'contact'
  | 'shop'
  | 'payments'
  | 'metaAds'
  | 'adSpend'
  | 'assistant'
  | 'reminders';

export interface CompareRowMarks {
  readonly key: CompareRowKey;
  readonly arranque: CompareMark;
  readonly crecimiento: CompareMark;
  readonly inteligente: CompareMark;
}

export const comparisonMarks: readonly CompareRowMarks[] = [
  { key: 'responsiveSite', arranque: 'yes', crecimiento: 'yes', inteligente: 'add' },
  { key: 'googleProfile', arranque: 'yes', crecimiento: 'add', inteligente: 'add' },
  { key: 'seoAi', arranque: 'yes', crecimiento: 'yes', inteligente: 'add' },
  { key: 'hosting', arranque: 'yes', crecimiento: 'yes', inteligente: 'yes' },
  { key: 'report', arranque: 'yes', crecimiento: 'yes', inteligente: 'yes' },
  { key: 'contact', arranque: 'yes', crecimiento: 'yes', inteligente: 'yes' },
  { key: 'shop', arranque: 'no', crecimiento: 'yes', inteligente: 'add' },
  { key: 'payments', arranque: 'no', crecimiento: 'yes', inteligente: 'add' },
  { key: 'metaAds', arranque: 'no', crecimiento: 'yes', inteligente: 'add' },
  { key: 'adSpend', arranque: 'no', crecimiento: 'extra', inteligente: 'no' },
  { key: 'assistant', arranque: 'no', crecimiento: 'add', inteligente: 'yes' },
  { key: 'reminders', arranque: 'no', crecimiento: 'no', inteligente: 'yes' },
];

export const compareMarkSymbol: Record<CompareMark, string> = {
  yes: '●',
  no: '–',
  add: '○',
  extra: '◇',
};

export const subscriptionNumbers = {
  extrasHourUsd: 55,
  recommendedMonths: 6,
  noticeDays: 30,
};

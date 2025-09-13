export const PREFETCH_KEYS = [
  'home',
  'token-deposit',
  'token-withdraw',
  'eth-deposit',
  'eth-withdraw',
  'withdraw-progress',
] as const;

export type PrefetchKey = (typeof PREFETCH_KEYS)[number];

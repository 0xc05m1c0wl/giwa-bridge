import { t } from '@lib/i18n';

import { asWei } from '@/types/domain';

export function toWei(amount: string, decimals = 18) {
  if (!/^\d*(?:\.\d*)?$/.test(amount)) throw new Error(t('error_invalid_number'));
  const [ints, fracs = ''] = amount.split('.');
  const padded = (fracs + '0'.repeat(decimals)).slice(0, decimals);

  return asWei(BigInt(ints || '0') * BigInt(10) ** BigInt(decimals) + BigInt(padded || '0'));
}

export function formatUnits(value: bigint, decimals = 18): string {
  const base = BigInt(10) ** BigInt(decimals);
  const ints = value / base;
  const fracs = (value % base).toString().padStart(decimals, '0').replace(/0+$/, '');

  return fracs ? `${ints}.${fracs}` : `${ints}`;
}

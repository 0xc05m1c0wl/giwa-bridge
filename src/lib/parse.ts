import { toWei } from '@lib/amount';
import { gtZero, isNumeric } from '@lib/validation';
import type { Address } from 'viem';
import { isAddress } from 'viem';
import { z } from 'zod';

import { asWei, type Wei } from '@/types/domain';
import type { TxHash } from '@/types/primitives';

const txHashSchema = z.string().regex(/^0x[a-fA-F0-9]{64}$/, 'Invalid tx hash');

export function parseTxHash(input: string): TxHash | null {
  const r = txHashSchema.safeParse(input);

  return r.success ? (r.data as TxHash) : null;
}

export function assertTxHash(input: string): TxHash {
  const v = parseTxHash(input);

  if (!v) throw new Error('Invalid tx hash');

  return v;
}

export function normalizeTxHashInput(input: string): string {
  let s = input.trim();

  if (s && !s.startsWith('0x')) s = '0x' + s;

  s =
    '0x' +
    s
      .slice(2)
      .replace(/[^0-9a-fA-F]/g, '')
      .slice(0, 64);

  return s;
}

export function isValidAddress(addr: string): boolean {
  return isAddress(addr as `0x${string}`);
}

export function parseAddress(addr: string): Address | null {
  return isValidAddress(addr) ? (addr as Address) : null;
}

export function parseAmountToWei(input: string): Wei | null {
  if (!isNumeric(input)) return null;
  if (!gtZero(input)) return null;

  return asWei(toWei(input));
}

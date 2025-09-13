import type { TxHash } from '@/types/primitives';

const KEY = 'lastWithdrawalHash';

export function getLastWithdrawalHash(): TxHash | '' {
  try {
    return (localStorage.getItem(KEY) as TxHash) || '';
  } catch {
    return '';
  }
}

export function setLastWithdrawalHash(hash: TxHash) {
  try {
    if (hash) localStorage.setItem(KEY, hash);
  } catch {}
}

export function hasEnough(balance: unknown, need: bigint | null | undefined): boolean {
  if (need === null || need === undefined) return false;
  if (typeof balance !== 'bigint') return false;

  return balance >= need;
}

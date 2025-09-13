import { getLastWithdrawalHash, setLastWithdrawalHash } from '@lib/storage';
import { beforeEach, describe, expect, it } from 'vitest';

describe('storage utils', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should persist and load last withdrawal hash', () => {
    expect(getLastWithdrawalHash()).toBe('');
    setLastWithdrawalHash('0xabc');
    expect(getLastWithdrawalHash()).toBe('0xabc');
  });
});

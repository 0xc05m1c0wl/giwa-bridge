import { shouldApprove } from '@lib/allowance';
import { describe, expect, it } from 'vitest';

describe('allowance logic', () => {
  it('should require approve when insufficient', () => {
    expect(shouldApprove(0n, 1n)).toBe(true);
    expect(shouldApprove(9n, 10n)).toBe(true);
  });
  it('should skip approve when enough', () => {
    expect(shouldApprove(10n, 10n)).toBe(false);
    expect(shouldApprove(11n, 10n)).toBe(false);
  });
});

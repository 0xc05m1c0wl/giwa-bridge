import { isBusyCode, isBusyFlow } from '@lib/status';
import { describe, expect, it } from 'vitest';

describe('status utils', () => {
  it('should reflect deposit/withdraw steps (isBusyCode)', () => {
    expect(isBusyCode('idle')).toBe(false);
    expect(isBusyCode('approving')).toBe(true);
    expect(isBusyCode('depositing')).toBe(true);
    expect(isBusyCode('waiting_l2')).toBe(true);
    expect(isBusyCode('withdrawing')).toBe(true);
    expect(isBusyCode('saved')).toBe(false);
    expect(isBusyCode('error')).toBe(false);
  });

  it('should reflect withdraw flow steps (isBusyFlow)', () => {
    expect(isBusyFlow('idle')).toBe(false);
    expect(isBusyFlow('checking_l2_receipt')).toBe(true);
    expect(isBusyFlow('waiting_provable')).toBe(true);
    expect(isBusyFlow('proving')).toBe(true);
    expect(isBusyFlow('proved')).toBe(false);
    expect(isBusyFlow('waiting_finalizable')).toBe(true);
    expect(isBusyFlow('finalizing')).toBe(true);
    expect(isBusyFlow('finalized')).toBe(false);
    expect(isBusyFlow('error')).toBe(false);
  });
});

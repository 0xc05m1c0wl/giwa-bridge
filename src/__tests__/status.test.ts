import { isBusyCode, isBusyFlow } from '@lib/status';
import { describe, expect, it } from 'vitest';

describe('status utils', () => {
  it('isBusyCode reflects deposit/withdraw steps', () => {
    expect(isBusyCode('idle')).toBe(false);
    expect(isBusyCode('approving')).toBe(true);
    expect(isBusyCode('depositing')).toBe(true);
    expect(isBusyCode('waiting_l2')).toBe(true);
    expect(isBusyCode('withdrawing')).toBe(true);
    expect(isBusyCode('saved')).toBe(false);
    expect(isBusyCode('error')).toBe(false);
  });

  it('isBusyFlow reflects withdraw flow steps', () => {
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

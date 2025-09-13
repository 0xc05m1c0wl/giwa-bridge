import { describe, expect, it } from 'vitest';

import { depositProgress, withdrawProgress } from '../lib/progress';

describe('progress mapping', () => {
  it('depositProgress maps statuses', () => {
    expect(depositProgress('')).toBe(0);
    expect(depositProgress('Approving…')).toBe(25);
    expect(depositProgress('Depositing…')).toBe(50);
    expect(depositProgress('Waiting L2… 0xhash')).toBe(75);
    expect(depositProgress('Deposit completed ✅')).toBe(100);
  });

  it('withdrawProgress maps statuses', () => {
    expect(withdrawProgress('')).toBe(0);
    expect(withdrawProgress('Withdrawing…')).toBe(25);
    expect(withdrawProgress('L1에서 증명 가능 시점 대기…')).toBe(50);
    expect(withdrawProgress('증명 트랜잭션 전송 중…')).toBe(60);
    expect(withdrawProgress('증명 완료 ✅: 0x..')).toBe(70);
    expect(withdrawProgress('최종화 가능 시점 대기(챌린지 기간)…')).toBe(80);
    expect(withdrawProgress('최종화 트랜잭션 전송 중…')).toBe(90);
    expect(withdrawProgress('최종화 완료 ✅: 0x..')).toBe(100);
  });
});

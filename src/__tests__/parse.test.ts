import { normalizeTxHashInput, parseAddress, parseAmountToWei, parseTxHash } from '@lib/parse';
import { describe, expect, it } from 'vitest';

describe('parse utils', () => {
  it('normalizes tx hash input', () => {
    expect(normalizeTxHashInput('abc')).toMatch(/^0x/);
    expect(normalizeTxHashInput(' 0xZZ11 ')).toBe('0x11');
  });

  it('parses tx hash', () => {
    const h = '0x'.padEnd(66, 'a');

    expect(parseTxHash(h)).toBe(h);
    expect(parseTxHash('0x1')).toBeNull();
  });

  it('parses address', () => {
    expect(parseAddress('0x0000000000000000000000000000000000000000')).toBeTruthy();
    expect(parseAddress('not-an-address')).toBeNull();
  });

  it('parses amount to wei', () => {
    expect(parseAmountToWei('0')).toBeNull();
    expect(parseAmountToWei('-1')).toBeNull();
    expect(parseAmountToWei('1')).toBeDefined();
  });
});

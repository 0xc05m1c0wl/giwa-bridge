import { normalizeTxHashInput, parseAddress, parseAmountToWei, parseTxHash } from '@lib/parse';
import { describe, expect, it } from 'vitest';

describe('parse utils', () => {
  it('should normalize tx hash input', () => {
    expect(normalizeTxHashInput('abc')).toMatch(/^0x/);
    expect(normalizeTxHashInput(' 0xZZ11 ')).toBe('0x11');
  });

  it('should parse tx hash', () => {
    const h = '0x'.padEnd(66, 'a');

    expect(parseTxHash(h)).toBe(h);
    expect(parseTxHash('0x1')).toBeNull();
  });

  it('should parse address', () => {
    expect(parseAddress('0x0000000000000000000000000000000000000000')).toBeTruthy();
    expect(parseAddress('not-an-address')).toBeNull();
  });

  it('should parse amount to wei', () => {
    expect(parseAmountToWei('0')).toBeNull();
    expect(parseAmountToWei('-1')).toBeNull();
    expect(parseAmountToWei('1')).toBeDefined();
  });
});

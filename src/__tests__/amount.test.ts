import { formatUnits, toWei } from '@lib/amount';
import { describe, expect, it } from 'vitest';

describe('amount utils', () => {
  it('should parse decimals (toWei)', () => {
    expect(toWei('0').toString()).toBe('0');
    expect(toWei('1').toString()).toBe('1000000000000000000');
    expect(toWei('1.5').toString()).toBe('1500000000000000000');
    expect(toWei('0.000000000000000001').toString()).toBe('1');
  });

  it('should render nicely (formatUnits)', () => {
    expect(formatUnits(0n)).toBe('0');
    expect(formatUnits(1000000000000000000n)).toBe('1');
    expect(formatUnits(1500000000000000000n)).toBe('1.5');
  });
});

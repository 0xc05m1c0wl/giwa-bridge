import { gtZero, isNumeric } from '@lib/validation';
import { describe, expect, it } from 'vitest';

describe('validation utils', () => {
  it('isNumeric allows ints/decimals', () => {
    expect(isNumeric('')).toBe(true);
    expect(isNumeric('0')).toBe(true);
    expect(isNumeric('1.23')).toBe(true);
    expect(isNumeric('.5')).toBe(true);
    expect(isNumeric('1.')).toBe(true);
    expect(isNumeric('a')).toBe(false);
  });
  it('gtZero requires positive', () => {
    expect(gtZero('0')).toBe(false);
    expect(gtZero('0.0')).toBe(false);
    expect(gtZero('0.0001')).toBe(true);
    expect(gtZero('2')).toBe(true);
    expect(gtZero('x')).toBe(false);
  });
});

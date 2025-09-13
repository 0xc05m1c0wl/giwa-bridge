import { sanitizeAmount } from '@lib/amountFormat';
import { describe, expect, it } from 'vitest';

describe('sanitizeAmount', () => {
  it('should keep numbers and one dot, clamp decimals', () => {
    expect(sanitizeAmount('')).toBe('0');
    expect(sanitizeAmount('0')).toBe('0');
    expect(sanitizeAmount('.5')).toBe('0.5');
    expect(sanitizeAmount('01.2300', 2)).toBe('1.23');
    expect(sanitizeAmount('1.234567', 3)).toBe('1.234');
    expect(sanitizeAmount('abc1.2.3x')).toBe('1.23');
  });
});

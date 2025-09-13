import { describe, expect, it } from 'vitest';

import { setLocale, t, tf } from '../lib/i18n';

describe('i18n', () => {
  it('should return Korean strings', () => {
    setLocale('ko');
    expect(t('connect_wallet')).toBe('지갑 연결');
  });
  it('should do template replacement', () => {
    setLocale('en');
    expect(tf('wf_proved_with_hash', { hash: '0xabc' })).toContain('0xabc');
  });
});

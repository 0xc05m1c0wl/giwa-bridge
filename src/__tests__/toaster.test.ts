import { describe, expect, it } from 'vitest';

import { toaster } from '../lib/toaster';

describe('toaster', () => {
  it('subscribes and emits', () => {
    const seen: string[] = [];
    const unsub = toaster.subscribe((t) => seen.push(`${t.type}:${t.message}`));

    toaster.info('hello');
    toaster.error('oops');
    unsub();
    toaster.success('bye');
    expect(seen).toEqual(['info:hello', 'error:oops']);
  });
});

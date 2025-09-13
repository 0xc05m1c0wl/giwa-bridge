import { handleErrorToast } from '@lib/errors';
import { describe, expect, it } from 'vitest';

import { type Toast, toaster } from '../lib/toaster';

describe('errors', () => {
  it('should publish toaster error (handleErrorToast)', () => {
    let last: Toast | undefined;
    const unsub = toaster.subscribe((t) => {
      last = t;
    });
    const msg = handleErrorToast({ message: 'Boom' });

    unsub();
    expect(msg).toBe('Boom');
    expect(last?.type).toBe('error');
    expect(last?.message).toBe('Boom');
  });
});

import { isPrefetchEnabled, runIdle, shouldSkipByNetwork } from '@lib/prefetch';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('prefetch utils', () => {
  beforeEach(() => {
    localStorage.clear();
    // @ts-expect-error jsdom mock
    delete (navigator as any).connection;
    // @ts-expect-error jsdom mock
    delete (window as any).requestIdleCallback;
  });

  it('isPrefetchEnabled respects localStorage on/off and env', () => {
    localStorage.setItem('prefetch', 'off');
    expect(isPrefetchEnabled()).toBe(false);

    localStorage.setItem('prefetch', 'on');
    expect(isPrefetchEnabled()).toBe(true);

    localStorage.clear();

    const prev = { ...import.meta.env };

    // @ts-expect-error mutate env in tests
    import.meta.env.VITE_PREFETCH_ENABLE = 'false';
    expect(isPrefetchEnabled()).toBe(false);

    // @ts-expect-error restore
    import.meta.env = prev;
  });

  it('shouldSkipByNetwork checks saveData/effectiveType', () => {
    // @ts-expect-error jsdom mock
    (navigator as any).connection = { saveData: true };
    expect(shouldSkipByNetwork()).toBe(true);

    // @ts-expect-error jsdom mock
    (navigator as any).connection = { effectiveType: '2g' };
    expect(shouldSkipByNetwork()).toBe(true);

    // @ts-expect-error jsdom mock
    delete (navigator as any).connection;
    expect(shouldSkipByNetwork()).toBe(false);
  });

  it('runIdle uses requestIdleCallback when available, otherwise setTimeout', async () => {
    vi.useFakeTimers();
    const cb = vi.fn();

    const id = runIdle(cb);

    expect(id).toBeTruthy();
    await vi.advanceTimersByTimeAsync(210);
    expect(cb).toHaveBeenCalled();
    vi.useRealTimers();

    const cb2 = vi.fn();

    // @ts-expect-error jsdom mock
    window.requestIdleCallback = (fn: any) => {
      fn({ timeRemaining: () => 1, didTimeout: false });

      return 1;
    };

    const id2 = runIdle(cb2);

    expect(id2).toBe(1);
    expect(cb2).toHaveBeenCalled();
  });
});

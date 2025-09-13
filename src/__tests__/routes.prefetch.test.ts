import { beforeEach, describe, expect, it, vi } from 'vitest';

// @ts-expect-error test global
(globalThis as any).__import_counter = 0;
vi.mock('@ui/Balances', () => {
  // @ts-expect-error test global
  (globalThis as any).__import_counter += 1;

  return { Balances: () => null };
});

vi.mock('@/lib/prefetch', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/prefetch')>();
  const runIdle = vi.fn((fn: () => void) => {
    fn();

    return 1 as any;
  });

  return {
    ...actual,
    isPrefetchEnabled: () => true,
    shouldSkipByNetwork: () => false,
    runIdle,
  };
});

import { runIdle as runIdleMock } from '@/lib/prefetch';
import { prefetchIfNeeded, prefetchRoute } from '@/routes';

describe('routes prefetch', () => {
  beforeEach(() => {
    // @ts-expect-error test global
    (globalThis as any).__import_counter = 0;
  });

  it('prefetchRoute directly triggers module import', async () => {
    await prefetchRoute('home');
    // @ts-expect-error test global
    expect((globalThis as any).__import_counter).toBeGreaterThan(0);
  });

  it('prefetchIfNeeded schedules only once (dedup)', async () => {
    await prefetchIfNeeded('home');
    await prefetchIfNeeded('home');

    expect((runIdleMock as any).mock.calls.length).toBe(1);
  });
});

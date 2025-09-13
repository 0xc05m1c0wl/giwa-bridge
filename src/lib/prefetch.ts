interface NetworkInformation {
  readonly saveData?: boolean;
  readonly effectiveType?: string;
}

type RequestIdleCallback = (
  cb: (deadline: { timeRemaining: () => number; didTimeout: boolean }) => void,
  opts?: { timeout?: number },
) => number;

export function isPrefetchEnabled(): boolean {
  const env = import.meta.env?.VITE_PREFETCH_ENABLE as string | undefined;
  const defaultOn = (env ?? 'true') !== 'false';

  try {
    const v = typeof localStorage !== 'undefined' ? localStorage.getItem('prefetch') : null;

    if (v === 'off') return false;
    if (v === 'on') return true;
  } catch {}

  return defaultOn;
}

export function shouldSkipByNetwork(): boolean {
  try {
    const nav = typeof navigator !== 'undefined' ? (navigator as Navigator) : undefined;
    const conn = (nav as Navigator & { connection?: NetworkInformation })?.connection;
    const saveData = !!conn?.saveData;
    const eff = conn?.effectiveType ?? '';

    if (saveData) return true;
    if (eff.includes('2g') || eff.includes('slow-2g')) return true;
  } catch {}

  return false;
}

export function runIdle(fn: () => void, timeout = 1000) {
  try {
    const w = typeof window !== 'undefined' ? (window as Window) : undefined;
    const ric = (w as Window & { requestIdleCallback?: RequestIdleCallback })?.requestIdleCallback;

    if (typeof ric === 'function') return ric(fn, { timeout });
  } catch {}

  return setTimeout(fn, 200);
}

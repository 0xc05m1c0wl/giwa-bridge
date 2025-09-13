import { toaster } from '@lib/toaster';

export function handleError(e: unknown): string {
  const anyErr = e as { shortMessage?: unknown; message?: unknown };
  const msg =
    (typeof anyErr?.shortMessage === 'string' && anyErr.shortMessage) ||
    (typeof anyErr?.message === 'string' && anyErr.message) ||
    String(e);

  return msg;
}

export function handleErrorToast(e: unknown): string {
  const msg = handleError(e);

  try {
    toaster.error(msg);
  } catch {}

  return msg;
}

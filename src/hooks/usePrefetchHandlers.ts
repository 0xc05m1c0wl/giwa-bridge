import { useCallback } from 'react';

import type { PrefetchKey } from '../lib/prefetchKeys';

export function usePrefetchHandlers(key: PrefetchKey) {
  const onMouseEnter = useCallback(() => {
    import('../routes').then((m) => m.prefetchIfNeeded(key)).catch(() => {});
  }, [key]);
  const onFocus = onMouseEnter;
  const onTouchStart = onMouseEnter;

  return { onMouseEnter, onFocus, onTouchStart } as const;
}

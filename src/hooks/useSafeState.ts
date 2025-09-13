import { useEffect, useRef, useState } from 'react';

export function useSafeState<T>(initial: T) {
  const mounted = useRef(false);
  const [state, setState] = useState<T>(initial);

  useEffect(() => {
    mounted.current = true;

    return () => {
      mounted.current = false;
    };
  }, []);
  const set = (v: T) => {
    if (mounted.current) setState(v);
  };

  return [state, set] as const;
}

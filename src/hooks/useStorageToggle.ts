import { useCallback, useEffect, useState } from 'react';

export function useStorageToggle(key: string, defaultOn: boolean = true) {
  const read = () => {
    try {
      const v = localStorage.getItem(key);

      if (v === 'on') return true;
      if (v === 'off') return false;
    } catch {}

    return defaultOn;
  };

  const [on, setOn] = useState<boolean>(read);

  useEffect(() => {
    try {
      localStorage.setItem(key, on ? 'on' : 'off');
    } catch {}
  }, [key, on]);

  const toggle = useCallback(() => setOn((v) => !v), []);

  return [on, toggle] as const;
}

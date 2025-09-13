import { useCallback, useEffect, useState } from 'react';

function prefersDark(): boolean {
  try {
    return (
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
    );
  } catch {
    return false;
  }
}

export function useTheme() {
  const read = () => {
    try {
      const saved = localStorage.getItem('theme');

      if (saved === 'dark') return true;
      if (saved === 'light') return false;
    } catch {}

    return prefersDark();
  };

  const [dark, setDark] = useState<boolean>(read);

  useEffect(() => {
    try {
      localStorage.setItem('theme', dark ? 'dark' : 'light');
    } catch {}

    if (dark) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [dark]);

  const toggle = useCallback(() => setDark((v) => !v), []);

  return [dark, toggle] as const;
}

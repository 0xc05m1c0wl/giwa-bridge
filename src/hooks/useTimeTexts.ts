import { useEffect, useMemo, useState } from 'react';

function pad2(n: number) {
  return String(n).padStart(2, '0');
}

export function useTimeTexts(startedAt: number | null, lastUpdated: number | null) {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick((x) => x + 1), 1000);

    return () => clearInterval(id);
  }, []);

  const elapsedText = useMemo(() => {
    if (!startedAt) return '—';
    const s = Math.floor((Date.now() - startedAt) / 1000);
    const mm = pad2(Math.floor(s / 60));
    const ss = pad2(s % 60);

    return `${mm}:${ss}`;
  }, [startedAt, tick]);

  const lastUpdatedText = useMemo(() => {
    if (!lastUpdated) return '—';
    const d = new Date(lastUpdated);

    return `${pad2(d.getHours())}:${pad2(d.getMinutes())}:${pad2(d.getSeconds())}`;
  }, [lastUpdated, tick]);

  return { elapsedText, lastUpdatedText } as const;
}

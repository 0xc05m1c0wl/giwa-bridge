import type { WithdrawFlowStep } from '@lib/status';
import { useEffect, useMemo, useState } from 'react';

import { TIMINGS } from '@/config';

function pad2(n: number) {
  return String(n).padStart(2, '0');
}

function formatRemaining(seconds: number | null): string {
  if (seconds == null) return '—';
  const s = Math.max(0, Math.floor(seconds));
  const days = Math.floor(s / 86400);
  const hh = pad2(Math.floor((s % 86400) / 3600));
  const mm = pad2(Math.floor((s % 3600) / 60));
  const ss = pad2(s % 60);

  if (days > 0) return `${days}d ${hh}:${mm}:${ss}`;

  return `${hh}:${mm}:${ss}`;
}

export function useEtaTexts(
  step: WithdrawFlowStep,
  startedAt: number | null,
  finalizeBaseAt?: number | null,
) {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick((x) => x + 1), 1000);

    return () => clearInterval(id);
  }, []);

  const { showEta, remainingSec } = useMemo(() => {
    if (!startedAt) return { showEta: false, remainingSec: null as number | null };
    const now = Date.now();
    const elapsed = Math.floor((now - startedAt) / 1000);

    if (step === 'waiting_provable' || step === 'proving' || step === 'checking_l2_receipt') {
      return { showEta: true, remainingSec: TIMINGS.PROVE_MAX_SEC - elapsed };
    }

    if (step === 'waiting_finalizable' || step === 'finalizing') {
      const base = finalizeBaseAt ?? startedAt;
      const elapsedFinalize = Math.floor((now - base) / 1000);

      return { showEta: true, remainingSec: TIMINGS.FINALIZE_MAX_SEC - elapsedFinalize };
    }

    return { showEta: false, remainingSec: null as number | null };
  }, [step, startedAt, tick]);

  const remainingText = useMemo(() => formatRemaining(remainingSec), [remainingSec]);

  return { showEta, remainingText } as const;
}

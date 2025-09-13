import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
import { Note } from '@components/ui/note';
import { TxHashLine } from '@components/ui/tx-hash-line';
import { useEnsureChain } from '@hooks/useEnsureChain';
import { useEtaTexts } from '@hooks/useEtaTexts';
import { useTimeTexts } from '@hooks/useTimeTexts';
import { l1Public, l1Wallet, l2Public } from '@lib/clients';
import { handleErrorToast } from '@lib/errors';
import { t, tf } from '@lib/i18n';
import { normalizeTxHashInput, parseTxHash } from '@lib/parse';
import { withdrawFlowVariant } from '@lib/progress';
import {
  isBusyFlow,
  isDoneFlow,
  withdrawFlowMessage,
  withdrawFlowPercent,
  WithdrawFlowStep,
} from '@lib/status';
import { getLastWithdrawalHash } from '@lib/storage';
import { toaster } from '@lib/toaster';
import { ProgressLine } from '@ui/ProgressLine';
import { Spinner } from '@ui/Spinner';
import { TxStatus } from '@ui/TxStatus';
import { useEffect, useState } from 'react';
import { sepolia } from 'viem/chains';
import { useAccount } from 'wagmi';

import { giwaSepolia } from '@/chains';
import { EXPLORER, PROGRESS } from '@/config';
import type { TxHash } from '@/types/primitives';

function getDisabledReason(isConnected: boolean, hash: string, step: WithdrawFlowStep) {
  if (!isConnected) return t('need_connect');
  if (!hash) return t('ph_l2_withdraw_hash');
  if (isBusyFlow(step)) return t('s_waiting_l2');

  return '';
}

function WithdrawHashAnchor({ hash }: { hash: string }) {
  if (!hash) return null;

  return (
    <a
      href={`${EXPLORER.L2}/tx/${hash}`}
      target="_blank"
      rel="noreferrer noopener"
      className="underline text-xs"
    >
      {t('view_on_giwascan')}
    </a>
  );
}

function RefreshButton({
  step,
  onProve,
  onFinalize,
}: {
  step: WithdrawFlowStep;
  onProve: () => void | Promise<void>;
  onFinalize: () => void | Promise<void>;
}) {
  if (!(step === 'waiting_provable' || step === 'waiting_finalizable')) return null;

  return (
    <button
      onClick={() => (step === 'waiting_provable' ? onProve() : onFinalize())}
      className="underline"
    >
      {t('refresh')}
    </button>
  );
}

function TxHashGroup({ proveTx, finalizeTx }: { proveTx: TxHash | ''; finalizeTx: TxHash | '' }) {
  if (!proveTx && !finalizeTx) return null;

  return (
    <div className="flex flex-col gap-1 text-xs mt-2">
      <TxHashLine label="L1 Prove" hash={proveTx} explorerBase={EXPLORER.L1} tone="l1" />
      <TxHashLine label="L1 Finalize" hash={finalizeTx} explorerBase={EXPLORER.L1} tone="l1" />
    </div>
  );
}

function useLongWaitNotifier(step: WithdrawFlowStep, startedAt: number | null) {
  const [notifiedLongWait, setNotifiedLongWait] = useState(false);

  useEffect(() => {
    if (step === 'waiting_provable' || step === 'waiting_finalizable') {
      const elapsedSec = startedAt ? Math.floor((Date.now() - startedAt) / 1000) : 0;

      if (!notifiedLongWait && elapsedSec >= 300) {
        toaster.info(`${t('elapsed')} 05:00 — ${t('refresh')}`);
        setNotifiedLongWait(true);
      }
    } else if (notifiedLongWait) {
      setNotifiedLongWait(false);
    }
  }, [step, startedAt, notifiedLongWait]);
}

function ActionButtons({
  isConnected,
  hash,
  step,
  activeAction,
  disabledReason,
  onProve,
  onFinalize,
}: {
  isConnected: boolean;
  hash: string;
  step: WithdrawFlowStep;
  activeAction: 'prove' | 'finalize' | null;
  disabledReason: string;
  onProve: () => void | Promise<void>;
  onFinalize: () => void | Promise<void>;
}) {
  const busy = isBusyFlow(step);
  const disabled = !isConnected || !hash || busy;
  const proveBusy = activeAction === 'prove' && busy;
  const finalizeBusy = activeAction === 'finalize' && busy;

  return (
    <div className="flex items-center gap-2 mt-2">
      <Button
        variant="default"
        aria-busy={proveBusy}
        disabled={disabled}
        title={disabledReason}
        onClick={onProve}
      >
        {proveBusy && <Spinner className="mr-1.5" />} {tf('btn_prove_on_l1', {})}
      </Button>
      <Button
        variant="outline"
        aria-busy={finalizeBusy}
        disabled={disabled}
        title={disabledReason}
        onClick={onFinalize}
      >
        {finalizeBusy && <Spinner className="mr-1.5" />} {tf('btn_finalize_on_l1', {})}
      </Button>
      {!busy && disabled && disabledReason && (
        <span className="text-xs text-slate-500">{disabledReason}</span>
      )}
    </div>
  );
}

export function WithdrawProgress() {
  const [hash, setHash] = useState<string>(getLastWithdrawalHash());
  const [status, setStatus] = useState<string>('');
  const [step, setStep] = useState<WithdrawFlowStep>('idle');
  const [activeAction, setActiveAction] = useState<'prove' | 'finalize' | null>(null);
  const [proveTx, setProveTx] = useState<TxHash | ''>('');
  const [finalizeTx, setFinalizeTx] = useState<TxHash | ''>('');
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);
  const [finalizeBaseAt, setFinalizeBaseAt] = useState<number | null>(null);
  const [auto, setAuto] = useState<boolean>(PROGRESS.AUTO_PROGRESS_DEFAULT);
  const { isConnected } = useAccount();
  const ensureL1 = useEnsureChain(sepolia.id);

  const { elapsedText, lastUpdatedText } = useTimeTexts(startedAt, lastUpdated);
  const { showEta, remainingText } = useEtaTexts(step, startedAt, finalizeBaseAt);
  const disabledReason = getDisabledReason(isConnected, hash, step);

  const busy = isBusyFlow(step);
  const canAutoProve = Boolean(hash) && step === 'waiting_provable';
  const canAutoFinalize = Boolean(hash) && step === 'waiting_finalizable';

  useEffect(() => {
    if (!auto) return;
    const id = setInterval(() => {
      if (canAutoProve) prove();
      else if (canAutoFinalize) finalize();
    }, PROGRESS.AUTO_PROGRESS_INTERVAL_MS);

    return () => clearInterval(id);
  }, [auto, canAutoProve, canAutoFinalize]);

  async function prove() {
    if (!isConnected || !hash) return;
    if (!parseTxHash(hash)) {
      toaster.error('Invalid tx hash');

      return;
    }

    await ensureL1();
    try {
      setActiveAction('prove');
      setStartedAt(Date.now());
      setLastUpdated(Date.now());
      setProveTx('');
      setStep('checking_l2_receipt');
      setStatus(withdrawFlowMessage('checking_l2_receipt'));
      setLastUpdated(Date.now());
      const l2 = l2Public();
      const receipt = await l2.waitForTransactionReceipt({ hash: hash as TxHash });

      setStep('waiting_provable');
      setStatus(withdrawFlowMessage('waiting_provable'));
      setLastUpdated(Date.now());
      const l1 = l1Public();
      const { output, withdrawal } = await l1.waitToProve({
        receipt,
        targetChain: giwaSepolia,
      });

      setStep('proving');
      setStatus(withdrawFlowMessage('proving'));
      setLastUpdated(Date.now());
      const wallet = await l1Wallet();
      const proveHash: `0x${string}` = await wallet.proveWithdrawal(
        await l2.buildProveWithdrawal({ output, withdrawal }),
      );

      setProveTx(proveHash);
      await l1.waitForTransactionReceipt({ hash: proveHash });
      setStep('proved');
      setStatus(tf('wf_proved_with_hash', { hash: proveHash }));
      setLastUpdated(Date.now());
      setFinalizeBaseAt(Date.now());
    } catch (e: unknown) {
      const msg = handleErrorToast(e);

      setStep('error');
      setStatus(`Error: ${msg}`);
    } finally {
      setActiveAction(null);
    }
  }

  async function finalize() {
    if (!isConnected || !hash) return;
    if (!parseTxHash(hash)) {
      toaster.error('Invalid tx hash');

      return;
    }

    await ensureL1();
    try {
      setActiveAction('finalize');
      setStartedAt(Date.now());
      setLastUpdated(Date.now());
      setFinalizeTx('');
      setStep('checking_l2_receipt');
      setStatus(withdrawFlowMessage('checking_l2_receipt'));
      setLastUpdated(Date.now());
      const l2 = l2Public();
      const receipt = await l2.waitForTransactionReceipt({ hash: hash as TxHash });

      const l1 = l1Public();
      const { output: _output, withdrawal } = await l1.waitToProve({
        receipt,
        targetChain: giwaSepolia,
      });

      setStep('waiting_finalizable');
      setStatus(withdrawFlowMessage('waiting_finalizable'));
      setLastUpdated(Date.now());
      setFinalizeBaseAt(Date.now());
      await l1.waitToFinalize({
        targetChain: giwaSepolia,
        withdrawalHash: (withdrawal as { withdrawalHash: `0x${string}` }).withdrawalHash,
      });

      setStep('finalizing');
      setStatus(withdrawFlowMessage('finalizing'));
      setLastUpdated(Date.now());
      const wallet = await l1Wallet();
      const finalizeHash: `0x${string}` = await wallet.finalizeWithdrawal({
        targetChain: giwaSepolia,
        withdrawal,
      });

      setFinalizeTx(finalizeHash);
      await l1.waitForTransactionReceipt({ hash: finalizeHash });
      setStep('finalized');
      setStatus(tf('wf_finalized_with_hash', { hash: finalizeHash }));
      setLastUpdated(Date.now());
    } catch (e: unknown) {
      const msg = handleErrorToast(e);

      setStep('error');
      setStatus(`Error: ${msg}`);
    } finally {
      setActiveAction(null);
    }
  }

  useLongWaitNotifier(step, startedAt);

  return (
    <div>
      <h3>{tf('title_withdraw_progress', {})}</h3>
      <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
        {t('intro_withdraw_progress')}
      </p>
      <div className="flex items-center gap-2 mt-2">
        <label htmlFor="withdrawHash" className="min-w-[200px]">
          {t('label_l2_withdraw_hash')}
        </label>
        <Input
          id="withdrawHash"
          aria-label={t('label_l2_withdraw_hash')}
          value={hash}
          onChange={(e) => setHash(normalizeTxHashInput(e.target.value))}
          placeholder={t('ph_l2_withdraw_hash')}
          className="max-w-[360px]"
        />

        <WithdrawHashAnchor hash={hash} />
      </div>
      <div className="flex items-center gap-2 mt-1 text-xs">
        <label htmlFor="autoProgress" className="flex items-center gap-2">
          <input
            id="autoProgress"
            type="checkbox"
            checked={auto}
            onChange={(e) => setAuto(e.target.checked)}
          />
          {t('auto_progress')}
        </label>
        <span className="text-slate-500">{t('auto_progress_desc')}</span>
      </div>
      <Note className="mt-1">{t('note_auto_fill_withdraw_hash')}</Note>
      <ActionButtons
        isConnected={isConnected}
        hash={hash}
        step={step}
        activeAction={activeAction}
        disabledReason={disabledReason}
        onProve={prove}
        onFinalize={finalize}
      />

      <Note className="mt-1">{t('explain_prove')}</Note>
      <Note>{t('explain_finalize')}</Note>
      <TxStatus text={status} busy={isBusyFlow(step)} done={isDoneFlow(step)} className="mt-2" />
      <div className="mt-2">
        <ProgressLine percent={withdrawFlowPercent(step)} variant={withdrawFlowVariant(step)} />
      </div>
      <div className="flex flex-wrap gap-3 text-xs mt-2">
        <span>
          {t('elapsed')}: <code className="font-mono">{elapsedText}</code>
        </span>
        <span>
          {t('last_updated')}: <code className="font-mono">{lastUpdatedText}</code>
        </span>
        {showEta && (
          <span>
            {t('eta_remaining')}: <code className="font-mono">{remainingText}</code>
          </span>
        )}
        <RefreshButton step={step} onProve={prove} onFinalize={finalize} />
      </div>
      <TxHashGroup proveTx={proveTx} finalizeTx={finalizeTx} />
      <Note className="mt-2">{tf('note_withdraw_timing', {})}</Note>
    </div>
  );
}

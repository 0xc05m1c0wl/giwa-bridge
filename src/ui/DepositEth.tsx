import { Button } from '@components/ui/button';
import { FormRow } from '@components/ui/form-row';
import { Input } from '@components/ui/input';
import { Note } from '@components/ui/note';
import { TxHashLine } from '@components/ui/tx-hash-line';
import { useEnsureChain } from '@hooks/useEnsureChain';
import { sanitizeAmount } from '@lib/amountFormat';
import { hasEnough } from '@lib/balance';
import { l1Public, l1Wallet, l2Public } from '@lib/clients';
import { handleErrorToast } from '@lib/errors';
import { t } from '@lib/i18n';
import { parseAmountToWei } from '@lib/parse';
import { depositProgressByStep, depositVariantByStep } from '@lib/progress';
import { depositStatusMessage, type DepositStep, isBusyCode, isDoneCode } from '@lib/status';
import { toaster } from '@lib/toaster';
import { ProgressLine } from '@ui/ProgressLine';
import { Spinner } from '@ui/Spinner';
import { TxStatus } from '@ui/TxStatus';
import { useState } from 'react';
import { sepolia } from 'viem/chains';
import { getL2TransactionHashes } from 'viem/op-stack';
import { useAccount, useBalance } from 'wagmi';

import { EXPLORER } from '@/config';
import type { Wei } from '@/types/domain';
import type { TxHash } from '@/types/primitives';

function getEthDepositButtonState(
  isConnected: boolean,
  step: DepositStep,
  need: Wei | null,
  balance: bigint | undefined,
) {
  const busy = isBusyCode(step);
  const disabled =
    !isConnected || busy || need === null || !hasEnough(balance, need as unknown as bigint);

  let title = '';

  if (!isConnected) title = t('need_connect');
  else if (busy) title = t('s_depositing');
  else if (need === null) title = t('error_invalid_number');
  else if (!hasEnough(balance, need as unknown as bigint)) title = t('warn_insufficient_balance');

  const label = busy ? t('s_depositing') : t('nav_eth_deposit');

  return { disabled, title, label, busy } as const;
}

export function DepositEth() {
  const { isConnected, address } = useAccount();
  const ensureL1 = useEnsureChain(sepolia.id);
  const [amount, setAmount] = useState('0.001');
  const [status, setStatus] = useState<string>('');
  const [step, setStep] = useState<DepositStep>('idle');
  const [l1Tx, setL1Tx] = useState<TxHash | ''>('');
  const [l2Tx, setL2Tx] = useState<TxHash | ''>('');
  const need = parseAmountToWei(amount);
  const l1Eth = useBalance({ address, chainId: sepolia.id });

  async function runDeposit() {
    if (!isConnected || !address) return;
    await ensureL1();
    try {
      setStep('depositing');
      setStatus(depositStatusMessage('depositing'));
      const l2 = l2Public();
      const l1 = l1Public();
      const wallet = await l1Wallet();

      const mintWei = parseAmountToWei(amount);

      if (!mintWei) {
        return toaster.error(t('error_invalid_number'));
      }

      const depositArgs = await l2.buildDepositTransaction({
        mint: mintWei,
        to: address,
      });

      const depositHash: `0x${string}` = await wallet.depositTransaction(depositArgs);

      setL1Tx(depositHash);
      const l1Receipt = await l1.waitForTransactionReceipt({ hash: depositHash });
      const [l2Hash] = getL2TransactionHashes(
        l1Receipt as Parameters<typeof getL2TransactionHashes>[0],
      );

      setL2Tx(l2Hash as `0x${string}`);

      setStep('waiting_l2');
      setStatus(depositStatusMessage('waiting_l2', { l2Hash }));
      await l2.waitForTransactionReceipt({ hash: l2Hash });
      setStep('completed');
      setStatus(depositStatusMessage('completed'));
    } catch (e: unknown) {
      const msg = handleErrorToast(e);

      setStep('error');
      setStatus(`Error: ${msg}`);
    }
  }

  return (
    <div>
      <h3>{t('title_deposit_eth')}</h3>
      <div className="flex flex-col gap-3">
        <FormRow label={t('amount')} htmlFor="amount" labelWidthClass="w-28">
          <Input
            id="amount"
            aria-label="amount"
            aria-describedby={need === null ? 'amount-hint' : undefined}
            value={amount}
            onChange={(e) => setAmount(sanitizeAmount(e.target.value))}
            placeholder="0.0"
            className="max-w-[240px]"
          />
        </FormRow>
        <p
          id="amount-hint"
          role="status"
          aria-live="polite"
          className="text-xs text-red-600 min-h-[1rem]"
        >
          {need === null ? t('error_invalid_number') : ''}
        </p>
        {(() => {
          const { disabled, title, label, busy } = getEthDepositButtonState(
            isConnected,
            step,
            need,
            l1Eth.data?.value,
          );

          return (
            <Button
              disabled={disabled}
              title={title}
              aria-disabled={disabled}
              aria-busy={busy}
              onClick={runDeposit}
            >
              {busy && <Spinner className="mr-1.5" />}
              {label}
            </Button>
          );
        })()}
        {l1Eth.data !== undefined && need !== null && !hasEnough(l1Eth.data.value, need) && (
          <p className="text-red-600">{t('warn_insufficient_balance')}</p>
        )}
      </div>
      <div className="mt-2 space-y-2">
        <TxStatus text={status} busy={isBusyCode(step)} done={isDoneCode(step)} />
        {l1Tx && <TxHashLine label={t('tx_l1')} hash={l1Tx} explorerBase={EXPLORER.L1} tone="l1" />}
        {l2Tx && <TxHashLine label={t('tx_l2')} hash={l2Tx} explorerBase={EXPLORER.L2} tone="l2" />}
        <Note>{t('note_deposit_eth_delay')}</Note>
        <ProgressLine percent={depositProgressByStep(step)} variant={depositVariantByStep(step)} />
      </div>
    </div>
  );
}

export default DepositEth;

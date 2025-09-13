import { Button } from '@components/ui/button';
import { FormRow } from '@components/ui/form-row';
import { Input } from '@components/ui/input';
import { TxHashLine } from '@components/ui/tx-hash-line';
import { useDepositERC20 } from '@hooks/useBridge';
import { sanitizeAmount } from '@lib/amountFormat';
import { hasEnough } from '@lib/balance';
import { t } from '@lib/i18n';
import { parseAmountToWei } from '@lib/parse';
import { depositProgressByStep, depositVariantByStep } from '@lib/progress';
import { type DepositStep, isBusyCode, isDoneCode } from '@lib/status';
import { ProgressLine } from '@ui/ProgressLine';
import { Spinner } from '@ui/Spinner';
import { TxStatus } from '@ui/TxStatus';
import { useState } from 'react';
import { sepolia } from 'viem/chains';
import { useAccount } from 'wagmi';
import { useReadContract } from 'wagmi';

import { L1_TOKEN, testTokenAbi } from '@/abi';
import type { Wei } from '@/types/domain';

function getDepositButtonState(
  isConnected: boolean,
  statusCode: DepositStep,
  need: Wei | null,
  balance: unknown,
) {
  const busy = isBusyCode(statusCode);
  const disabled =
    !isConnected || busy || need === null || !hasEnough(balance, need as unknown as bigint);

  let title = '';

  if (!isConnected) title = t('need_connect');
  else if (busy) title = statusCode === 'approving' ? t('s_approving') : t('s_depositing');
  else if (need === null) title = t('error_invalid_number');
  else if (!hasEnough(balance, need as unknown as bigint)) title = t('warn_insufficient_balance');

  const labelMap: Record<string, string> = {
    approving: t('s_approving'),
    depositing: t('s_depositing'),
  };
  const label = labelMap[statusCode] ?? t('approve_deposit');

  return { disabled, title, label, busy } as const;
}

import { EXPLORER } from '@/config';

export function Deposit() {
  const { isConnected, address } = useAccount();
  const [amount, setAmount] = useState('1');
  const { status, statusCode, run, l1Tx, l2Tx } = useDepositERC20();
  const need = parseAmountToWei(amount || '');
  const l1Token = useReadContract({
    address: L1_TOKEN,
    abi: testTokenAbi,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    chainId: sepolia.id,
  });

  return (
    <div>
      <h3>{t('title_deposit_erc20')}</h3>
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
          const { disabled, title, label, busy } = getDepositButtonState(
            isConnected,
            statusCode,
            need,
            l1Token.data,
          );

          return (
            <Button
              disabled={disabled}
              title={title}
              aria-disabled={disabled}
              aria-busy={busy}
              onClick={() => run(amount)}
            >
              {busy && <Spinner className="mr-1.5" />}
              {label}
            </Button>
          );
        })()}
        {l1Token.data !== undefined &&
          need !== null &&
          !hasEnough(l1Token.data as bigint, need) && (
            <p className="text-red-600">{t('warn_insufficient_balance')}</p>
          )}
      </div>
      <div className="mt-2 space-y-2">
        <TxStatus text={status} busy={isBusyCode(statusCode)} done={isDoneCode(statusCode)} />
        {l1Tx && <TxHashLine label={t('tx_l1')} hash={l1Tx} explorerBase={EXPLORER.L1} tone="l1" />}
        {l2Tx && <TxHashLine label={t('tx_l2')} hash={l2Tx} explorerBase={EXPLORER.L2} tone="l2" />}
        <ProgressLine
          percent={depositProgressByStep(statusCode)}
          variant={depositVariantByStep(statusCode)}
        />
      </div>
    </div>
  );
}

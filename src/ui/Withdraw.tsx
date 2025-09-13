import { Button } from '@components/ui/button';
import { FormRow } from '@components/ui/form-row';
import { Input } from '@components/ui/input';
import { Note } from '@components/ui/note';
import { TxHashLine } from '@components/ui/tx-hash-line';
import { useWithdrawERC20 } from '@hooks/useBridge';
import { sanitizeAmount } from '@lib/amountFormat';
import { hasEnough } from '@lib/balance';
import { t } from '@lib/i18n';
import { parseAmountToWei } from '@lib/parse';
import { withdrawInitiateProgressByStep, withdrawInitiateVariantByStep } from '@lib/progress';
import { isBusyCode, isDoneCode } from '@lib/status';
import { setLastWithdrawalHash } from '@lib/storage';
import { ProgressLine } from '@ui/ProgressLine';
import { Spinner } from '@ui/Spinner';
import { TxStatus } from '@ui/TxStatus';
import { useState } from 'react';
import { useAccount } from 'wagmi';
import { useReadContract } from 'wagmi';

import { L2_TOKEN, testTokenAbi } from '@/abi';
import { giwaSepolia } from '@/chains';
import { EXPLORER } from '@/config';

export function Withdraw() {
  const { isConnected, address } = useAccount();
  const [amount, setAmount] = useState('0.5');
  const { status, statusCode, run, l2Tx } = useWithdrawERC20();
  const need = parseAmountToWei(amount || '');
  const l2Token = useReadContract({
    address: L2_TOKEN,
    abi: testTokenAbi,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    chainId: giwaSepolia.id,
  });

  return (
    <div>
      <h3>{t('title_withdraw_erc20')}</h3>
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
          const disabled =
            !isConnected ||
            isBusyCode(statusCode) ||
            need === null ||
            !hasEnough(l2Token.data, need);

          let title = '';

          if (!isConnected) title = t('need_connect');
          else if (isBusyCode(statusCode)) title = t('s_withdrawing');
          else if (need === null) title = t('error_invalid_number');
          else if (!hasEnough(l2Token.data, need)) title = t('warn_insufficient_balance');

          const label = isBusyCode(statusCode) ? t('s_withdrawing') : t('withdraw');

          return (
            <Button
              disabled={disabled}
              title={title}
              aria-disabled={disabled}
              aria-busy={isBusyCode(statusCode)}
              onClick={async () => {
                const hash = await run(amount);

                if (hash) setLastWithdrawalHash(hash);
              }}
            >
              {isBusyCode(statusCode) && <Spinner className="mr-1.5" />}
              {label}
            </Button>
          );
        })()}
      </div>
      {l2Token.data !== undefined && need !== null && !hasEnough(l2Token.data as bigint, need) && (
        <p className="text-red-600">{t('warn_insufficient_balance')}</p>
      )}
      <div className="mt-2 space-y-2">
        <TxStatus text={status} busy={isBusyCode(statusCode)} done={isDoneCode(statusCode)} />
        {l2Tx && <TxHashLine label={t('tx_l2')} hash={l2Tx} explorerBase={EXPLORER.L2} tone="l2" />}
        <ProgressLine
          percent={withdrawInitiateProgressByStep(statusCode)}
          variant={withdrawInitiateVariantByStep(statusCode)}
        />

        <Note>{t('note_after_withdraw_initiate')}</Note>
      </div>
    </div>
  );
}

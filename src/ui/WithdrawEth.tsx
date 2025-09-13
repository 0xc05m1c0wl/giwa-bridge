import { Button } from '@components/ui/button';
import { FormRow } from '@components/ui/form-row';
import { Input } from '@components/ui/input';
import { Note } from '@components/ui/note';
import { TxHashLine } from '@components/ui/tx-hash-line';
import { useEnsureChain } from '@hooks/useEnsureChain';
import { sanitizeAmount } from '@lib/amountFormat';
import { l2Wallet } from '@lib/clients';
import { handleErrorToast } from '@lib/errors';
import { t, tf } from '@lib/i18n';
import { parseAmountToWei } from '@lib/parse';
import { withdrawInitiateProgressByStep, withdrawInitiateVariantByStep } from '@lib/progress';
import { isBusyCode, isDoneCode, withdrawStatusMessage, WithdrawStep } from '@lib/status';
import { setLastWithdrawalHash } from '@lib/storage';
import { toaster } from '@lib/toaster';
import { gtZero, isNumeric } from '@lib/validation';
import { ProgressLine } from '@ui/ProgressLine';
import { Spinner } from '@ui/Spinner';
import { TxStatus } from '@ui/TxStatus';
import { useState } from 'react';
import { useAccount } from 'wagmi';

import { giwaSepolia } from '@/chains';
import { EXPLORER } from '@/config';
import type { TxHash } from '@/types/primitives';

export function WithdrawEth() {
  const { isConnected, address } = useAccount();
  const ensureL2 = useEnsureChain(giwaSepolia.id);
  const [amount, setAmount] = useState('0.00005');
  const [status, setStatus] = useState<string>('');
  const [step, setStep] = useState<WithdrawStep>('idle');
  const [l2Tx, setL2Tx] = useState<TxHash | ''>('');

  async function runWithdraw() {
    if (!isConnected || !address) return;
    await ensureL2();
    try {
      setStep('withdrawing');
      setStatus(withdrawStatusMessage('withdrawing'));
      const wallet = await l2Wallet();
      const valueWei = parseAmountToWei(amount);

      if (!valueWei) {
        return toaster.error(t('error_invalid_number'));
      }

      const hash: TxHash = await wallet.initiateWithdrawal({ to: address, value: valueWei });

      setL2Tx(hash);
      setLastWithdrawalHash(hash);
      setStep('saved');
      setStatus(tf('s_saved_with_hash', { hash }));
    } catch (e: unknown) {
      const msg = handleErrorToast(e);

      setStep('error');
      setStatus(`Error: ${msg}`);
    }
  }

  return (
    <div>
      <h3>{t('title_withdraw_eth')}</h3>
      <div className="flex flex-col gap-3">
        <FormRow label={t('amount')} htmlFor="amount" labelWidthClass="w-28">
          <Input
            id="amount"
            aria-label="amount"
            value={amount}
            onChange={(e) => setAmount(sanitizeAmount(e.target.value))}
            placeholder="0.0"
            className="max-w-[240px]"
          />
        </FormRow>
        <Button
          disabled={!isConnected || isBusyCode(step) || !gtZero(amount) || !isNumeric(amount)}
          onClick={runWithdraw}
        >
          {isBusyCode(step) && <Spinner className="mr-1.5" />}
          {isBusyCode(step) ? t('s_withdrawing') : t('nav_eth_withdraw')}
        </Button>
      </div>
      <div className="mt-2 space-y-2">
        <TxStatus text={status} busy={isBusyCode(step)} done={isDoneCode(step)} />
        {l2Tx && <TxHashLine label={t('tx_l2')} hash={l2Tx} explorerBase={EXPLORER.L2} tone="l2" />}
        <ProgressLine
          percent={withdrawInitiateProgressByStep(step)}
          variant={withdrawInitiateVariantByStep(step)}
        />

        <Note>{t('note_after_withdraw_initiate')}</Note>
      </div>
    </div>
  );
}

export default WithdrawEth;

import { Button } from '@components/ui/button';
import { Note } from '@components/ui/note';
import { TxHashLine } from '@components/ui/tx-hash-line';
import { l1Public } from '@lib/clients';
import { handleErrorToast } from '@lib/errors';
import { t, tf } from '@lib/i18n';
import { faucetProgressByStep, faucetVariantByStep } from '@lib/progress';
import { faucetMessage, FaucetStep, isBusyFaucet } from '@lib/status';
import { ProgressLine } from '@ui/ProgressLine';
import { TxStatus } from '@ui/TxStatus';
import { useState } from 'react';
import { formatUnits } from 'viem';
import { sepolia } from 'viem/chains';
import { useAccount, useBalance, useReadContract, useSwitchChain, useWriteContract } from 'wagmi';

import { L1_STANDARD_BRIDGE, L1_TOKEN, L2_TOKEN, testTokenAbi } from '@/abi';
import { giwaSepolia } from '@/chains';
import { EXPLORER } from '@/config';
import type { TxHash } from '@/types/primitives';

export function Balances() {
  const { address, isConnected } = useAccount();
  const { switchChain } = useSwitchChain();
  const { writeContractAsync } = useWriteContract();
  const [status, setStatus] = useState<string>('');
  const [step, setStep] = useState<FaucetStep>('idle');
  const [txHash, setTxHash] = useState<TxHash | ''>('');

  const l1Eth = useBalance({ address, chainId: sepolia.id });
  const l2Eth = useBalance({ address, chainId: giwaSepolia.id });

  const l1Token = useReadContract({
    address: L1_TOKEN,
    abi: testTokenAbi,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    chainId: sepolia.id,

    query: { refetchInterval: 5000 },
  });

  const l2Token = useReadContract({
    address: L2_TOKEN,
    abi: testTokenAbi,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    chainId: giwaSepolia.id,
  });

  const allowance = useReadContract({
    address: L1_TOKEN,
    abi: testTokenAbi,
    functionName: 'allowance',
    args: address ? [address, L1_STANDARD_BRIDGE] : undefined,
    chainId: sepolia.id,
  });

  async function claimOnL1() {
    try {
      setStep('preparing');
      setStatus(faucetMessage('preparing'));
      setTxHash('');
      setStep('switching_chain');
      setStatus(faucetMessage('switching_chain'));
      await switchChain({ chainId: sepolia.id });
      setStep('request_signature');
      setStatus(faucetMessage('request_signature'));
      const hash = await writeContractAsync({
        address: L1_TOKEN,
        abi: testTokenAbi,
        functionName: 'claimFaucet',
      });

      setTxHash(hash);
      setStep('submitted');
      setStatus(tf('s_faucet_submitted_with_hash', { hash }));
      const l1 = l1Public();

      setStep('confirming');
      setStatus(tf('s_faucet_confirming_with_hash', { hash }));
      await l1.waitForTransactionReceipt({ hash });
      setStep('refetching');
      setStatus(faucetMessage('refetching'));
      await Promise.allSettled([l1Token.refetch?.()]);
      setStep('completed');
      setStatus(faucetMessage('completed'));
    } catch (e: unknown) {
      const msg = handleErrorToast(e);

      setStep('error');
      setStatus(`Error: ${msg}`);
    }
  }

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">{t('balances_title')}</h3>
      <div className="flex items-center gap-6">
        <div>
          ETH L1: <code>{formatMaybe(l1Eth.data?.formatted)}</code>
        </div>
        <div>
          ETH L2: <code>{formatMaybe(l2Eth.data?.formatted)}</code>
        </div>
      </div>
      <div className="flex items-center gap-6 mt-2">
        <div>
          FAUCET L1: <code>{formatBigint(l1Token.data as bigint | undefined, 18)}</code>
        </div>
        <div>
          FAUCET L2: <code>{formatBigint(l2Token.data as bigint | undefined, 18)}</code>
        </div>
      </div>
      <div className="flex items-center gap-6 mt-2">
        <div>
          Allowance(L1→Bridge):{' '}
          <code>{formatBigint(allowance.data as bigint | undefined, 18)}</code>
        </div>
      </div>
      <div className="flex items-center gap-3 mt-3">
        <Button onClick={claimOnL1} disabled={!isConnected || isBusyFaucet(step)}>
          {t('btn_faucet_l1')}
        </Button>
        <TxStatus
          text={status}
          busy={isBusyFaucet(step)}
          done={step === 'completed'}
          className="mt-2"
        />

        <div className="mt-2 w-full space-y-2">
          <TxHashLine label={t('tx_l1')} hash={txHash} explorerBase={EXPLORER.L1} tone="l1" />
          <ProgressLine percent={faucetProgressByStep(step)} variant={faucetVariantByStep(step)} />
        </div>
      </div>
      <Note className="mt-2">
        <a
          href="https://faucet.giwa.io/"
          target="_blank"
          rel="noreferrer noopener"
          className="underline"
        >
          {t('open_giwa_faucet')}
        </a>
      </Note>
    </div>
  );
}

function formatMaybe(v?: string) {
  return v ?? '-';
}

function formatBigint(v: bigint | undefined, decimals = 18) {
  return typeof v === 'bigint' ? formatUnits(v, decimals) : '-';
}

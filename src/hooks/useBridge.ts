import { useEnsureChain } from '@hooks/useEnsureChain';
import { useSafeState } from '@hooks/useSafeState';
import { shouldApprove } from '@lib/allowance';
import { handleErrorToast } from '@lib/errors';
import { t, tf } from '@lib/i18n';
import { parseAmountToWei } from '@lib/parse';
import {
  depositStatusMessage,
  DepositStep,
  withdrawStatusMessage,
  WithdrawStep,
} from '@lib/status';
import type { PublicClient } from 'viem';
import { sepolia } from 'viem/chains';
import { getL2TransactionHashes, publicActionsL1, publicActionsL2 } from 'viem/op-stack';
import { useAccount, useWriteContract } from 'wagmi';
import { getPublicClient } from 'wagmi/actions';

import {
  L1_STANDARD_BRIDGE,
  L1_TOKEN,
  l1StandardBridgeAbi,
  L2_STANDARD_BRIDGE,
  L2_TOKEN,
  l2StandardBridgeAbi,
  testTokenAbi,
} from '@/abi';
import { giwaSepolia } from '@/chains';
import type { TxHash } from '@/types/primitives';
import { wagmiConfig } from '@/wagmi';

export function useDepositERC20() {
  const { isConnected, address } = useAccount();
  const ensureL1 = useEnsureChain(sepolia.id);
  const { writeContractAsync } = useWriteContract();
  const [status, setStatus] = useSafeState('');
  const [statusCode, setStatusCode] = useSafeState<DepositStep>('idle');
  const [l1Tx, setL1Tx] = useSafeState<TxHash | ''>('');
  const [l2Tx, setL2Tx] = useSafeState<TxHash | ''>('');

  async function run(amount: string) {
    if (!isConnected || !address) return;
    await ensureL1();
    try {
      const l1Public = (getPublicClient(wagmiConfig)! as PublicClient).extend(publicActionsL1());
      const need = parseAmountToWei(amount);

      if (!need) {
        setStatusCode('error');
        setStatus(t('error_invalid_number'));

        return;
      }

      const current: bigint = await l1Public.readContract({
        address: L1_TOKEN,
        abi: testTokenAbi,
        functionName: 'allowance',
        args: [address, L1_STANDARD_BRIDGE],
      });

      if (shouldApprove(current, need)) {
        setStatusCode('approving');
        setStatus(depositStatusMessage('approving'));
        const approveHash = await writeContractAsync({
          address: L1_TOKEN,
          abi: testTokenAbi,
          functionName: 'approve',
          args: [L1_STANDARD_BRIDGE, need],
        });

        await l1Public.waitForTransactionReceipt({ hash: approveHash });
      } else {
        setStatusCode('approve_skipped');
        setStatus(depositStatusMessage('approve_skipped'));
      }

      setStatusCode('depositing');
      setStatus(depositStatusMessage('depositing'));
      const depositHash = await writeContractAsync({
        address: L1_STANDARD_BRIDGE,
        abi: l1StandardBridgeAbi,
        functionName: 'depositERC20To',
        args: [L1_TOKEN, L2_TOKEN, address, need, 200000, '0x'],
      });

      setL1Tx(depositHash as TxHash);

      const l1Receipt = await l1Public.waitForTransactionReceipt({ hash: depositHash });
      const [l2Hash] = getL2TransactionHashes(l1Receipt);

      setL2Tx(l2Hash as TxHash);

      const l2Public = (
        getPublicClient(wagmiConfig, { chainId: giwaSepolia.id })! as PublicClient
      ).extend(publicActionsL2());

      setStatusCode('waiting_l2');
      setStatus(depositStatusMessage('waiting_l2', { l2Hash }));
      await l2Public.waitForTransactionReceipt({ hash: l2Hash });
      setStatusCode('completed');
      setStatus(depositStatusMessage('completed'));
    } catch (e: unknown) {
      const msg = handleErrorToast(e);

      setStatusCode('error');
      setStatus(`Error: ${msg}`);
    }
  }

  return { status, statusCode, run, l1Tx, l2Tx };
}

export function useWithdrawERC20() {
  const { isConnected, address } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const [status, setStatus] = useSafeState('');
  const [statusCode, setStatusCode] = useSafeState<WithdrawStep>('idle');
  const [l2Tx, setL2Tx] = useSafeState<TxHash | ''>('');
  const ensureL2 = useEnsureChain(giwaSepolia.id);

  async function run(amount: string) {
    if (!isConnected || !address) return;
    await ensureL2();
    try {
      setStatusCode('withdrawing');
      setStatus(withdrawStatusMessage('withdrawing'));
      const need = parseAmountToWei(amount);

      if (!need) {
        setStatusCode('error');
        setStatus(t('error_invalid_number'));

        return;
      }

      const hash = await writeContractAsync({
        address: L2_STANDARD_BRIDGE,
        abi: l2StandardBridgeAbi,
        functionName: 'withdrawTo',
        args: [L2_TOKEN, address, need, 200000, '0x'],
      });

      setL2Tx(hash as TxHash);
      setStatusCode('saved');
      setStatus(tf('s_saved_with_hash', { hash }));

      return hash as `0x${string}`;
    } catch (e: unknown) {
      const msg = handleErrorToast(e);

      setStatusCode('error');
      setStatus(`Error: ${msg}`);
    }
  }

  return { status, statusCode, run, l2Tx };
}

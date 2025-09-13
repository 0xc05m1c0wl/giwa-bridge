import type { Address } from 'viem';
import { sepolia } from 'viem/chains';
import { publicActionsL1, publicActionsL2, walletActionsL1, walletActionsL2 } from 'viem/op-stack';
import { getPublicClient, getWalletClient } from 'wagmi/actions';

import { giwaSepolia } from '@/chains';
import type { TxHash } from '@/types/primitives';
import { wagmiConfig } from '@/wagmi';

type TransactionReceiptLike = { transactionHash: TxHash };
type AllowanceReadArgs = {
  address: Address;
  abi: unknown;
  functionName: 'allowance';
  args: [Address, Address];
};

export type L1Public = {
  waitForTransactionReceipt(args: { hash: TxHash }): Promise<TransactionReceiptLike | unknown>;
  readContract(
    args:
      | AllowanceReadArgs
      | {
          address: Address;
          abi: unknown;
          functionName: string;
          args?: unknown[];
        },
  ): Promise<unknown>;
  waitToProve(args: {
    receipt: unknown;
    targetChain: unknown;
  }): Promise<{ output: unknown; withdrawal: unknown }>;
  waitToFinalize(args: { targetChain: unknown; withdrawalHash: TxHash }): Promise<unknown>;
};

export type L2Public = {
  waitForTransactionReceipt(args: { hash: TxHash }): Promise<unknown>;
  buildDepositTransaction(args: {
    mint?: bigint;
    to?: Address;
    value?: bigint;
    data?: `0x${string}`;
    isCreation?: boolean;
  }): Promise<{ request: unknown } | unknown>;
  buildProveWithdrawal(args: { output: unknown; withdrawal: unknown }): Promise<unknown>;
};

export type L1Wallet = {
  depositTransaction(args: unknown): Promise<TxHash>;
  proveWithdrawal(args: unknown): Promise<TxHash>;
  finalizeWithdrawal(args: { targetChain: unknown; withdrawal: unknown }): Promise<TxHash>;
};

export type L2Wallet = {
  initiateWithdrawal(args: { to: Address; value: bigint }): Promise<TxHash>;
};

type Extensible<T> = { extend: (x: unknown) => T };

export function l1Public(): L1Public {
  const c = getPublicClient(wagmiConfig)! as unknown as Extensible<L1Public>;

  return c.extend(publicActionsL1());
}

export function l2Public(): L2Public {
  const c = getPublicClient(wagmiConfig, {
    chainId: giwaSepolia.id,
  })! as unknown as Extensible<L2Public>;

  return c.extend(publicActionsL2());
}

export async function l1Wallet(): Promise<L1Wallet> {
  const w = (await getWalletClient(wagmiConfig, {
    chainId: sepolia.id,
  })!) as unknown as Extensible<L1Wallet>;

  return w.extend(walletActionsL1());
}

export async function l2Wallet(): Promise<L2Wallet> {
  const w = (await getWalletClient(wagmiConfig, {
    chainId: giwaSepolia.id,
  })!) as unknown as Extensible<L2Wallet>;

  return w.extend(walletActionsL2());
}

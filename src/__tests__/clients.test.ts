import { describe, expect, it, vi } from 'vitest';

vi.mock('viem/op-stack', () => ({
  publicActionsL1: () => ({
    waitForTransactionReceipt: async () => ({}),
    readContract: async () => 0n,
    waitToProve: async () => ({ output: {}, withdrawal: { withdrawalHash: '0x'.padEnd(66, '1') } }),
    waitToFinalize: async () => ({}),
  }),
  publicActionsL2: () => ({
    waitForTransactionReceipt: async () => ({}),
    buildDepositTransaction: async () => ({ request: {} }),
    buildProveWithdrawal: async () => ({}),
  }),
  walletActionsL1: () => ({
    depositTransaction: async () => '0x'.padEnd(66, 'a'),
    proveWithdrawal: async () => '0x'.padEnd(66, 'b'),
    finalizeWithdrawal: async () => '0x'.padEnd(66, 'c'),
  }),
  walletActionsL2: () => ({
    initiateWithdrawal: async () => '0x'.padEnd(66, 'd'),
  }),
}));

vi.mock('wagmi/actions', () => ({
  getPublicClient: () => ({ extend: (x: any) => x }),
  getWalletClient: () => ({ extend: (x: any) => x }),
}));

import { l1Public, l1Wallet, l2Public, l2Wallet } from '@lib/clients';

describe('clients wrappers', () => {
  it('should expose expected methods (l1/l2 public and wallet)', async () => {
    const l1 = l1Public();
    const l2 = l2Public();
    const w1 = await l1Wallet();
    const w2 = await l2Wallet();

    expect(typeof l1.waitForTransactionReceipt).toBe('function');
    expect(typeof (l2 as any).buildDepositTransaction).toBe('function');
    expect(typeof w1.depositTransaction).toBe('function');
    expect(typeof w2.initiateWithdrawal).toBe('function');
  });
});

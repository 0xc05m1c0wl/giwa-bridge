import type { L1Public, L1Wallet, L2Public, L2Wallet } from '@/lib/clients';

export function makeL1Public(overrides: Partial<L1Public> = {}): L1Public {
  return {
    waitForTransactionReceipt: async () => ({ transactionHash: '0x'.padEnd(66, '1') }) as any,
    readContract: async () => 0n,
    waitToProve: async () => ({ output: {}, withdrawal: { withdrawalHash: '0x'.padEnd(66, '3') } }),
    waitToFinalize: async () => ({}),
    ...overrides,
  } as L1Public;
}

export function makeL2Public(overrides: Partial<L2Public> = {}): L2Public {
  return {
    waitForTransactionReceipt: async () => ({}),
    buildDepositTransaction: async () => ({ request: {} }),
    buildProveWithdrawal: async () => ({}),
    ...overrides,
  } as L2Public;
}

export function makeL1Wallet(overrides: Partial<L1Wallet> = {}): L1Wallet {
  return {
    depositTransaction: async () => '0x'.padEnd(66, 'a'),
    proveWithdrawal: async () => '0x'.padEnd(66, 'b'),
    finalizeWithdrawal: async () => '0x'.padEnd(66, 'c'),
    ...overrides,
  } as L1Wallet;
}

export function makeL2Wallet(overrides: Partial<L2Wallet> = {}): L2Wallet {
  return {
    initiateWithdrawal: async () => '0x'.padEnd(66, 'd'),
    ...overrides,
  } as L2Wallet;
}

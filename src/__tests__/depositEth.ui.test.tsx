import { t } from '@lib/i18n';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DepositEth } from '@ui/DepositEth';
import { describe, expect, it, vi } from 'vitest';

import { makeL1Public, makeL1Wallet, makeL2Public } from '../../test/mocks/clients';
import { renderWithProviders } from '../../test/utils';

vi.mock('@hooks/useEnsureChain', () => ({
  useEnsureChain: () => () => Promise.resolve(),
}));

vi.mock('viem/op-stack', () => ({
  getL2TransactionHashes: () => ['0x'.padEnd(66, 'f')],
}));

vi.mock('@lib/clients', () => ({
  l1Public: () => makeL1Public(),
  l2Public: () => makeL2Public(),
  l1Wallet: async () => makeL1Wallet(),
}));

vi.mock('wagmi', async (importOriginal) => {
  const actual = await importOriginal<typeof import('wagmi')>();

  return {
    ...actual,
    useAccount: () => ({ isConnected: true, address: '0x'.padEnd(42, 'a') }) as any,
    useBalance: () => ({ data: { value: 1000000000000000000n } }) as any,
  };
});

describe('DepositEth UI', () => {
  it('should show L1/L2 hashes on click (happy path)', async () => {
    renderWithProviders(<DepositEth />);
    const btn = await screen.findByRole('button', { name: t('nav_eth_deposit') });

    expect(btn).toBeEnabled();
    await userEvent.click(btn);

    expect(await screen.findByText('L1 Tx')).toBeInTheDocument();
    expect(await screen.findByText('L2 Tx')).toBeInTheDocument();
  });
});

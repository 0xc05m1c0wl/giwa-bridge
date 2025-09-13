import { t } from '@lib/i18n';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { WithdrawEth } from '@ui/WithdrawEth';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { renderWithProviders } from '../../test/utils';

vi.mock('@hooks/useEnsureChain', () => ({
  useEnsureChain: () => () => Promise.resolve(),
}));

vi.mock('@lib/clients', () => ({
  l2Wallet: async () => ({
    initiateWithdrawal: vi.fn().mockResolvedValue('0x'.padEnd(66, 'd')),
  }),
}));

vi.mock('wagmi', async (importOriginal) => {
  const actual = await importOriginal<typeof import('wagmi')>();

  return {
    ...actual,
    useAccount: () => ({ isConnected: true, address: '0x'.padEnd(42, 'b') }) as any,
  };
});

describe('WithdrawEth UI', () => {
  beforeEach(() => localStorage.clear());

  it('정상 클릭 시 L2 트랜잭션 해시 저장', async () => {
    renderWithProviders(<WithdrawEth />);
    const btn = await screen.findByRole('button', { name: t('nav_eth_withdraw') });

    expect(btn).toBeEnabled();
    await userEvent.click(btn);
    expect(localStorage.getItem('lastWithdrawalHash')).toBeTruthy();
  });
});

import { t } from '@lib/i18n';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Balances } from '@ui/Balances';
import { describe, expect, it, vi } from 'vitest';

import { makeL1Public } from '../../test/mocks/clients';
import { renderWithProviders } from '../../test/utils';

vi.mock('@lib/clients', () => ({
  l1Public: () => makeL1Public(),
}));

vi.mock('wagmi', async (importOriginal) => {
  const actual = await importOriginal<typeof import('wagmi')>();

  return {
    ...actual,
    useAccount: () => ({ isConnected: true, address: '0x'.padEnd(42, 'a') }) as any,
    useBalance: ({ chainId }: any) =>
      ({ data: { formatted: chainId === 11155111 ? '0.1' : '0.2' } }) as any,
    useReadContract: ({ functionName }: any) =>
      ({ data: functionName === 'allowance' ? 0n : 1000000000000000000n, refetch: vi.fn() }) as any,
    useSwitchChain: () => ({ switchChain: vi.fn() }) as any,
    useWriteContract: () =>
      ({ writeContractAsync: vi.fn().mockResolvedValue('0x'.padEnd(66, 'a')) }) as any,
  };
});

describe('Balances UI', () => {
  it('연결 시 잔액/토큰/허용량 표시 및 Faucet 버튼 동작', async () => {
    renderWithProviders(<Balances />);
    expect(await screen.findByText(/ETH L1:/)).toBeInTheDocument();
    expect(await screen.findByText(/ETH L2:/)).toBeInTheDocument();
    expect(await screen.findByText(/FAUCET L1:/)).toBeInTheDocument();
    expect(await screen.findByText(/FAUCET L2:/)).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: t('btn_faucet_l1') }));
    expect(await screen.findByText('L1 Tx')).toBeInTheDocument();
  });
});

import { screen } from '@testing-library/react';
import { StatusBanner } from '@ui/StatusBanner';
import { describe, expect, it, vi } from 'vitest';

import { renderWithProviders } from '../../test/utils';

vi.mock('wagmi', async (importOriginal) => {
  const actual = await importOriginal<typeof import('wagmi')>();

  return {
    ...actual,
    useAccount: () => ({ isConnected: true, chainId: 1 }) as any,
    useSwitchChain: () => ({ switchChain: vi.fn() }) as any,
  };
});

describe('StatusBanner', () => {
  it('should show Sepolia switch message on Deposit route', async () => {
    renderWithProviders(<StatusBanner />, { route: '/deposit' });
    expect(
      await screen.findByText(/Sepolia 전환 필요|Please switch to Sepolia/),
    ).toBeInTheDocument();
  });

  it('should show GIWA switch message on Withdraw route', async () => {
    renderWithProviders(<StatusBanner />, { route: '/withdraw' });
    expect(await screen.findByText(/GIWA 전환 필요|Please switch to GIWA/)).toBeInTheDocument();
  });
});

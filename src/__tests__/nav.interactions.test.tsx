import { t } from '@lib/i18n';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { App } from '@ui/App';
import { sepolia } from 'viem/chains';
import { describe, expect, it, vi } from 'vitest';

import { renderWithProviders } from '../../test/utils';

vi.mock('wagmi', async (importOriginal) => {
  const actual = await importOriginal<typeof import('wagmi')>();

  return {
    ...actual,
    useAccount: () =>
      ({ isConnected: true, address: '0x'.padEnd(42, 'a'), chainId: sepolia.id }) as any,
  };
});

describe('Navigation interactions', () => {
  it('NavTabs에서 ERC-20 입금 탭 클릭 시 /deposit로 이동', async () => {
    renderWithProviders(<App />);
    await userEvent.click(screen.getByRole('tab', { name: t('nav_token_deposit') }));
    expect(await screen.findByText(t('title_deposit_erc20'))).toBeInTheDocument();
  });
});

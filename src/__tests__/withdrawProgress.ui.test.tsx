import { t } from '@lib/i18n';
import { toaster } from '@lib/toaster';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { WithdrawProgress } from '@ui/WithdrawProgress';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { makeL1Public, makeL1Wallet, makeL2Public } from '../../test/mocks/clients';
import { renderWithProviders } from '../../test/utils';

vi.mock('wagmi', async (importOriginal) => {
  const actual = await importOriginal<typeof import('wagmi')>();

  return {
    ...actual,
    useAccount: () => ({ isConnected: true }) as any,
  };
});

vi.mock('@hooks/useEnsureChain', () => ({
  useEnsureChain: () => () => Promise.resolve(),
}));

vi.mock('@lib/clients', () => ({
  l1Public: () => makeL1Public(),
  l2Public: () => makeL2Public(),
  l1Wallet: async () => makeL1Wallet(),
}));

describe('WithdrawProgress UI', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should show toast error for invalid hash input', async () => {
    const spy = vi.spyOn(toaster, 'error').mockImplementation((() => ({ id: 'toast' })) as any);

    renderWithProviders(<WithdrawProgress />);

    const input = await screen.findByLabelText(t('label_l2_withdraw_hash'));

    await userEvent.clear(input);
    await userEvent.type(input, '123');

    const btn = await screen.findByRole('button', { name: t('btn_prove_on_l1') });

    await userEvent.click(btn);

    expect(spy).toHaveBeenCalled();
  });

  it('should go from prove to finalized (happy path)', async () => {
    renderWithProviders(<WithdrawProgress />);
    const input = await screen.findByLabelText(t('label_l2_withdraw_hash'));

    await userEvent.clear(input);
    await userEvent.type(input, '0x'.padEnd(66, 'e'));

    await userEvent.click(await screen.findByRole('button', { name: t('btn_prove_on_l1') }));

    expect(await screen.findByText(new RegExp(t('wf_proved')))).toBeInTheDocument();

    await userEvent.click(await screen.findByRole('button', { name: t('btn_finalize_on_l1') }));
    expect(await screen.findByText(new RegExp(t('wf_finalized')))).toBeInTheDocument();
  });
});

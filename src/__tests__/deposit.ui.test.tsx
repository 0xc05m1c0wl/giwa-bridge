import { t } from '@lib/i18n';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Deposit } from '@ui/Deposit';
import { describe, expect, it, vi } from 'vitest';

import { renderWithProviders } from '../../test/utils';

const run = vi.fn().mockResolvedValue(undefined);

vi.mock('@hooks/useBridge', () => ({
  useDepositERC20: () => ({ status: '', statusCode: 'idle', run, l1Tx: '', l2Tx: '' }),
}));

vi.mock('wagmi', async (importOriginal) => {
  const actual = await importOriginal<typeof import('wagmi')>();

  return {
    ...actual,
    useAccount: () => ({ isConnected: true, address: '0x'.padEnd(42, 'a') }) as any,
    useReadContract: () => ({ data: 2000000000000000000n }) as any,
  };
});

describe('Deposit UI', () => {
  it('유효 금액 + 잔액 충분 시 버튼 활성 및 run 호출', async () => {
    renderWithProviders(<Deposit />);
    const btn = await screen.findByRole('button', { name: t('approve_deposit') });

    expect(btn).toBeEnabled();
    await userEvent.click(btn);
    expect(run).toHaveBeenCalled();
  });

  it('잘못된 금액 입력 시 힌트 노출', async () => {
    renderWithProviders(<Deposit />);
    const input = screen.getByLabelText('amount');

    await userEvent.clear(input);
    await userEvent.type(input, '0');
    expect(await screen.findByText('숫자 형식 아님')).toBeInTheDocument();
  });
});

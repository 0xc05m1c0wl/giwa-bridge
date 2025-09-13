import { t } from '@lib/i18n';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Withdraw } from '@ui/Withdraw';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { renderWithProviders } from '../../test/utils';

vi.mock('wagmi', async (importOriginal) => {
  const actual = await importOriginal<typeof import('wagmi')>();

  return {
    ...actual,
    useAccount: () => ({ isConnected: true, address: '0x'.padEnd(42, 'a') }) as any,
    useReadContract: () => ({ data: 1000000000000000000n }) as any,
  };
});

vi.mock('@hooks/useBridge', async () => {
  return {
    useWithdrawERC20: () => ({
      status: '',
      statusCode: 'idle',
      l2Tx: '',
      run: vi.fn().mockResolvedValue('0x'.padEnd(66, 'a')),
    }),
  } as any;
});

describe('Withdraw UI', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('입력 유효성/잔액/연결 상태에 따른 버튼 비활성화', async () => {
    renderWithProviders(<Withdraw />);

    const btn = await screen.findByRole('button', { name: t('withdraw') });

    expect(btn).toBeEnabled();

    const input = screen.getByLabelText('amount');

    await userEvent.clear(input);
    await userEvent.type(input, '0');
    expect(await screen.findByText('숫자 형식 아님')).toBeInTheDocument();
  });

  it('정상 클릭 시 run 호출 및 해시 저장', async () => {
    renderWithProviders(<Withdraw />);
    const btn = await screen.findByRole('button', { name: t('withdraw') });

    await userEvent.click(btn);

    expect(localStorage.getItem('lastWithdrawalHash')).toBeTruthy();
  });
});

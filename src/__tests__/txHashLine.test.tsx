import { TxHashLine } from '@components/ui/tx-hash-line';
import { t } from '@lib/i18n';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

const H: `0x${string}` = '0x'.padEnd(66, 'a') as `0x${string}`;

describe('TxHashLine', () => {
  beforeAll(() => {
    // @ts-expect-error jsdom mock
    global.navigator.clipboard = { writeText: vi.fn() };
  });

  it('should render label and explorer link', () => {
    render(<TxHashLine label="L1 Tx" hash={H} explorerBase="https://explorer" />);
    expect(screen.getByText('L1 Tx')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: t('view_on_etherscan') })).toHaveAttribute(
      'href',
      `https://explorer/tx/${H}`,
    );
  });

  it('should copy hash to clipboard', async () => {
    render(<TxHashLine hash={H} />);
    await userEvent.click(screen.getByRole('button', { name: t('copy') }));
    expect(navigator.clipboard.writeText).toHaveBeenCalled();
  });
});

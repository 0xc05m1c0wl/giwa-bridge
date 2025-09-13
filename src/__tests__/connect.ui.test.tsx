import { t } from '@lib/i18n';
import { toaster } from '@lib/toaster';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Connect } from '@ui/Connect';
import { describe, expect, it, vi } from 'vitest';

import { renderWithProviders } from '../../test/utils';

describe('Connect component', () => {
  it('should copy address when connected', async () => {
    const success = vi
      .spyOn(toaster, 'success')
      .mockImplementation((() => ({ id: 'toast' })) as any);

    // @ts-expect-error jsdom mock
    global.navigator.clipboard = { writeText: vi.fn() };
    vi.mock('wagmi', async (importOriginal) => {
      const actual = await importOriginal<typeof import('wagmi')>();

      return {
        ...actual,
        useAccount: () => ({ isConnected: true, address: '0x'.padEnd(42, 'a'), chainId: 1 }) as any,
        useDisconnect: () => ({ disconnect: vi.fn() }) as any,
        useSwitchChain: () => ({ switchChain: vi.fn() }) as any,
      };
    });

    renderWithProviders(<Connect />);
    await userEvent.click(screen.getByRole('button', { name: t('copy') }));
    expect(success).toHaveBeenCalled();
  });
});

import { useEnsureChain } from '@hooks/useEnsureChain';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';

const switchChain = vi.fn();

vi.mock('wagmi', async () => ({
  useAccount: () => ({ chainId: 1 }),
  useSwitchChain: () => ({ switchChain }),
}));

function Probe({ target }: { target: number }) {
  const ensure = useEnsureChain(target);

  return (
    <button onClick={() => ensure()} aria-label="ensure">
      ensure
    </button>
  );
}

describe('useEnsureChain', () => {
  it('체인 불일치 시 switchChain 호출', async () => {
    render(<Probe target={11155111} />);
    await userEvent.click(screen.getByRole('button', { name: 'ensure' }));
    expect(switchChain).toHaveBeenCalledWith({ chainId: 11155111 });
  });
});

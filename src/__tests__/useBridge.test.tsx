import { useDepositERC20, useWithdrawERC20 } from '@hooks/useBridge';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@hooks/useEnsureChain', () => ({
  useEnsureChain: () => () => Promise.resolve(),
}));

vi.mock('viem/op-stack', () => ({
  getL2TransactionHashes: () => ['0x'.padEnd(66, '2')],
  publicActionsL1: () => ({}) as any,
  publicActionsL2: () => ({}) as any,
}));

const writeContractAsync = vi.fn();
const l1Public = {
  readContract: vi.fn(),
  waitForTransactionReceipt: vi.fn(),
};
const l2Public = {
  waitForTransactionReceipt: vi.fn(),
};

let callCount = 0;

vi.mock('wagmi/actions', () => ({
  getPublicClient: () => ({
    extend: () => (callCount++ === 0 ? l1Public : l2Public),
  }),
}));

vi.mock('wagmi', async (importOriginal) => {
  const actual = await importOriginal<typeof import('wagmi')>();

  return {
    ...actual,
    useAccount: () => ({ isConnected: true, address: '0x'.padEnd(42, 'a') }) as any,
    useWriteContract: () => ({ writeContractAsync }) as any,
  };
});

function DepositProbe() {
  const { statusCode, run, l1Tx, l2Tx } = useDepositERC20();

  return (
    <div>
      <button onClick={() => run('1')} aria-label="run">
        run
      </button>
      <output aria-label="code">{statusCode}</output>
      <output aria-label="l1">{l1Tx}</output>
      <output aria-label="l2">{l2Tx}</output>
    </div>
  );
}

function WithdrawProbe() {
  const { statusCode, run, l2Tx } = useWithdrawERC20();

  return (
    <div>
      <button onClick={() => run('1')} aria-label="runw">
        run
      </button>
      <output aria-label="codew">{statusCode}</output>
      <output aria-label="l2w">{l2Tx}</output>
    </div>
  );
}

describe('useBridge', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    callCount = 0;
  });

  it('deposit: approve + deposit → waiting_l2 → completed', async () => {
    l1Public.readContract.mockResolvedValueOnce(0n);

    l1Public.waitForTransactionReceipt.mockResolvedValueOnce({});
    l1Public.waitForTransactionReceipt.mockResolvedValueOnce({});
    l2Public.waitForTransactionReceipt.mockResolvedValueOnce({});

    writeContractAsync
      .mockResolvedValueOnce('0x'.padEnd(66, 'a'))
      .mockResolvedValueOnce('0x'.padEnd(66, 'b'));

    render(<DepositProbe />);
    await userEvent.click(screen.getByLabelText('run'));

    await screen.findByText('completed');
    expect(writeContractAsync).toHaveBeenCalledTimes(2);
    expect(screen.getByLabelText('l1').textContent).toMatch(/^0x/);
    expect(screen.getByLabelText('l2').textContent).toMatch(/^0x/);
  });

  it('withdraw: withdrawTo → saved', async () => {
    writeContractAsync.mockResolvedValueOnce('0x'.padEnd(66, 'c'));
    render(<WithdrawProbe />);
    await userEvent.click(screen.getByLabelText('runw'));
    await screen.findByText('saved');
    expect(screen.getByLabelText('l2w').textContent).toMatch(/^0x/);
  });
});

import type { DepositStep, FaucetStep, WithdrawFlowStep, WithdrawStep } from '@lib/status';

export function depositProgressByStep(step: DepositStep): number {
  switch (step) {
    case 'approving':
    case 'approve_skipped':
      return 25;
    case 'depositing':
      return 50;
    case 'waiting_l2':
      return 75;
    case 'completed':
      return 100;
    default:
      return 0;
  }
}

export function depositProgress(status: string): number {
  if (!status) return 0;
  if (status.startsWith('Approving')) return 25;
  if (status.startsWith('Depositing')) return 50;
  if (status.startsWith('Waiting L2')) return 75;
  if (status.includes('Deposit completed')) return 100;

  return 0;
}

export function withdrawInitiateProgressByStep(step: WithdrawStep): number {
  switch (step) {
    case 'withdrawing':
      return 50;
    case 'saved':
      return 100;
    default:
      return 0;
  }
}

export function faucetProgressByStep(step: FaucetStep): number {
  switch (step) {
    case 'preparing':
      return 5;
    case 'switching_chain':
      return 10;
    case 'request_signature':
      return 30;
    case 'submitted':
      return 40;
    case 'confirming':
      return 70;
    case 'refetching':
      return 90;
    case 'completed':
      return 100;
    default:
      return 0;
  }
}

export type ProgressVariant = 'success' | 'neutral' | 'warning';

export function depositVariantByStep(step: DepositStep): ProgressVariant {
  if (step === 'completed') return 'success';
  if (step === 'waiting_l2') return 'neutral';

  return 'warning';
}

export function withdrawInitiateVariantByStep(step: WithdrawStep): ProgressVariant {
  if (step === 'saved') return 'success';
  if (step === 'withdrawing') return 'warning';

  return 'neutral';
}

export function faucetVariantByStep(step: FaucetStep): ProgressVariant {
  if (step === 'completed') return 'success';
  if (step === 'confirming' || step === 'refetching' || step === 'submitted') return 'neutral';

  return 'warning';
}

export function withdrawFlowVariant(step: WithdrawFlowStep): ProgressVariant {
  if (step === 'finalized' || step === 'proved') return 'success';
  if (
    step === 'waiting_provable' ||
    step === 'waiting_finalizable' ||
    step === 'checking_l2_receipt'
  )
    return 'neutral';

  return 'warning';
}

export function withdrawProgress(status: string): number {
  if (!status) return 0;
  if (status.startsWith('Withdrawing')) return 25;
  if (status.includes('증명 가능 시점')) return 50;
  if (status.startsWith('증명 트랜잭션')) return 60;
  if (status.includes('증명 완료')) return 70;
  if (status.startsWith('최종화 가능 시점')) return 80;
  if (status.startsWith('최종화 트랜잭션')) return 90;
  if (status.includes('최종화 완료')) return 100;

  return 0;
}

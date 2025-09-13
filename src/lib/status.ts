export type DepositStep =
  | 'idle'
  | 'approving'
  | 'approve_skipped'
  | 'depositing'
  | 'waiting_l2'
  | 'completed'
  | 'error';

export type WithdrawStep = 'idle' | 'withdrawing' | 'saved' | 'error';

import { t } from '@lib/i18n';

export function depositStatusMessage(step: DepositStep, opts?: { l2Hash?: string }) {
  switch (step) {
    case 'approving':
      return t('s_approving');
    case 'approve_skipped':
      return t('s_approve_skipped');
    case 'depositing':
      return t('s_depositing');
    case 'waiting_l2':
      return `${t('s_waiting_l2')} ${opts?.l2Hash ?? ''}`.trim();
    case 'completed':
      return t('s_completed');
    case 'error':
      return t('s_error');
    default:
      return '';
  }
}

export function withdrawStatusMessage(step: WithdrawStep) {
  switch (step) {
    case 'withdrawing':
      return t('s_withdrawing');
    case 'saved':
      return t('s_saved');
    case 'error':
      return t('s_error');
    default:
      return '';
  }
}

export function isBusyCode(step: DepositStep | WithdrawStep) {
  return (
    step === 'approving' || step === 'depositing' || step === 'waiting_l2' || step === 'withdrawing'
  );
}

export function isDoneCode(step: DepositStep | WithdrawStep) {
  return step === 'completed' || step === 'saved';
}

export type WithdrawFlowStep =
  | 'idle'
  | 'checking_l2_receipt'
  | 'waiting_provable'
  | 'proving'
  | 'proved'
  | 'waiting_finalizable'
  | 'finalizing'
  | 'finalized'
  | 'error';

export function withdrawFlowMessage(step: WithdrawFlowStep) {
  switch (step) {
    case 'checking_l2_receipt':
      return t('wf_checking_l2');
    case 'waiting_provable':
      return t('wf_waiting_provable');
    case 'proving':
      return t('wf_proving');
    case 'proved':
      return t('wf_proved');
    case 'waiting_finalizable':
      return t('wf_waiting_finalizable');
    case 'finalizing':
      return t('wf_finalizing');
    case 'finalized':
      return t('wf_finalized');
    case 'error':
      return t('s_error');
    default:
      return '';
  }
}

export function withdrawFlowPercent(step: WithdrawFlowStep): number {
  switch (step) {
    case 'checking_l2_receipt':
      return 10;
    case 'waiting_provable':
      return 40;
    case 'proving':
      return 60;
    case 'proved':
      return 70;
    case 'waiting_finalizable':
      return 80;
    case 'finalizing':
      return 90;
    case 'finalized':
      return 100;
    default:
      return 0;
  }
}

export function isBusyFlow(step: WithdrawFlowStep) {
  return (
    step === 'checking_l2_receipt' ||
    step === 'waiting_provable' ||
    step === 'proving' ||
    step === 'waiting_finalizable' ||
    step === 'finalizing'
  );
}

export function isDoneFlow(step: WithdrawFlowStep) {
  return step === 'proved' || step === 'finalized';
}

export type FaucetStep =
  | 'idle'
  | 'preparing'
  | 'switching_chain'
  | 'request_signature'
  | 'submitted'
  | 'confirming'
  | 'refetching'
  | 'completed'
  | 'error';

export function faucetMessage(step: FaucetStep) {
  switch (step) {
    case 'preparing':
      return t('s_faucet_preparing');
    case 'switching_chain':
      return t('s_faucet_switching_chain');
    case 'request_signature':
      return t('s_faucet_request_signature');
    case 'submitted':
      return t('s_faucet_submitted');
    case 'confirming':
      return t('s_faucet_confirming');
    case 'refetching':
      return t('s_faucet_refetching');
    case 'completed':
      return t('s_faucet_completed');
    case 'error':
      return t('s_error');
    default:
      return '';
  }
}

export function isBusyFaucet(step: FaucetStep) {
  return (
    step === 'preparing' ||
    step === 'switching_chain' ||
    step === 'request_signature' ||
    step === 'submitted' ||
    step === 'confirming' ||
    step === 'refetching'
  );
}

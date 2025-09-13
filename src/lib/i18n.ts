type Dict = Record<string, string>;

const ko: Dict = {
  connect_wallet: '지갑 연결',
  switch_to_sepolia: 'Sepolia 전환',
  switch_to_giwa: 'GIWA 전환',
  amount: '수량',
  approve_deposit: '승인 + 입금',
  withdraw: '출금',
  nav_home: '홈',
  nav_token_deposit: 'ERC-20 입금',
  nav_token_withdraw: 'ERC-20 출금',
  nav_eth_deposit: 'ETH 입금',
  nav_eth_withdraw: 'ETH 출금',
  nav_withdraw_progress: '출금 진행',
  need_connect: '지갑 연결 필요',
  need_switch_sepolia: 'Sepolia 전환 필요',
  need_switch_giwa: 'GIWA 전환 필요',

  s_approving: '승인 진행 중…',
  s_approve_skipped: '승인 생략(허용량 충분)',
  s_depositing: '입금 진행 중…',
  s_waiting_l2: 'L2 반영 대기 중…',
  s_completed: '입금 완료',
  s_error: '오류',

  s_withdrawing: '출금 개시 중…',
  s_saved: 'L2 출금 Tx 저장됨(증명/최종화 대기)',

  wf_checking_l2: 'L2 영수증 확인 중…',
  wf_waiting_provable: 'L1 증명 가능 시점 대기…',
  wf_proving: '증명 Tx 전송 중…',
  wf_proved: '증명 완료',
  wf_waiting_finalizable: '최종화 가능 시점 대기(챌린지 기간)…',
  wf_finalizing: '최종화 Tx 전송 중…',
  wf_finalized: '최종화 완료',
  wf_proved_with_hash: '증명 완료: {hash}',
  wf_finalized_with_hash: '최종화 완료: {hash}',
  s_saved_with_hash: 'L2 출금 Tx 저장됨(증명/최종화 대기): {hash}',
  s_faucet_claiming: 'Faucet 클레임 진행 중…',
  s_faucet_completed: 'Faucet 클레임 완료',
  s_faucet_preparing: 'Faucet 준비 중…',
  s_faucet_switching_chain: 'Sepolia 전환 중…',
  s_faucet_request_signature: '지갑 서명/전송 요청 중…',
  s_faucet_submitted: 'Tx 전송됨',
  s_faucet_confirming: '확정 대기 중…',
  s_faucet_refetching: '잔고 갱신 중…',
  s_faucet_submitted_with_hash: '전송됨: {hash}',
  s_faucet_confirming_with_hash: '컨펌 대기: {hash}',
  btn_prove_on_l1: 'L1 증명',
  btn_finalize_on_l1: 'L1 최종화',
  note_withdraw_timing: '참고: 증명은 수분 소요 가능. 최종화는 챌린지 기간 필요.',
  note_deposit_eth_delay: 'L1 확정 후 L2 반영까지 1–3분 소요 가능.',
  title_withdraw_progress: '출금 진행(증명/최종화)',
  label_l2_withdraw_hash: 'L2 출금 Tx 해시',
  ph_l2_withdraw_hash: '0x… Tx 해시',
  intro_withdraw_progress:
    '이 화면은 GIWA → Ethereum 출금을 증명/최종화로 마무리함. 먼저 L2에서 출금 개시 후 생성된 Tx 해시로 진행.',
  note_auto_fill_withdraw_hash: '최근 개시한 출금 Tx 해시가 있으면 자동 입력됨.',
  explain_prove: '증명: L2 출금을 L1에 증명.',
  explain_finalize: '최종화: 챌린지 기간 후 출금 완료.',
  balances_title: '잔액',
  app_title: 'GIWA Bridge',
  app_intro: 'Ethereum Sepolia ↔ GIWA Sepolia (ETH, ERC-20)',
  title_deposit_erc20: '입금(Ethereum → GIWA)',
  title_withdraw_erc20: '출금(GIWA → Ethereum)',
  title_deposit_eth: 'ETH 입금(Ethereum → GIWA)',
  title_withdraw_eth: 'ETH 출금(GIWA → Ethereum)',
  warn_insufficient_balance: '잔액 부족',
  btn_faucet_l1: 'Faucet 토큰 받기(L1)',
  loading_page: '페이지 로딩 중…',
  prefetch_on: 'Prefetch: On',
  prefetch_off: 'Prefetch: Off',
  view_on_etherscan: 'Etherscan에서 보기',
  view_on_giwascan: 'Giwascan에서 보기',
  copy: '복사',
  copied: '복사됨',
  tx_l1: 'L1 Tx',
  tx_l2: 'L2 Tx',
  elapsed: '경과 시간',
  last_updated: '마지막 업데이트',
  eta_remaining: '예상 남은 시간',
  refresh: '새로고침',
  auto_progress: '자동 진행',
  auto_progress_desc: '가능 시점에 자동 증명/최종화',
  retry: '재시도',
  error_invalid_number: '숫자 형식 아님',
  error_generic_title: '오류 발생',
  btn_retry: '다시 시도',
  note_after_withdraw_initiate: '출금 개시 후 "출금 진행" 탭에서 증명/최종화 진행',
  connect: '연결',
  connecting: '연결 중…',
  wallet_label: '지갑',
  network_label: '네트워크',
  disconnect: '연결 해제',
  open_giwa_faucet: 'GIWA Faucet 열기',
  footer_open_source: '이 프로젝트는 오픈소스입니다',
};

const en: Dict = {
  connect_wallet: 'Connect Wallet',
  switch_to_sepolia: 'Switch to Sepolia',
  switch_to_giwa: 'Switch to GIWA',
  amount: 'Amount',
  approve_deposit: 'Approve + Deposit',
  withdraw: 'Withdraw',
  nav_home: 'Home',
  nav_token_deposit: 'ERC-20 Deposit',
  nav_token_withdraw: 'ERC-20 Withdraw',
  nav_eth_deposit: 'Deposit ETH',
  nav_eth_withdraw: 'Withdraw ETH',
  nav_withdraw_progress: 'Withdraw Progress',
  need_connect: 'Please connect your wallet',
  need_switch_sepolia: 'Please switch to Sepolia',
  need_switch_giwa: 'Please switch to GIWA',

  s_approving: 'Approving…',
  s_approve_skipped: 'Skipping approve (already enough)',
  s_depositing: 'Depositing…',
  s_waiting_l2: 'Waiting L2…',
  s_completed: 'Deposit completed ✅',
  s_error: 'Error',

  s_withdrawing: 'Withdrawing…',
  s_saved: 'L2 withdrawal tx saved (waiting prove/finalize)',

  wf_checking_l2: 'Checking L2 receipt…',
  wf_waiting_provable: 'Waiting provable on L1…',
  wf_proving: 'Sending prove transaction…',
  wf_proved: 'Proved ✅',
  wf_waiting_finalizable: 'Waiting finalizable (challenge period)…',
  wf_finalizing: 'Sending finalize transaction…',
  wf_finalized: 'Finalized ✅',
  wf_proved_with_hash: 'Proved ✅: {hash}',
  wf_finalized_with_hash: 'Finalized ✅: {hash}',
  s_saved_with_hash: 'L2 withdrawal tx saved (waiting prove/finalize): {hash}',
  s_faucet_claiming: 'Claiming faucet…',
  s_faucet_completed: 'Faucet received ✅',
  s_faucet_preparing: 'Preparing faucet…',
  s_faucet_switching_chain: 'Switching to Sepolia…',
  s_faucet_request_signature: 'Requesting wallet signature…',
  s_faucet_submitted: 'Transaction submitted',
  s_faucet_confirming: 'Waiting for confirmation…',
  s_faucet_refetching: 'Refreshing balance…',
  s_faucet_submitted_with_hash: 'Submitted: {hash}',
  s_faucet_confirming_with_hash: 'Confirming: {hash}',
  btn_prove_on_l1: 'Prove on L1',
  btn_finalize_on_l1: 'Finalize on L1',
  note_withdraw_timing: 'Note: Proving can take minutes; finalization requires challenge period.',
  note_deposit_eth_delay: 'After L1 confirmation, L2 reflection can take 1–3 minutes.',
  title_withdraw_progress: 'Withdraw Progress (Prove/Finalize)',
  label_l2_withdraw_hash: 'L2 withdrawal transaction hash',
  ph_l2_withdraw_hash: 'Transaction hash starting with 0x',
  intro_withdraw_progress:
    'This page completes GIWA → Ethereum withdrawals (prove/finalize). First initiate the withdrawal on L2, then proceed with the resulting transaction hash.',
  note_auto_fill_withdraw_hash: 'If available, the most recent withdrawal hash is auto-filled.',
  explain_prove: 'Prove: Prove the L2 withdrawal on L1 to move forward.',
  explain_finalize: 'Finalize: After challenge period, finalize to complete the withdrawal.',
  balances_title: 'Balances',
  app_title: 'GIWA Bridge',
  app_intro: 'Ethereum Sepolia ↔ GIWA Sepolia (ETH, ERC-20)',
  title_deposit_erc20: 'Deposit (Ethereum → GIWA)',
  title_withdraw_erc20: 'Withdraw (GIWA → Ethereum)',
  title_deposit_eth: 'Deposit ETH (Ethereum → GIWA)',
  title_withdraw_eth: 'Withdraw ETH (GIWA → Ethereum)',
  warn_insufficient_balance: 'Insufficient balance.',
  btn_faucet_l1: 'Get Faucet Token (L1)',
  loading_page: 'Loading page…',
  prefetch_on: 'Prefetch: On',
  prefetch_off: 'Prefetch: Off',
  view_on_etherscan: 'View on Etherscan',
  view_on_giwascan: 'View on Giwascan',
  copy: 'Copy',
  copied: 'Copied',
  tx_l1: 'L1 Transaction',
  tx_l2: 'L2 Transaction',
  elapsed: 'Elapsed',
  last_updated: 'Last updated',
  eta_remaining: 'ETA',
  refresh: 'Refresh',
  auto_progress: 'Auto Progress',
  auto_progress_desc: 'Auto prove/finalize when possible',
  retry: 'Retry',
  error_invalid_number: 'Invalid number',
  error_generic_title: 'Error occurred',
  btn_retry: 'Retry',
  note_after_withdraw_initiate:
    'After initiating Withdraw, go to "Withdraw Progress" to Prove/Finalize.',
  connect: 'Connect',
  connecting: 'Connecting…',
  wallet_label: 'Wallet',
  network_label: 'Network',
  disconnect: 'Disconnect',
  open_giwa_faucet: 'Open GIWA Faucet',
  footer_open_source: 'This project is open source',
};

const dicts = { ko, en };

type Locale = keyof typeof dicts;
let current: Locale =
  (typeof localStorage !== 'undefined' && (localStorage.getItem('locale') as Locale)) || 'ko';

export function setLocale(l: Locale) {
  current = l;
  try {
    localStorage.setItem('locale', l);
  } catch {}
}

export function getLocale(): Locale {
  return current;
}

export type I18nKey = keyof typeof ko;
export function t(key: I18nKey): string;
export function t(key: string): string;
export function t(key: string): string {
  return dicts[current][key as I18nKey] || String(key);
}

export function tf(key: I18nKey | string, vars: Record<string, string | number>): string {
  const base = t(key);

  return base.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ''));
}

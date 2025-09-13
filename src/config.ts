import type { Address } from 'viem';

const VITE_RPC_L1 = import.meta.env?.VITE_RPC_L1 as string | undefined;
const VITE_RPC_L2 = import.meta.env?.VITE_RPC_L2 as string | undefined;

const VITE_L1_TOKEN = import.meta.env?.VITE_L1_TOKEN as string | undefined;
const VITE_L2_TOKEN = import.meta.env?.VITE_L2_TOKEN as string | undefined;
const VITE_L1_BRIDGE = import.meta.env?.VITE_L1_BRIDGE as string | undefined;
const VITE_L2_BRIDGE = import.meta.env?.VITE_L2_BRIDGE as string | undefined;
const VITE_EXPLORER_L1 = import.meta.env?.VITE_EXPLORER_L1 as string | undefined;
const VITE_EXPLORER_L2 = import.meta.env?.VITE_EXPLORER_L2 as string | undefined;

export const CHAIN_IDS = {
  L1: 11155111,
  L2: 91342,
} as const;

export const RPC = {
  L1: VITE_RPC_L1 ?? 'https://ethereum-sepolia.publicnode.com',
  L2: VITE_RPC_L2 ?? 'https://sepolia-rpc.giwa.io',
} as const;

export const ADDRESSES: {
  L1_TOKEN: Address;
  L2_TOKEN: Address;
  L1_BRIDGE: Address;
  L2_BRIDGE: Address;
} = {
  L1_TOKEN: (VITE_L1_TOKEN ?? '0x50B1eF6e0fe05a32F3E63F02f3c0151BD9004C7c') as Address,
  L2_TOKEN: (VITE_L2_TOKEN ?? '0xB11E5c9070a57C0c33Df102436C440a2c73a4c38') as Address,
  L1_BRIDGE: (VITE_L1_BRIDGE ?? '0x77b2ffc0F57598cAe1DB76cb398059cF5d10A7E7') as Address,
  L2_BRIDGE: (VITE_L2_BRIDGE ?? '0x4200000000000000000000000000000000000010') as Address,
};

export const EXPLORER = {
  L1: VITE_EXPLORER_L1 ?? 'https://sepolia.etherscan.io',
  L2: VITE_EXPLORER_L2 ?? 'https://sepolia-explorer.giwa.io',
} as const;

const VITE_EXPLORER_L1_KEYWORD = import.meta.env?.VITE_EXPLORER_L1_KEYWORD as string | undefined;
const VITE_EXPLORER_L2_KEYWORD = import.meta.env?.VITE_EXPLORER_L2_KEYWORD as string | undefined;

export const EXPLORER_KEYWORDS = {
  L1: (VITE_EXPLORER_L1_KEYWORD ?? 'etherscan').toLowerCase(),
  L2: (VITE_EXPLORER_L2_KEYWORD ?? 'giwa').toLowerCase(),
} as const;

const VITE_PROVE_MAX_SEC = Number(import.meta.env?.VITE_PROVE_MAX_SEC ?? '7200');
const VITE_FINALIZE_MAX_SEC = Number(
  import.meta.env?.VITE_FINALIZE_MAX_SEC ?? String(7 * 24 * 60 * 60),
);

export const TIMINGS = {
  PROVE_MAX_SEC: Number.isFinite(VITE_PROVE_MAX_SEC) ? VITE_PROVE_MAX_SEC : 7200,
  FINALIZE_MAX_SEC: Number.isFinite(VITE_FINALIZE_MAX_SEC)
    ? VITE_FINALIZE_MAX_SEC
    : 7 * 24 * 60 * 60,
} as const;

const VITE_AUTO_PROGRESS_DEFAULT = String(import.meta.env?.VITE_AUTO_PROGRESS ?? 'true');
const VITE_AUTO_PROGRESS_INTERVAL_MS = Number(
  import.meta.env?.VITE_AUTO_PROGRESS_INTERVAL_MS ?? '30000',
);

export const PROGRESS = {
  AUTO_PROGRESS_DEFAULT: /^(1|true|on|yes)$/i.test(VITE_AUTO_PROGRESS_DEFAULT),
  AUTO_PROGRESS_INTERVAL_MS: Number.isFinite(VITE_AUTO_PROGRESS_INTERVAL_MS)
    ? VITE_AUTO_PROGRESS_INTERVAL_MS
    : 30000,
} as const;

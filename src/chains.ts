import { defineChain } from 'viem';
import { sepolia } from 'viem/chains';

import { RPC } from '@/config';

export const giwaSepolia = defineChain({
  id: 91342,
  name: 'Giwa Sepolia',
  nativeCurrency: { name: 'Sepolia Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: { http: [RPC.L2] },
    public: { http: [RPC.L2] },
  },
  contracts: {
    multicall3: { address: '0xcA11bde05977b3631167028862bE2a173976CA11' },
    l2OutputOracle: {},
    disputeGameFactory: { [sepolia.id]: { address: '0x37347caB2afaa49B776372279143D71ad1f354F6' } },
    portal: { [sepolia.id]: { address: '0x956962C34687A954e611A83619ABaA37Ce6bC78A' } },
    l1StandardBridge: { [sepolia.id]: { address: '0x77b2ffc0F57598cAe1DB76cb398059cF5d10A7E7' } },
  },
  testnet: true,
});

export const CHAINS = [sepolia, giwaSepolia] as const;
export type SupportedChainId = (typeof CHAINS)[number]['id'];

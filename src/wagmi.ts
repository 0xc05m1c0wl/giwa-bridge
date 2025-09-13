import { sepolia } from 'viem/chains';
import { createConfig, http } from 'wagmi';
import { injected } from 'wagmi/connectors';

import { giwaSepolia } from '@/chains';
import { RPC } from '@/config';

export const wagmiConfig = createConfig({
  chains: [sepolia, giwaSepolia],
  transports: {
    [sepolia.id]: RPC.L1 ? http(RPC.L1) : http(),
    [giwaSepolia.id]: http(RPC.L2),
  },
  connectors: [injected()],
});

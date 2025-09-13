import { PropsWithChildren } from 'react';
import { sepolia } from 'viem/chains';
import { useAccount } from 'wagmi';

import { giwaSepolia } from '@/chains';

type Mode = 'sepolia' | 'giwa' | 'any';

export function Guard({ need, children }: PropsWithChildren<{ need: Mode }>) {
  const { isConnected, chainId } = useAccount();

  if (!isConnected) return null;
  if (need === 'sepolia' && chainId !== sepolia.id) return null;
  if (need === 'giwa' && chainId !== giwaSepolia.id) return null;

  return <>{children}</>;
}

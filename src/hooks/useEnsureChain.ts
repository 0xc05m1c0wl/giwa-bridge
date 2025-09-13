import { useCallback } from 'react';
import { useAccount, useSwitchChain } from 'wagmi';

export function useEnsureChain(targetChainId: number) {
  const { chainId } = useAccount();
  const { switchChain } = useSwitchChain();

  const ensure = useCallback(async () => {
    if (chainId !== targetChainId) {
      await switchChain({ chainId: targetChainId });
    }
  }, [chainId, switchChain, targetChainId]);

  return ensure;
}

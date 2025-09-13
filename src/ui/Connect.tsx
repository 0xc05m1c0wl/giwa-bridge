import { Button } from '@components/ui/button';
import { t } from '@lib/i18n';
import { chainName } from '@lib/network';
import { toaster } from '@lib/toaster';
import { CopyIcon } from '@radix-ui/react-icons';
import { sepolia } from 'viem/chains';
import { useAccount, useConnect, useDisconnect, useSwitchChain } from 'wagmi';

import { giwaSepolia } from '@/chains';

export function Connect() {
  const { connectors, connect, status, error } = useConnect();
  const { address, chainId, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { switchChain } = useSwitchChain();

  if (!isConnected)
    return (
      <div className="flex items-center gap-2">
        {connectors.map((c) => (
          <Button key={c.uid} onClick={() => connect({ connector: c })}>
            {c.name} {t('connect')}
          </Button>
        ))}
        <span className="text-slate-500" aria-live="polite" aria-busy={status === 'pending'}>
          {status === 'pending' ? t('connecting') : ''}
        </span>
        {error && <span className="text-red-500">{error.message}</span>}
      </div>
    );

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="inline-flex items-center gap-2">
        {t('wallet_label')}: <code className="font-mono">{address}</code>
        {address && (
          <button
            className="inline-flex items-center gap-1 underline"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(address);
                toaster.success(t('copied'));
              } catch {}
            }}
            aria-label={t('copy')}
            title={t('copy')}
          >
            <CopyIcon /> {t('copy')}
          </button>
        )}
      </span>
      <span>
        {t('network_label')}: <code>{chainName(chainId)}</code>
      </span>
      <Button variant="outline" onClick={() => switchChain({ chainId: sepolia.id })}>
        {t('switch_to_sepolia')}
      </Button>
      <Button variant="outline" onClick={() => switchChain({ chainId: giwaSepolia.id })}>
        {t('switch_to_giwa')}
      </Button>
      <Button variant="destructive" onClick={() => disconnect()}>
        {t('disconnect')}
      </Button>
    </div>
  );
}

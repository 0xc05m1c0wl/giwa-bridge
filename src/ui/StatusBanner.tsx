import { Button } from '@components/ui/button';
import { t } from '@lib/i18n';
import { useLocation } from 'react-router-dom';
import { sepolia } from 'viem/chains';
import { useAccount, useSwitchChain } from 'wagmi';

import { giwaSepolia } from '@/chains';

type BannerItem = {
  message: string;
  action?: { label: string; target: number };
};

type ChainNeed = 'sepolia' | 'giwa' | null;

function requiredChainForPath(pathname: string): ChainNeed {
  const isDeposit = pathname.startsWith('/deposit') || pathname.startsWith('/eth/deposit');

  if (isDeposit) return 'sepolia';

  const isWithdrawProgress = pathname.startsWith('/withdraw/progress');

  if (isWithdrawProgress) return 'sepolia';

  const isWithdrawStart =
    (pathname.startsWith('/withdraw') && !pathname.includes('progress')) ||
    pathname.startsWith('/eth/withdraw');

  if (isWithdrawStart) return 'giwa';

  return null;
}

function deriveBanners(
  pathname: string,
  chainId: number | undefined,
  isConnected: boolean,
): BannerItem[] {
  const items: BannerItem[] = [];

  if (!isConnected) return [{ message: t('need_connect') }];

  const need = requiredChainForPath(pathname);

  if (need === 'sepolia' && chainId !== sepolia.id) {
    items.push({
      message: t('need_switch_sepolia'),
      action: { label: t('switch_to_sepolia'), target: sepolia.id },
    });
  } else if (need === 'giwa' && chainId !== giwaSepolia.id) {
    items.push({
      message: t('need_switch_giwa'),
      action: { label: t('switch_to_giwa'), target: giwaSepolia.id },
    });
  }

  return items;
}

export function StatusBanner({ sticky = true }: { sticky?: boolean } = {}) {
  const { isConnected, chainId } = useAccount();
  const loc = useLocation();
  const { switchChain } = useSwitchChain();

  const base = (import.meta.env.BASE_URL || '/').replace(/\/+$/, '');
  const p0 = loc.pathname;
  const pathname = base && p0.startsWith(base) ? p0.slice(base.length) || '/' : p0;

  const items = deriveBanners(pathname, chainId, isConnected);

  if (items.length === 0) return null;

  const rootClass = `${sticky ? 'sticky top-0 ' : ''}my-2 rounded-md border border-amber-300 bg-amber-100 text-amber-900 px-3 py-2`;

  return (
    <div className={rootClass} role="status" aria-live="polite">
      <div className="flex flex-col gap-2">
        {items.map((it, idx) => (
          <div key={idx} className="flex items-center justify-between gap-3">
            <span>{it.message}</span>
            {it.action && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => switchChain({ chainId: it.action!.target })}
              >
                {it.action.label}
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

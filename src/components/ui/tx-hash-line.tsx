import { cn } from '@lib/cn';
import { shortHash } from '@lib/format';
import { t } from '@lib/i18n';
import { toaster } from '@lib/toaster';
import { CopyIcon, ExternalLinkIcon } from '@radix-ui/react-icons';

import { EXPLORER_KEYWORDS } from '@/config';
import type { TxHash } from '@/types/primitives';

type Props = {
  label?: string;
  hash: TxHash | '';
  explorerBase?: string;
  className?: string;
  tone?: 'l1' | 'l2' | 'default';
};

export function TxHashLine({ label, hash, explorerBase, className, tone = 'default' }: Props) {
  if (!hash) return null;
  const tones = {
    l1: 'bg-blue-100 text-blue-800',
    l2: 'bg-violet-100 text-violet-800',
    default: 'bg-slate-100 text-slate-700',
  } as const;
  const badgeClass = tones[tone];
  const isGiwascan =
    tone === 'l2' ||
    (explorerBase ? explorerBase.toLowerCase().includes(EXPLORER_KEYWORDS.L2) : false);

  return (
    <div className={cn('flex items-center gap-2 text-xs', className)}>
      {label && (
        <span
          className={cn(
            'inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-medium',
            badgeClass,
          )}
        >
          {label}
        </span>
      )}
      <code className="font-mono text-xs">{shortHash(hash)}</code>
      {explorerBase && (
        <a
          href={`${explorerBase}/tx/${hash}`}
          target="_blank"
          rel="noreferrer noopener"
          className="inline-flex items-center gap-1 underline"
          aria-label={isGiwascan ? t('view_on_giwascan') : t('view_on_etherscan')}
          title={isGiwascan ? t('view_on_giwascan') : t('view_on_etherscan')}
        >
          <ExternalLinkIcon /> {isGiwascan ? t('view_on_giwascan') : t('view_on_etherscan')}
        </a>
      )}
      <button
        type="button"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(hash);
            toaster.success(t('copied'));
          } catch {}
        }}
        className="inline-flex items-center gap-1 underline"
        aria-label={t('copy')}
        title={t('copy')}
      >
        <CopyIcon /> {t('copy')}
      </button>
    </div>
  );
}

export default TxHashLine;

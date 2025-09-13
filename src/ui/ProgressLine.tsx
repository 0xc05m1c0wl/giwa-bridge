type Props = { percent: number; variant?: 'success' | 'neutral' | 'warning' };
export function ProgressLine({ percent, variant = 'success' }: Props) {
  const p = Math.max(0, Math.min(100, percent));
  const COLOR: Record<NonNullable<Props['variant']>, string> = {
    success: 'bg-green-400',
    warning: 'bg-amber-400',
    neutral: 'bg-slate-400',
  };
  const color = COLOR[variant] ?? COLOR.success;

  return (
    <div className="w-full bg-slate-300/50 rounded h-2">
      <div className={['h-2 rounded', color].join(' ')} style={{ width: `${p}%` }} />
    </div>
  );
}

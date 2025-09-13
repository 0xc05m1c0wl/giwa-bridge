import { cn } from '../lib/cn';

export function Spinner({ className }: { className?: string }) {
  return (
    <span
      aria-live="polite"
      aria-busy="true"
      role="status"
      className={cn(
        'inline-block w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin',
        className,
      )}
    />
  );
}

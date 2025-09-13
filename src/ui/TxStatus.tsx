import { cn } from '@lib/cn';
import { CheckIcon, DotFilledIcon, ExclamationTriangleIcon } from '@radix-ui/react-icons';
import { Spinner } from '@ui/Spinner';

type Props = {
  text: string;
  busy?: boolean;
  done?: boolean;
  error?: boolean;
  className?: string;
};

export function TxStatus({ text, busy, done, error, className }: Props) {
  if (!text) return null;
  let state: 'error' | 'done' | 'busy' | 'idle' = 'idle';

  if (error) state = 'error';
  else if (done) state = 'done';
  else if (busy) state = 'busy';
  const COLOR: Record<typeof state, string> = {
    error: 'text-red-600',
    done: 'text-green-600',
    busy: 'text-slate-600 dark:text-slate-300',
    idle: 'text-slate-600 dark:text-slate-300',
  };
  const colorClass = COLOR[state];

  let icon: React.ReactNode = <DotFilledIcon />;

  if (state === 'busy') icon = <Spinner />;
  else if (state === 'error') icon = <ExclamationTriangleIcon />;
  else if (state === 'done') icon = <CheckIcon />;

  return (
    <p className={cn('flex items-center gap-1.5 text-sm', colorClass, className)}>
      {icon}
      <span>{text}</span>
    </p>
  );
}

export default TxStatus;

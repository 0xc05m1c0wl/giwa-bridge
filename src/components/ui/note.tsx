import { cn } from '@lib/cn';
import * as React from 'react';

export type NoteProps = React.HTMLAttributes<HTMLParagraphElement>;

export function Note({ className, ...props }: NoteProps) {
  return <p className={cn('text-xs text-slate-500 mt-2', className)} {...props} />;
}

export default Note;

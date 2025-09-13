import { cn } from '@lib/cn';
import * as React from 'react';

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('mx-auto w-full max-w-3xl px-4 md:px-6', className)} {...props} />
  ),
);
Container.displayName = 'Container';

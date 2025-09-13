import { cn } from '@lib/cn';
import * as React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('rounded-xl border bg-card text-card-foreground p-4 my-3', className)}
    {...props}
  />
));
Card.displayName = 'Card';

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}
export const CardHeader = ({ className, ...props }: CardHeaderProps) => (
  <div className={cn('mb-3 flex items-center justify-between', className)} {...props} />
);

export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {}
export const CardContent = ({ className, ...props }: CardContentProps) => (
  <div className={cn('space-y-3', className)} {...props} />
);

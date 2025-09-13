import { Label } from '@components/ui/label';
import { cn } from '@lib/cn';
import * as React from 'react';

type Props = {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
  className?: string;
  labelWidthClass?: string;
};

export function FormRow({ label, htmlFor, children, className, labelWidthClass = 'w-24' }: Props) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Label htmlFor={htmlFor} className={labelWidthClass}>
        {label}
      </Label>
      {children}
    </div>
  );
}

export default FormRow;

'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Printer } from 'lucide-react';

export interface PrintButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
  iconOnly?: boolean;
  onBeforePrint?: () => void;
}

export function PrintButton({
  className,
  label = 'Print',
  iconOnly = false,
  onBeforePrint,
  ...props
}: PrintButtonProps) {
  const handlePrint = () => {
    onBeforePrint?.();
    window.print();
  };

  return (
    <button
      type="button"
      onClick={handlePrint}
      className={cn(
        'print-button inline-flex items-center justify-center gap-2',
        'rounded-full px-4 py-2 text-sm font-medium',
        'border border-white/12 text-[var(--text-strong)]',
        'hover:border-[var(--brand)] hover:bg-white/5',
        'transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-strong)]',
        iconOnly ? 'h-10 w-10 p-0' : 'px-4 py-2',
        className
      )}
      aria-label={iconOnly ? label : undefined}
      title={iconOnly ? label : undefined}
      {...props}
    >
      <Printer className="h-4 w-4" aria-hidden="true" />
      {!iconOnly && <span>{label}</span>}
    </button>
  );
}

export function useBeforePrint(callback: () => void): void {
  React.useEffect(() => {
    const handler = () => callback();
    window.addEventListener('beforeprint', handler);
    return () => window.removeEventListener('beforeprint', handler);
  }, [callback]);
}

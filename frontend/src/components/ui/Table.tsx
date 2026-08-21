import React from 'react';
import { twMerge } from 'tailwind-merge';

export function TableWrap({ children, className }: {children: React.ReactNode;className?: string;}) {
  return (
    <div className={twMerge('w-full overflow-x-auto', className)}>
      <table className="w-full min-w-[720px] border-collapse text-sm">{children}</table>
    </div>);

}

export function Th({
  children,
  align = 'left',
  className




}: {children?: React.ReactNode;align?: 'left' | 'right' | 'center';className?: string;}) {
  return (
    <th
      scope="col"
      className={twMerge(
        'sticky top-0 z-10 whitespace-nowrap border-b border-ink-200 bg-ink-50 px-4 py-2.5 text-2xs font-semibold uppercase tracking-wider text-ink-500',
        align === 'right' && 'text-right',
        align === 'center' && 'text-center',
        align === 'left' && 'text-left',
        className
      )}>
      
      {children}
    </th>);

}

export function Td({
  children,
  align = 'left',
  className




}: {children?: React.ReactNode;align?: 'left' | 'right' | 'center';className?: string;}) {
  return (
    <td
      className={twMerge(
        'border-b border-ink-100 px-4 py-3 align-middle text-ink-700',
        align === 'right' && 'text-right',
        align === 'center' && 'text-center',
        className
      )}>
      
      {children}
    </td>);

}

export function Tr({ children, className }: {children: React.ReactNode;className?: string;}) {
  return (
    <tr className={twMerge('transition-colors duration-150 hover:bg-ink-50/70', className)}>
      {children}
    </tr>);

}
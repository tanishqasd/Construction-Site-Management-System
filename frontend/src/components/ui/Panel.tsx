import React from 'react';
import { twMerge } from 'tailwind-merge';

interface PanelProps {
  children: React.ReactNode;
  className?: string;
  as?: 'section' | 'div' | 'article';
}

export function Panel({ children, className, as = 'section' }: PanelProps) {
  const Tag = as;
  return (
    <Tag
      className={twMerge(
        'flex flex-col rounded-lg border border-ink-200 bg-white shadow-panel',
        className
      )}>
      
      {children}
    </Tag>);

}

interface PanelHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
}

export function PanelHeader({ title, subtitle, action, className }: PanelHeaderProps) {
  return (
    <header
      className={twMerge(
        'flex items-start justify-between gap-4 border-b border-ink-100 px-4 py-3',
        className
      )}>
      
      <div className="min-w-0">
        <h2 className="truncate text-sm font-semibold tracking-tight text-ink-900">{title}</h2>
        {subtitle && <p className="mt-0.5 truncate text-xs text-ink-500">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </header>);

}

export function PanelFooterLink({
  children,
  onClick



}: {children: React.ReactNode;onClick?: () => void;}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mt-auto flex w-full items-center justify-center gap-1.5 border-t border-ink-100 px-4 py-2.5 text-xs font-medium text-ink-600 transition-colors duration-150 hover:bg-ink-50 hover:text-ink-900">
      
      {children}
    </button>);

}
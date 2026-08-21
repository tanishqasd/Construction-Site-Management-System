import React from 'react';

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: React.ReactNode;
  children?: React.ReactNode;
}

export function PageHeader({ eyebrow, title, description, actions, children }: PageHeaderProps) {
  return (
    <header className="mb-5 flex flex-wrap items-end justify-between gap-4">
      <div className="min-w-0">
        {eyebrow &&
        <p className="mb-1 font-mono text-2xs uppercase tracking-widest text-ink-400">{eyebrow}</p>
        }
        <h1 className="text-xl font-semibold tracking-tight text-ink-900">{title}</h1>
        {description && <p className="mt-1 max-w-2xl text-sm text-ink-500">{description}</p>}
        {children}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </header>);

}
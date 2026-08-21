import React from 'react';
import { twMerge } from 'tailwind-merge';

interface ProgressBarProps {
  value: number;
  /** Optional planned value rendered as a target marker. */
  planned?: number;
  tone?: 'safety' | 'green' | 'red' | 'steel';
  className?: string;
  label?: string;
}

const fill: Record<string, string> = {
  safety: 'bg-safety-400',
  green: 'bg-signal-green',
  red: 'bg-signal-red',
  steel: 'bg-steel-500'
};

export function ProgressBar({ value, planned, tone = 'safety', className, label }: ProgressBarProps) {
  return (
    <div
      className={twMerge('relative h-1.5 w-full overflow-hidden rounded-full bg-ink-100', className)}
      role="progressbar"
      aria-valuenow={Math.round(value)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label ?? 'Progress'}>
      
      <div
        className={twMerge('h-full rounded-full', fill[tone])}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
      
      {planned !== undefined &&
      <span
        className="absolute top-0 h-full w-px bg-ink-700"
        style={{ left: `${Math.min(100, Math.max(0, planned))}%` }}
        aria-hidden />

      }
    </div>);

}
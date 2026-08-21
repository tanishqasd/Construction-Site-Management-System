import React from 'react';
import { twMerge } from 'tailwind-merge';

type Tone = 'green' | 'red' | 'amber' | 'blue' | 'neutral';

const toneMap: Record<Tone, string> = {
  green: 'bg-signal-greenSoft text-signal-green border-signal-green/20',
  red: 'bg-signal-redSoft text-signal-red border-signal-red/20',
  amber: 'bg-signal-amberSoft text-signal-amber border-signal-amber/20',
  blue: 'bg-signal-blueSoft text-signal-blue border-signal-blue/20',
  neutral: 'bg-ink-50 text-ink-600 border-ink-200'
};

const labelTone: Record<string, Tone> = {
  // projects
  'On Track': 'green',
  'At Risk': 'amber',
  Delayed: 'red',
  Completed: 'blue',
  Planning: 'neutral',
  // tasks
  'In Progress': 'blue',
  'Not Started': 'neutral',
  Blocked: 'red',
  Review: 'amber',
  // priority / severity
  Critical: 'red',
  Blocker: 'red',
  High: 'amber',
  Major: 'amber',
  Medium: 'blue',
  Minor: 'neutral',
  Low: 'neutral',
  // materials
  Healthy: 'green',
  Ordered: 'blue',
  // issues
  Open: 'red',
  'In Review': 'amber',
  Resolved: 'green',
  // expenses
  Approved: 'green',
  Pending: 'amber',
  Rejected: 'red',
  Reimbursed: 'blue',
  // documents
  'For Review': 'amber',
  Superseded: 'neutral'
};

export function StatusBadge({
  label,
  tone,
  className




}: {label: string;tone?: Tone;className?: string;}) {
  const resolved = tone ?? labelTone[label] ?? 'neutral';
  return (
    <span
      className={twMerge(
        'inline-flex items-center whitespace-nowrap rounded border px-1.5 py-0.5 text-2xs font-semibold',
        toneMap[resolved],
        className
      )}>
      
      {label}
    </span>);

}

export function Dot({ tone }: {tone: Tone;}) {
  const bg: Record<Tone, string> = {
    green: 'bg-signal-green',
    red: 'bg-signal-red',
    amber: 'bg-safety-400',
    blue: 'bg-signal-blue',
    neutral: 'bg-ink-300'
  };
  return <span className={twMerge('h-1.5 w-1.5 shrink-0 rounded-full', bg[tone])} aria-hidden />;
}
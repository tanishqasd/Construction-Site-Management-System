import React from 'react';
import { ChevronRightIcon, ShieldAlertIcon } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import { Panel, PanelFooterLink } from '../ui/Panel';
import { alerts } from '../../data/activity';

const levelStyles = {
  critical: { border: 'border-l-signal-red', label: 'Critical', chip: 'bg-signal-red text-white' },
  warning: { border: 'border-l-safety-400', label: 'Warning', chip: 'bg-safety-400 text-ink-900' },
  info: { border: 'border-l-steel-400', label: 'Advisory', chip: 'bg-steel-500 text-white' }
} as const;

export function AlertsPanel() {
  return (
    <Panel className="overflow-hidden">
      <header className="blueprint-grid flex items-center justify-between gap-3 border-b border-ink-800 bg-ink-900 px-4 py-3">
        <div className="flex items-center gap-2">
          <ShieldAlertIcon className="h-4 w-4 text-safety-400" aria-hidden />
          <div>
            <h2 className="text-sm font-semibold tracking-tight text-white">Needs a decision today</h2>
            <p className="text-2xs text-ink-400">2 critical · 2 warnings · 1 advisory</p>
          </div>
        </div>
      </header>
      <ul>
        {alerts.map((alert) => {
          const style = levelStyles[alert.level];
          return (
            <li key={alert.id} className="border-b border-ink-100 last:border-0">
              <button
                type="button"
                className={twMerge(
                  'flex w-full items-start gap-3 border-l-2 px-4 py-3 text-left transition-colors duration-150 hover:bg-ink-50',
                  style.border
                )}>
                
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2">
                    <span
                      className={twMerge(
                        'rounded px-1.5 py-0.5 text-2xs font-semibold uppercase tracking-wide',
                        style.chip
                      )}>
                      
                      {style.label}
                    </span>
                    <span className="font-mono text-2xs text-ink-400">{alert.projectCode}</span>
                  </span>
                  <span className="mt-1.5 block text-xs font-semibold leading-snug text-ink-900">
                    {alert.title}
                  </span>
                  <span className="mt-1 block text-2xs leading-snug text-ink-500">{alert.detail}</span>
                  <span className="mt-1.5 block font-mono text-2xs text-ink-400">{alert.meta}</span>
                </span>
                <ChevronRightIcon className="mt-0.5 h-4 w-4 shrink-0 text-ink-300" aria-hidden />
              </button>
            </li>);

        })}
      </ul>
      <PanelFooterLink>Open alert log</PanelFooterLink>
    </Panel>);

}
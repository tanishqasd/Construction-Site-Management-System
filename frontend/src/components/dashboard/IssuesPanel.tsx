import React from 'react';
import { Link } from 'react-router-dom';
import { MapPinIcon } from 'lucide-react';
import { Panel, PanelHeader } from '../ui/Panel';
import { StatusBadge } from '../ui/StatusBadge';
import { openIssues } from '../../data/issues';

const severityCounts = [
{ label: 'Blockers', count: 4, tone: 'text-signal-red' },
{ label: 'Major', count: 2, tone: 'text-signal-amber' },
{ label: 'Minor', count: 1, tone: 'text-ink-600' }];


export function IssuesPanel() {
  return (
    <Panel className="h-full">
      <PanelHeader
        title="Open site issues"
        subtitle="Quality, safety, design and approval holds"
        action={
        <div className="flex items-center gap-3">
            {severityCounts.map((s) =>
          <span key={s.label} className="text-right">
                <span className={`block font-mono text-sm font-semibold leading-none ${s.tone}`}>
                  {s.count}
                </span>
                <span className="block text-2xs text-ink-400">{s.label}</span>
              </span>
          )}
          </div>
        } />
      
      <ul className="divide-y divide-ink-100">
        {openIssues.slice(0, 5).map((issue) =>
        <li key={issue.id} className="px-4 py-3 transition-colors duration-150 hover:bg-ink-50/60">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-2xs text-ink-400">{issue.ref}</span>
                  <StatusBadge label={issue.severity} />
                  <StatusBadge label={issue.category} tone="neutral" />
                </div>
                <p className="mt-1 truncate text-xs font-semibold text-ink-900">{issue.title}</p>
                <p className="mt-1 flex items-center gap-1 text-2xs text-ink-500">
                  <MapPinIcon className="h-3 w-3 shrink-0" aria-hidden />
                  <span className="truncate">{issue.location}</span>
                </p>
              </div>
              <div className="shrink-0 text-right">
                <StatusBadge label={issue.status} />
                <p className="mt-1.5 font-mono text-2xs text-ink-500">{issue.ageDays}d open</p>
              </div>
            </div>
          </li>
        )}
      </ul>
      <Link
        to="/issues"
        className="mt-auto flex items-center justify-center border-t border-ink-100 px-4 py-2.5 text-xs font-medium text-ink-600 transition-colors duration-150 hover:bg-ink-50 hover:text-ink-900">
        
        Open issue register
      </Link>
    </Panel>);

}
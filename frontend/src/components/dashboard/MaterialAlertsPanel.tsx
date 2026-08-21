import React from 'react';
import { Link } from 'react-router-dom';
import { Panel, PanelHeader } from '../ui/Panel';
import { StatusBadge } from '../ui/StatusBadge';
import { Button } from '../ui/Button';
import { materialAlerts } from '../../data/materials';
import { formatNumber } from '../../utils/format';

export function MaterialAlertsPanel() {
  return (
    <Panel>
      <PanelHeader
        title="Material alerts"
        subtitle="Stock at or below reorder level"
        action={
        <Button variant="secondary" size="sm">
            Raise PO
          </Button>
        } />
      
      <ul className="divide-y divide-ink-100">
        {materialAlerts.map((m) => {
          const daysLeft = m.consumedThisWeek > 0 ? (m.inStock / (m.consumedThisWeek / 7)).toFixed(1) : '—';
          return (
            <li key={m.id} className="px-4 py-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-xs font-semibold text-ink-900">{m.name}</p>
                  <p className="mt-0.5 font-mono text-2xs text-ink-400">
                    {m.projectCode} · {m.supplier}
                  </p>
                </div>
                <StatusBadge label={m.state} />
              </div>
              <div className="mt-2 flex items-end justify-between gap-2">
                <p className="font-mono text-2xs text-ink-500">
                  <span className="text-sm font-semibold text-ink-900">{formatNumber(m.inStock)}</span>{' '}
                  {m.unit} in stock · reorder at {formatNumber(m.reorderLevel)}
                </p>
                <p
                  className={`font-mono text-2xs font-semibold ${
                  m.state === 'Critical' ? 'text-signal-red' : 'text-signal-amber'}`
                  }>
                  
                  {daysLeft} days cover
                </p>
              </div>
            </li>);

        })}
      </ul>
      <Link
        to="/materials"
        className="mt-auto flex items-center justify-center border-t border-ink-100 px-4 py-2.5 text-xs font-medium text-ink-600 transition-colors duration-150 hover:bg-ink-50 hover:text-ink-900">
        
        Open material register
      </Link>
    </Panel>);

}
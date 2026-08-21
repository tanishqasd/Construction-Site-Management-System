import React from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip } from
'recharts';
import { Panel, PanelHeader } from '../ui/Panel';
import { progressCurve } from '../../data/projects';

const stats = [
{ label: 'Actual progress', value: '55%', tone: 'text-ink-900' },
{ label: 'Planned', value: '58%', tone: 'text-ink-600' },
{ label: 'Variance', value: '−3.1%', tone: 'text-signal-red' },
{ label: 'Value certified', value: '₹246 Cr', tone: 'text-ink-900' }];


export function ProgressOverview() {
  return (
    <Panel>
      <PanelHeader
        title="Portfolio progress — planned vs actual"
        subtitle="Weighted across 5 active projects · Feb – Aug 2026"
        action={
        <div className="flex items-center gap-3 text-2xs text-ink-500">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-sm bg-safety-400" aria-hidden /> Actual
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-0 w-3 border-t border-dashed border-ink-500" aria-hidden /> Planned
            </span>
          </div>
        } />
      
      <div className="flex flex-col gap-4 p-4 xl:flex-row">
        <dl className="grid grid-cols-2 gap-x-6 gap-y-3 xl:w-44 xl:shrink-0 xl:grid-cols-1 xl:gap-y-4">
          {stats.map((s) =>
          <div key={s.label}>
              <dt className="font-mono text-2xs uppercase tracking-wider text-ink-400">{s.label}</dt>
              <dd className={`mt-0.5 font-mono text-xl font-semibold tracking-tight ${s.tone}`}>
                {s.value}
              </dd>
            </div>
          )}
          <div className="col-span-2 rounded-md border border-safety-200 bg-safety-50 p-2.5 xl:col-span-1">
            <p className="text-2xs leading-snug text-safety-700">
              Slippage driven by <span className="font-semibold">Aurum Residency</span> finishing works
              and pier cap holds at Ring Road.
            </p>
          </div>
        </dl>

        <div className="h-56 min-w-0 flex-1">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={progressCurve} margin={{ top: 8, right: 8, bottom: 0, left: -18 }}>
              <CartesianGrid stroke="#e8eaec" vertical={false} />
              <XAxis
                dataKey="month"
                tick={{ fill: '#828c96', fontSize: 11 }}
                tickLine={false}
                axisLine={{ stroke: '#d3d7db' }} />
              
              <YAxis
                tick={{ fill: '#828c96', fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v: number) => `${v}%`}
                domain={[0, 70]} />
              
              <Tooltip
                contentStyle={{
                  borderRadius: 6,
                  border: '1px solid #d3d7db',
                  fontSize: 12,
                  boxShadow: '0 12px 32px -8px rgba(15,19,23,0.18)'
                }}
                formatter={(value: number, name: string) => [`${value}%`, name === 'actual' ? 'Actual' : 'Planned']}
                labelStyle={{ fontWeight: 600, color: '#181d22' }} />
              
              <Area
                type="monotone"
                dataKey="actual"
                stroke="#d4830b"
                strokeWidth={2}
                fill="#ec9e1f"
                fillOpacity={0.12}
                dot={{ r: 2.5, fill: '#d4830b', strokeWidth: 0 }}
                activeDot={{ r: 4 }} />
              
              <Line
                type="monotone"
                dataKey="planned"
                stroke="#616c77"
                strokeWidth={1.5}
                strokeDasharray="4 3"
                dot={false} />
              
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Panel>);

}
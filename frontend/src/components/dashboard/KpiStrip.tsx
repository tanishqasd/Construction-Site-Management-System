import React from "react";
import { Link } from "react-router-dom";
import { Building2Icon, ListChecksIcon, PackageIcon, TriangleAlertIcon, ArrowUpRightIcon, BoxIcon } from "lucide-react";
import { twMerge } from "tailwind-merge";
interface Kpi {
  label: string;
  value: string;
  unit?: string;
  detail: string;
  to: string;
  icon: BoxIcon;
  accent: string;
  detailTone: string;
}
const kpis: Kpi[] = [{
  label: 'Active projects',
  value: '5',
  detail: '841 workers on site today',
  to: '/projects',
  icon: Building2Icon,
  accent: 'text-steel-600',
  detailTone: 'text-ink-500'
}, {
  label: 'Pending tasks',
  value: '11',
  detail: '5 overdue · 3 critical',
  to: '/tasks',
  icon: ListChecksIcon,
  accent: 'text-signal-blue',
  detailTone: 'text-signal-amber'
}, {
  label: 'Material alerts',
  value: '5',
  detail: '3 below one day of stock',
  to: '/materials',
  icon: PackageIcon,
  accent: 'text-safety-500',
  detailTone: 'text-signal-red'
}, {
  label: 'Open site issues',
  value: '7',
  detail: '4 blockers · avg age 7 days',
  to: '/issues',
  icon: TriangleAlertIcon,
  accent: 'text-signal-red',
  detailTone: 'text-signal-red'
}];
export function KpiStrip() {
  return <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
      {kpis.map((kpi) => <Link key={kpi.label} to={kpi.to} className="group flex items-center gap-3 rounded-lg border border-ink-200 bg-white px-4 py-3 shadow-panel transition-colors duration-150 hover:border-ink-300">
          <kpi.icon className={twMerge('h-5 w-5 shrink-0', kpi.accent)} aria-hidden />
          <div className="min-w-0 flex-1">
            <div className="flex items-baseline gap-1.5">
              <span className="font-mono text-2xl font-semibold leading-none tracking-tight text-ink-900">
                {kpi.value}
              </span>
              <span className="truncate text-xs font-medium text-ink-600">{kpi.label}</span>
            </div>
            <p className={twMerge('mt-1 truncate text-2xs', kpi.detailTone)}>{kpi.detail}</p>
          </div>
          <ArrowUpRightIcon className="h-3.5 w-3.5 shrink-0 text-ink-300 transition-colors duration-150 group-hover:text-ink-600" aria-hidden />
        </Link>)}
    </div>;
}
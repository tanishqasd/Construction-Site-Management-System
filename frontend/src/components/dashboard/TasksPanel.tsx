import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ClockIcon, CircleDotIcon } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import { Panel, PanelHeader } from '../ui/Panel';
import { StatusBadge } from '../ui/StatusBadge';
import { tasks } from '../../data/tasks';
import { formatDate } from '../../utils/format';

type Tab = 'overdue' | 'pending';

export function TasksPanel() {
  const [tab, setTab] = useState<Tab>('overdue');
  const overdue = tasks.filter((t) => t.overdueDays > 0);
  const pending = tasks.filter((t) => t.overdueDays === 0 && t.status !== 'Completed');
  const rows = (tab === 'overdue' ? overdue : pending).slice(0, 5);

  return (
    <Panel className="h-full">
      <PanelHeader
        title="Tasks needing action"
        subtitle="Assigned across site engineering teams"
        action={
        <div className="flex rounded-md border border-ink-200 p-0.5" role="tablist" aria-label="Task filter">
            {(
          [
          ['overdue', `Overdue ${overdue.length}`],
          ['pending', `Upcoming ${pending.length}`]] as
          const).
          map(([key, label]) =>
          <button
            key={key}
            role="tab"
            aria-selected={tab === key}
            type="button"
            onClick={() => setTab(key)}
            className={twMerge(
              'rounded px-2 py-1 text-2xs font-semibold transition-colors duration-150',
              tab === key ? 'bg-ink-900 text-white' : 'text-ink-500 hover:text-ink-900'
            )}>
            
                {label}
              </button>
          )}
          </div>
        } />
      
      <ul className="divide-y divide-ink-100">
        {rows.map((task) =>
        <li key={task.id} className="px-4 py-3 transition-colors duration-150 hover:bg-ink-50/60">
            <div className="flex items-start gap-2.5">
              <CircleDotIcon
              className={twMerge(
                'mt-0.5 h-3.5 w-3.5 shrink-0',
                task.status === 'Blocked' ? 'text-signal-red' : 'text-ink-300'
              )}
              aria-hidden />
            
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold text-ink-900">{task.title}</p>
                <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-2xs text-ink-500">
                  <span className="font-mono text-ink-400">
                    {task.projectCode} · WBS {task.wbs}
                  </span>
                  <span>{task.assignee}</span>
                </p>
              </div>
              <div className="shrink-0 text-right">
                <div className="flex items-center justify-end gap-1.5">
                  <StatusBadge label={task.priority} />
                  <StatusBadge label={task.status} />
                </div>
                <p
                className={twMerge(
                  'mt-1.5 flex items-center justify-end gap-1 font-mono text-2xs',
                  task.overdueDays > 0 ? 'font-semibold text-signal-red' : 'text-ink-500'
                )}>
                
                  <ClockIcon className="h-3 w-3" aria-hidden />
                  {task.overdueDays > 0 ?
                `${task.overdueDays}d overdue` :
                `Due ${formatDate(task.dueDate)}`}
                </p>
              </div>
            </div>
          </li>
        )}
      </ul>
      <Link
        to="/tasks"
        className="mt-auto flex items-center justify-center gap-1.5 border-t border-ink-100 px-4 py-2.5 text-xs font-medium text-ink-600 transition-colors duration-150 hover:bg-ink-50 hover:text-ink-900">
        
        Go to task board
      </Link>
    </Panel>);

}
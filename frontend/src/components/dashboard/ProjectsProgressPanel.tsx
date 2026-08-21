import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightIcon, MapPinIcon, UsersIcon } from 'lucide-react';
import { Panel, PanelHeader } from '../ui/Panel';
import { ProgressBar } from '../ui/ProgressBar';
import { StatusBadge } from '../ui/StatusBadge';
import { Button } from '../ui/Button';
import { activeProjects } from '../../data/projects';
import { formatCurrency, percent } from '../../utils/format';

export function ProjectsProgressPanel() {
  return (
    <Panel>
      <PanelHeader
        title="Active projects"
        subtitle="Physical progress against baseline programme"
        action={
        <Link to="/projects">
            <Button variant="secondary" size="sm">
              All projects
              <ArrowRightIcon className="h-3.5 w-3.5" aria-hidden />
            </Button>
          </Link>
        } />
      
      <ul className="divide-y divide-ink-100">
        {activeProjects.map((project) => {
          const variance = project.progress - project.plannedProgress;
          const budgetUsed = project.spent / project.budget * 100;
          return (
            <li key={project.id} className="px-4 py-3.5 transition-colors duration-150 hover:bg-ink-50/60">
              <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-2xs text-ink-400">{project.code}</span>
                    <StatusBadge label={project.status} />
                  </div>
                  <h3 className="mt-1 truncate text-sm font-semibold text-ink-900">{project.name}</h3>
                  <p className="mt-0.5 flex items-center gap-3 text-2xs text-ink-500">
                    <span className="flex items-center gap-1">
                      <MapPinIcon className="h-3 w-3" aria-hidden />
                      {project.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <UsersIcon className="h-3 w-3" aria-hidden />
                      {project.workforce} on site
                    </span>
                  </p>
                </div>
                <div className="grid w-full shrink-0 grid-cols-3 gap-x-5 sm:w-auto sm:min-w-[300px]">
                  <div>
                    <p className="font-mono text-2xs uppercase tracking-wider text-ink-400">Progress</p>
                    <p className="font-mono text-sm font-semibold text-ink-900">
                      {percent(project.progress)}
                    </p>
                  </div>
                  <div>
                    <p className="font-mono text-2xs uppercase tracking-wider text-ink-400">Variance</p>
                    <p
                      className={`font-mono text-sm font-semibold ${
                      variance < -4 ?
                      'text-signal-red' :
                      variance < 0 ?
                      'text-signal-amber' :
                      'text-signal-green'}`
                      }>
                      
                      {variance > 0 ? '+' : '−'}
                      {Math.abs(variance)}%
                    </p>
                  </div>
                  <div>
                    <p className="font-mono text-2xs uppercase tracking-wider text-ink-400">Cost used</p>
                    <p className="font-mono text-sm font-semibold text-ink-900">
                      {Math.round(budgetUsed)}%
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-2.5 flex items-center gap-3">
                <ProgressBar
                  value={project.progress}
                  planned={project.plannedProgress}
                  tone={variance < -4 ? 'red' : 'safety'}
                  label={`${project.name} progress`}
                  className="flex-1" />
                
                <span className="w-40 shrink-0 truncate text-right text-2xs text-ink-500">
                  {project.phase}
                </span>
                <span className="hidden w-24 shrink-0 text-right font-mono text-2xs text-ink-500 md:block">
                  {formatCurrency(project.spent)}
                </span>
              </div>
            </li>);

        })}
      </ul>
    </Panel>);

}
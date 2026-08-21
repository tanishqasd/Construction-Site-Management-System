import React from 'react';
import { SearchIcon, SlidersHorizontalIcon } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import { Button } from './Button';

interface FilterBarProps {
  searchPlaceholder: string;
  filters: string[];
  active: string;
  onChange: (value: string) => void;
  query: string;
  onQueryChange: (value: string) => void;
  trailing?: React.ReactNode;
}

export function FilterBar({
  searchPlaceholder,
  filters,
  active,
  onChange,
  query,
  onQueryChange,
  trailing
}: FilterBarProps) {
  return (
    <div className="mb-4 flex flex-wrap items-center gap-2 rounded-lg border border-ink-200 bg-white px-3 py-2.5 shadow-panel">
      <div className="relative min-w-[220px] flex-1">
        <SearchIcon
          className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink-400"
          aria-hidden />
        
        <input
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder={searchPlaceholder}
          aria-label={searchPlaceholder}
          className="h-8 w-full rounded-md border border-ink-200 bg-ink-50/60 pl-8 pr-3 text-xs text-ink-800 placeholder:text-ink-400 focus:border-ink-300 focus:bg-white focus:outline-none" />
        
      </div>
      <div className="flex flex-wrap items-center gap-1" role="group" aria-label="Filters">
        {filters.map((f) =>
        <button
          key={f}
          type="button"
          onClick={() => onChange(f)}
          aria-pressed={active === f}
          className={twMerge(
            'rounded-md border px-2.5 py-1.5 text-2xs font-semibold transition-colors duration-150',
            active === f ?
            'border-ink-900 bg-ink-900 text-white' :
            'border-ink-200 bg-white text-ink-600 hover:bg-ink-50 hover:text-ink-900'
          )}>
          
            {f}
          </button>
        )}
      </div>
      {trailing ??
      <Button variant="secondary" size="sm">
          <SlidersHorizontalIcon className="h-3.5 w-3.5" aria-hidden />
          More filters
        </Button>
      }
    </div>);

}
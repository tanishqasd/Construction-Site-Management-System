import { NavLink } from 'react-router-dom';
import { XIcon, HardHatIcon, LifeBuoyIcon } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import { primaryNav, secondaryNav, type NavItem } from '../../data/nav';
import { useAuth } from '../../context/AuthContext';

const badgeTones: Record<string, string> = {
  critical: 'bg-signal-red text-white',
  warning: 'bg-safety-400 text-ink-900',
  neutral: 'bg-ink-700 text-ink-200',
};

// Explicit Role-Permission Route Matrix
const rolePermissions: Record<string, string[]> = {
  owner: ['/', '/projects', '/labour', '/materials', '/expenses', '/tasks', '/issues', '/settings'],
  admin: ['/', '/projects', '/labour', '/materials', '/expenses', '/tasks', '/issues', '/settings'],
  hr: ['/', '/projects', '/labour', '/materials', '/tasks', '/issues', '/settings'],
  manager: ['/', '/projects', '/labour', '/materials', '/tasks', '/issues', '/settings'],
  site_manager: ['/', '/projects', '/labour', '/materials', '/tasks', '/issues', '/settings'],
  worker: ['/', '/tasks', '/settings'],
  labour: ['/', '/tasks', '/settings'],
};

function SidebarLink({ item, onNavigate }: { item: NavItem; onNavigate?: () => void }) {
  const Icon = item.icon;
  return (
    <NavLink
      to={item.to}
      end={item.to === '/'}
      onClick={onNavigate}
      className={({ isActive }) =>
        twMerge(
          'group relative flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm font-medium transition-colors duration-150',
          isActive ? 'bg-ink-800 text-white' : 'text-ink-300 hover:bg-ink-800/60 hover:text-white'
        )
      }
    >
      {({ isActive }) => (
        <>
          <span
            className={twMerge(
              'absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-safety-400 transition-opacity duration-150',
              isActive ? 'opacity-100' : 'opacity-0'
            )}
            aria-hidden
          />

          <Icon
            className={twMerge(
              'h-4 w-4 shrink-0',
              isActive ? 'text-safety-400' : 'text-ink-400 group-hover:text-ink-200'
            )}
            aria-hidden
          />

          <span className="flex-1 truncate font-sans">{item.label}</span>
          {item.badge && (
            <span
              className={twMerge(
                'rounded px-1.5 py-0.5 font-mono text-2xs font-semibold leading-none',
                badgeTones[item.badgeTone ?? 'neutral']
              )}
            >
              {item.badge}
            </span>
          )}
        </>
      )}
    </NavLink>
  );
}

export function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { user } = useAuth();
  const currentRole = (user?.role || 'owner').toLowerCase();
  const allowedRoutes = rolePermissions[currentRole] || rolePermissions.owner;

  // Filter navigation collections based on user permissions
  const filteredPrimary = primaryNav.filter((item) => allowedRoutes.includes(item.to));
  const filteredSecondary = secondaryNav.filter((item) => allowedRoutes.includes(item.to));

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-30 bg-ink-950/50 lg:hidden"
          onClick={onClose}
          aria-hidden
        />
      )}
      <aside
        className={twMerge(
          'fixed inset-y-0 left-0 z-40 flex w-60 shrink-0 flex-col border-r border-ink-800 bg-ink-900 transition-transform duration-200 ease-out lg:static lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
        aria-label="Primary navigation"
      >
        <div className="flex items-center gap-2.5 px-4 pb-3 pt-4">
          <span className="flex h-8 w-8 items-center justify-center rounded bg-safety-400">
            <HardHatIcon className="h-4.5 w-4.5 text-ink-900" strokeWidth={2.2} aria-hidden />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate font-display text-sm font-bold tracking-tight leading-tight text-white">
              Maple Construction
            </p>
            <p className="font-mono text-2xs uppercase tracking-wider text-ink-400">
              {currentRole} Ops Suite
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded p-1 text-ink-400 transition-colors duration-150 hover:bg-ink-800 hover:text-white lg:hidden"
            aria-label="Close navigation"
          >
            <XIcon className="h-4 w-4" />
          </button>
        </div>
        <div className="hazard-rule mx-4 h-1 rounded-sm opacity-70" aria-hidden />

        <nav className="mt-4 flex-1 space-y-0.5 overflow-y-auto px-3">
          {filteredPrimary.length > 0 && (
            <>
              <p className="px-2.5 pb-1.5 font-mono text-2xs uppercase tracking-widest text-ink-500">
                Operations
              </p>
              {filteredPrimary.map((item) => (
                <SidebarLink key={item.to} item={item} onNavigate={onClose} />
              ))}
            </>
          )}

          {filteredSecondary.length > 0 && (
            <>
              <p className="px-2.5 pb-1.5 pt-4 font-mono text-2xs uppercase tracking-widest text-ink-500">
                Workspace
              </p>
              {filteredSecondary.map((item) => (
                <SidebarLink key={item.to} item={item} onNavigate={onClose} />
              ))}
            </>
          )}
        </nav>

        <div className="border-t border-ink-800 p-3">
          <div className="rounded-md bg-ink-800/70 p-3">
            <p className="font-mono text-2xs uppercase tracking-wider text-ink-400">
              {currentRole === 'worker' ? 'My Deployment' : 'Today on site'}
            </p>
            <p className="mt-1 text-sm text-ink-100">
              {currentRole === 'worker' ? (
                <>
                  <span className="font-semibold text-white">Maple Tower Alpha</span> · Shift Active
                </>
              ) : (
                <>
                  <span className="font-mono font-semibold text-white">841</span> workers ·{' '}
                  <span className="font-mono font-semibold text-white">5</span> active sites
                </>
              )}
            </p>
            <p className="mt-1 text-2xs text-ink-400">
              {currentRole === 'worker' ? 'Shift Concludes: 17:00 IST' : 'DPR cut-off 7:00 PM IST'}
            </p>
          </div>
          <a
            href="#support"
            className="mt-2 flex items-center gap-2 rounded-md px-2.5 py-2 text-xs font-medium text-ink-400 transition-colors duration-150 hover:bg-ink-800 hover:text-white"
          >
            <LifeBuoyIcon className="h-3.5 w-3.5" aria-hidden />
            Help & support
          </a>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
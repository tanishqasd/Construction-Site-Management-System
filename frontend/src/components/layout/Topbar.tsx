import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Menu as MenuIcon,
  Search as SearchIcon,
  Bell as BellIcon,
  ChevronDown as ChevronDownIcon,
  Plus as PlusIcon,
  AlertTriangle as TriangleAlertIcon,
  Package as PackageIcon,
  ListChecks as ListChecksIcon,
  LogOut as LogOutIcon,
} from 'lucide-react';
import { Button } from '../ui/Button';
import { useAuth } from '../../context/AuthContext';

const notifications = [
  {
    id: 'n1',
    icon: TriangleAlertIcon,
    tone: 'text-signal-red',
    title: 'ISS-1194 raised as blocker',
    detail: 'Honeycombing at pier P12 · PRJ-2038',
    time: '41m',
  },
  {
    id: 'n2',
    icon: PackageIcon,
    tone: 'text-safety-500',
    title: 'TMT 16mm below reorder level',
    detail: '4.2 MT remaining · PRJ-2041',
    time: '2h',
  },
  {
    id: 'n3',
    icon: ListChecksIcon,
    tone: 'text-signal-blue',
    title: 'Cube test task overdue by 5 days',
    detail: 'Batch B-2214 · PRJ-2041',
    time: '5h',
  },
];

export function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  const [openPanel, setOpenPanel] = useState<'bell' | 'user' | null>(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const currentRole = (user?.role || 'owner').toLowerCase();
  const isWorker = currentRole === 'worker' || currentRole === 'labour';

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'AD';

  return (
    <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-ink-200 bg-white/95 px-4 backdrop-blur lg:px-6">
      <button
        type="button"
        onClick={onMenuClick}
        className="rounded-md p-1.5 text-ink-600 transition-colors duration-150 hover:bg-ink-100 lg:hidden"
        aria-label="Open navigation"
      >
        <MenuIcon className="h-5 w-5" />
      </button>

      <div className="relative min-w-0 flex-1 max-w-xl">
        <SearchIcon
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400"
          aria-hidden
        />
        <input
          type="search"
          placeholder="Search projects, tasks, drawings, vouchers…"
          aria-label="Global search"
          className="h-9 w-full rounded-md border border-ink-200 bg-ink-50/60 pl-9 pr-16 text-sm text-ink-800 placeholder:text-ink-400 transition-colors duration-150 focus:border-ink-300 focus:bg-white focus:outline-none"
        />
        <kbd className="pointer-events-none absolute right-2.5 top-1/2 hidden -translate-y-1/2 rounded border border-ink-200 bg-white px-1.5 py-0.5 font-mono text-2xs text-ink-400 md:block">
          ⌘K
        </kbd>
      </div>

      <div className="ml-auto flex items-center gap-2">
        {/* Only render "Log daily report" for Owners & Managers; hidden for Field Workers */}
        {!isWorker && (
          <Button
            variant="primary"
            size="sm"
            className="hidden sm:inline-flex"
            onClick={() => navigate('/labour')}
          >
            <PlusIcon className="h-3.5 w-3.5" aria-hidden />
            Log daily report
          </Button>
        )}

        {/* Notifications Popover */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setOpenPanel(openPanel === 'bell' ? null : 'bell')}
            className="relative rounded-md p-2 text-ink-600 transition-colors duration-150 hover:bg-ink-100 hover:text-ink-900"
            aria-label="Notifications"
            aria-expanded={openPanel === 'bell'}
          >
            <BellIcon className="h-4.5 w-4.5" />
            <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-signal-red px-1 font-mono text-[10px] font-semibold leading-none text-white">
              3
            </span>
          </button>
          {openPanel === 'bell' && (
            <div className="absolute right-0 top-11 w-80 overflow-hidden rounded-lg border border-ink-200 bg-white shadow-pop">
              <div className="flex items-center justify-between border-b border-ink-100 px-3 py-2.5">
                <p className="text-sm font-semibold text-ink-900">Notifications</p>
                <span className="font-mono text-2xs text-ink-400">3 unread</span>
              </div>
              <ul>
                {notifications.map((n) => (
                  <li key={n.id} className="border-b border-ink-100 last:border-0">
                    <button
                      type="button"
                      className="flex w-full items-start gap-2.5 px-3 py-2.5 text-left transition-colors duration-150 hover:bg-ink-50"
                    >
                      <n.icon className={`mt-0.5 h-4 w-4 shrink-0 ${n.tone}`} aria-hidden />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-xs font-medium text-ink-900">{n.title}</span>
                        <span className="block truncate text-2xs text-ink-500">{n.detail}</span>
                      </span>
                      <span className="font-mono text-2xs text-ink-400">{n.time}</span>
                    </button>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={() => {
                  setOpenPanel(null);
                  navigate('/issues');
                }}
                className="block w-full border-t border-ink-100 px-3 py-2.5 text-center text-xs font-medium text-ink-600 hover:bg-ink-50 hover:text-ink-900"
              >
                View all notifications
              </button>
            </div>
          )}
        </div>

        {/* User Menu */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setOpenPanel(openPanel === 'user' ? null : 'user')}
            className="flex items-center gap-2 rounded-md py-1 pl-1 pr-1.5 transition-colors duration-150 hover:bg-ink-100"
            aria-label="User menu"
            aria-expanded={openPanel === 'user'}
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-steel-600 font-mono text-xs font-semibold text-white">
              {initials}
            </span>
            <span className="hidden text-left md:block">
              <span className="block text-xs font-semibold leading-tight text-ink-900">
                {user?.name || 'Administrator'}
              </span>
              <span className="block text-2xs leading-tight text-ink-500 capitalize font-mono">
                {currentRole} Access
              </span>
            </span>
            <ChevronDownIcon className="hidden h-3.5 w-3.5 text-ink-400 md:block" aria-hidden />
          </button>

          {openPanel === 'user' && (
            <div className="absolute right-0 top-12 w-60 overflow-hidden rounded-lg border border-ink-200 bg-white shadow-pop">
              <div className="border-b border-ink-100 px-3 py-2.5">
                <p className="text-sm font-semibold text-ink-900">{user?.name || 'Administrator'}</p>
                <p className="text-2xs text-ink-500 truncate">{user?.email}</p>
                <span className="mt-1 inline-block rounded bg-ink-100 px-1.5 py-0.5 text-3xs font-semibold uppercase tracking-wider text-ink-700">
                  Role: {currentRole}
                </span>
              </div>

              <ul className="py-1 text-xs text-ink-700">
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      setOpenPanel(null);
                      navigate('/settings');
                    }}
                    className="w-full px-3 py-2 text-left transition-colors duration-150 hover:bg-ink-50 hover:text-ink-900"
                  >
                    Account settings
                  </button>
                </li>
                <li className="border-t border-ink-100 mt-1 pt-1">
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 px-3 py-2 text-left text-signal-red transition-colors duration-150 hover:bg-signal-redSoft"
                  >
                    <LogOutIcon className="h-3.5 w-3.5" />
                    Sign out
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Topbar;
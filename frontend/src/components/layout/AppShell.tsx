import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

export function AppShell() {
  const [navOpen, setNavOpen] = useState(false);

  return (
    <div className="flex min-h-full w-full bg-canvas">
      <Sidebar open={navOpen} onClose={() => setNavOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onMenuClick={() => setNavOpen(true)} />
        <main className="flex-1 px-4 py-5 lg:px-6 lg:py-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
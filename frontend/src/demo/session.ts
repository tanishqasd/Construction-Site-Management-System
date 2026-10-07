import type { User } from '../context/authSession';
import type { Role } from '../utils/permissions';

export const DEMO_ENABLED = import.meta.env.VITE_ENABLE_DEMO === 'true';
export const DEMO_SESSION_KEY = 'maple-demo-session-v3';
export const DEMO_DATA_KEY = 'maple-demo-data-v3';
export const demoPersonas: Record<Role, User> = {
  owner: { _id: 'demo-owner', name: 'Executive Director', email: 'owner@construction.com', role: 'owner', organizationId: 'demo-owner', assignedSites: ['site-1', 'site-2', 'site-3'] },
  hr: { _id: 'demo-hr', name: 'Site HR & Operations Lead', email: 'hr@construction.com', role: 'hr', organizationId: 'demo-owner', assignedSites: ['site-1', 'site-2'] },
  worker: { _id: 'demo-worker', name: 'Field Worker / Crew', email: 'worker@construction.com', role: 'worker', organizationId: 'demo-owner', assignedSites: ['site-1'] },
};
export function readDemoUser(): User | null {
  if (!DEMO_ENABLED) return null;
  try {
    const saved = JSON.parse(localStorage.getItem(DEMO_SESSION_KEY) || 'null');
    if (saved?.version !== 1 || !['owner', 'hr', 'worker'].includes(saved.role)) return null;
    const user = { ...demoPersonas[saved.role as Role] };
    const records = JSON.parse(localStorage.getItem(DEMO_DATA_KEY) || 'null');
    const profile = records?.version === 1 && Array.isArray(records.data?.team) ? records.data.team.find((entry: User) => entry._id === user._id) : null;
    if (typeof profile?.name === 'string' && profile.name.trim()) user.name = profile.name;
    return user;
  } catch { return null; }
}
export function beginDemo(role: Role): User {
  if (!DEMO_ENABLED || !demoPersonas[role]) throw new Error('Demo access is disabled.');
  try {
    localStorage.setItem(DEMO_SESSION_KEY, JSON.stringify({ version: 1, role }));
    localStorage.removeItem('token'); localStorage.removeItem('user');
  } catch { throw new Error('Enable browser storage to open the demo workspace.'); }
  return readDemoUser() || { ...demoPersonas[role] };
}
export function endDemo() { try { localStorage.removeItem(DEMO_SESSION_KEY); } catch { /* cleared in memory by AuthProvider */ } }
// Sample personas are public exploration, never client authentication.
export function demoRoleForEmail(email: string): Role | null {
  if (!DEMO_ENABLED) return null;
  const normalized = email.trim().toLowerCase();
  if (normalized === 'admin@example.com') return 'owner';
  return (Object.keys(demoPersonas) as Role[]).find((role) => demoPersonas[role].email === normalized) || null;
}

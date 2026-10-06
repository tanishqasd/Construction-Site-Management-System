export type Role = 'owner' | 'hr' | 'worker';
export const normalizeRole = (role: string = ''): Role => ['owner','admin'].includes(role) ? 'owner' : ['hr','manager','site_manager','supervisor'].includes(role) ? 'hr' : 'worker';
export const roleLabels: Record<Role, string> = { owner: 'Owner & Director', hr: 'Site HR & Manager', worker: 'Field Worker' };
export const roleModules: Record<Role, string[]> = {
  owner: ['/', '/projects', '/workers', '/contractors', '/labour', '/tasks', '/materials', '/expenses', '/wages', '/issues', '/reports', '/documents', '/team', '/settings'],
  hr: ['/', '/projects', '/workers', '/contractors', '/labour', '/tasks', '/materials', '/wages', '/issues', '/reports', '/documents', '/settings'],
  worker: ['/', '/tasks', '/my-attendance', '/wages', '/issues', '/reports', '/documents', '/settings'],
};
export const canManage = (role: Role, resource: string) => role === 'owner' || (role === 'hr' && !['expenses','team'].includes(resource));

const roles = { owner: 'owner', admin: 'owner', hr: 'hr', manager: 'hr', site_manager: 'hr', supervisor: 'hr', worker: 'worker', labour: 'worker' };
const roleOf = (user) => roles[user.role] || 'worker';
const orgOf = (user) => user.organizationId || user.id || user._id;
const orgFilter = (user, legacyField = 'createdBy') => ({ $or: [
  { organizationId: orgOf(user) },
  { organizationId: { $exists: false }, [legacyField]: orgOf(user) },
] });
const allowed = (user, resource, action) => {
  const role = roleOf(user);
  if (role === 'owner') return true;
  if (resource === 'expenses' || resource === 'team') return false;
  if (role === 'hr') return !(resource === 'sites' && ['create', 'delete'].includes(action));
  if (action === 'read') return ['sites', 'tasks', 'issues', 'attendance', 'workers', 'reports', 'documents', 'wages'].includes(resource);
  return (resource === 'tasks' && action === 'update') || (resource === 'issues' && action === 'create') || (resource === 'reports' && action === 'create');
};
module.exports = { roleOf, orgOf, orgFilter, allowed };

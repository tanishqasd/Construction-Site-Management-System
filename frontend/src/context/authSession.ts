export interface User {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  role: string;
  organizationId?: string;
  assignedSites?: string[];
  mustChangePassword?: boolean;
}

export interface AuthSession {
  token: string | null;
  user: User | null;
}

export function isValidSession(token: unknown, user: unknown): user is User {
  if (typeof token !== 'string' || !user || typeof user !== 'object') return false;
  const candidate = user as Partial<User>;
  if (typeof (candidate._id || candidate.id) !== 'string' ||
      !['name', 'email', 'role'].every((key) => typeof candidate[key as keyof User] === 'string' && candidate[key as keyof User])) return false;
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
    // The API verifies signatures and permissions; this only checks expiry.
    return typeof payload.exp === 'number' && payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
}

export function readAuthSession(): AuthSession {
  try {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (isValidSession(token, user)) return { token, user };
  } catch {
    // Malformed or unavailable storage must not crash protected routes.
  }
  try {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  } catch {
    // Storage may be disabled by the browser.
  }
  return { token: null, user: null };
}

import { resolveApiUrl } from './apiUrl';
const BASE_URL = resolveApiUrl(import.meta.env.VITE_API_URL, import.meta.env.PROD);
export class ApiError extends Error {
  constructor(message: string, public status: number, public code?: string) { super(message); this.name = 'ApiError'; }
}
export const apiRequest = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
  let token: string | null = null;
  try { token = localStorage.getItem('token'); } catch { /* unauthenticated requests still work */ }
  const isAuthRequest = ['/auth/login', '/auth/register', '/auth/config'].includes(endpoint);
  const headers = new Headers(options.headers);
  if (options.body && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json');
  if (token && !isAuthRequest) headers.set('Authorization', `Bearer ${token}`);
  const controller = new AbortController(); const timeout = setTimeout(() => controller.abort(), 30000);
  const cancel = () => controller.abort(); options.signal?.addEventListener('abort', cancel, { once: true });
  if (options.signal?.aborted) controller.abort();
  try {
    let response: Response;
    try { response = await fetch(`${BASE_URL}/${endpoint.replace(/^\/+/, '')}`, { ...options, headers, signal: controller.signal }); }
    catch {
      throw new ApiError(controller.signal.aborted ? 'The request timed out or was cancelled. Please try again.' : 'Unable to reach the server. Check your connection and try again; the server may be starting.', 0);
    }
    if (response.status === 401 && token && !isAuthRequest) {
      try { localStorage.removeItem('token'); localStorage.removeItem('user'); } catch { /* server already rejected the session */ }
      if (window.location.pathname !== '/login') window.location.href = '/login';
    }
    const body = await response.text(); let data: unknown;
    try { data = body ? JSON.parse(body) : undefined; }
    catch { throw new ApiError(`The server returned an unexpected response (HTTP ${response.status}). Please try again.`, response.status); }
    if (!response.ok) {
      const failure = data && typeof data === 'object' ? data as { message?: string; code?: string } : {};
      throw new ApiError(typeof failure.message === 'string' ? failure.message : `Request failed (HTTP ${response.status}).`, response.status, failure.code);
    }
    return data as T;
  } finally { clearTimeout(timeout); options.signal?.removeEventListener('abort', cancel); }
};

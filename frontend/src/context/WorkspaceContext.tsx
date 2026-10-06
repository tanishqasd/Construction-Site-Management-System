/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { apiRequest } from '../services/api';
import { normalizeRole, type Role } from '../utils/permissions';
import { emptyWorkspace, refId, type WorkspaceData, type Resource, type Relation } from '../types/workspace';
interface WorkspaceContextType {
  data: WorkspaceData; loading: boolean; error: string | null; role: Role;
  refresh: () => Promise<void>;
  save: (resource: Resource, payload: Record<string, unknown>, recordId?: string) => Promise<void>;
  remove: (resource: Resource, recordId: string) => Promise<void>;
  siteName: (relation: Relation | undefined) => string;
  workerName: (relation: Relation | undefined) => string;
}
const Context = createContext<WorkspaceContextType | undefined>(undefined);
export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  const role = normalizeRole(user?.role);
  const [data, setData] = useState(emptyWorkspace);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const generation = useRef(0);
  const refresh = useCallback(async () => {
    const request = ++generation.current;
    if (!user || !isAuthenticated || user.mustChangePassword) { setData(emptyWorkspace()); setLoading(false); setError(null); return; }
    setLoading(true); setError(null);
    try {
      const records = await apiRequest<WorkspaceData>('/workspace');
      if (!records || !Object.keys(emptyWorkspace()).every((key) => Array.isArray(records[key as Resource]))) throw new Error('The server returned an incomplete workspace. Please try again.');
      if (request === generation.current) setData(records);
    } catch (err) {
      if (request === generation.current) { setData(emptyWorkspace()); setError(err instanceof Error ? err.message : 'Could not load your workspace.'); }
    } finally { if (request === generation.current) setLoading(false); }
  }, [user, isAuthenticated]);
  useEffect(() => { setData(emptyWorkspace()); void refresh(); return () => { generation.current++; }; }, [refresh]);
  const save = async (resource: Resource, payload: Record<string, unknown>, recordId?: string) => {
    if (!isAuthenticated) throw new Error('Please sign in.');
    await apiRequest(`/${resource}${recordId ? `/${recordId}` : ''}`, { method: recordId ? 'PUT' : 'POST', body: JSON.stringify(payload) });
    await refresh();
  };
  const remove = async (resource: Resource, recordId: string) => {
    if (!isAuthenticated) throw new Error('Please sign in.');
    await apiRequest(`/${resource}/${recordId}`, { method: 'DELETE' }); await refresh();
  };
  const siteName = (relation: Relation | undefined) => data.sites.find((site) => site._id === refId(relation))?.siteName || (typeof relation === 'object' && relation?.siteName) || 'Unassigned';
  const workerName = (relation: Relation | undefined) => data.workers.find((worker) => worker._id === refId(relation))?.fullName || (typeof relation === 'object' && relation?.fullName) || 'Unassigned';
  return <Context.Provider value={{ data, loading, error, role, refresh, save, remove, siteName, workerName }}>{children}</Context.Provider>;
}
export function useWorkspace() { const context = useContext(Context); if (!context) throw new Error('WorkspaceProvider is required'); return context; }

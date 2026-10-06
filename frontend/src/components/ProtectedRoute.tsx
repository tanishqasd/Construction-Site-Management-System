import { Navigate, useLocation } from 'react-router-dom';
import { Loader2, ShieldAlert } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading, error, isAuthenticated, verify, logout } = useAuth(); const location=useLocation();
  if (loading) return <div role="status" className="flex min-h-screen items-center justify-center gap-3 text-sm text-ink-500"><Loader2 size={20} className="animate-spin"/>Verifying your account…</div>;
  if (error) return <div className="flex min-h-screen items-center justify-center bg-ink-50 p-6"><section role="alert" className="workspace-card max-w-md p-7"><ShieldAlert className="mb-4 text-safety-600"/><h1 className="text-lg font-semibold">We couldn’t verify your account</h1><p className="my-4 text-sm leading-6 text-ink-500">{error}</p><div className="flex gap-3"><button className="primary-button" onClick={() => void verify()}>Try again</button><button className="secondary-button" onClick={logout}>Return to sign in</button></div></section></div>;
  if(isAuthenticated && user?.mustChangePassword && location.pathname!=='/settings')return <Navigate to="/settings" replace/>;
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace/>;
}

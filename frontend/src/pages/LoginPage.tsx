import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheckIcon, HardHatIcon, UsersIcon, LockIcon, MailIcon, UserIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { apiRequest } from '../services/api';
import { Button } from '../components/ui/Button';

export function LoginPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'owner' | 'hr' | 'worker'>('owner');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const endpoint = isRegister ? '/auth/register' : '/auth/login';
      const payload = isRegister ? { name, email, password, role } : { email, password };

      const data = await apiRequest<{
        token: string;
        user: { _id?: string; id?: string; name: string; email: string; role: string };
      }>(endpoint, {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      login(data.token, data.user);
      navigate('/');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Authentication failed. Please verify your credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas p-4">
      <div className="w-full max-w-md rounded-xl border border-ink-200 bg-white p-8 shadow-panel">
        <div className="text-center">
          <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-ink-900 text-safety-400 shadow-xs">
            <HardHatIcon className="h-6 w-6" strokeWidth={2.2} />
          </div>
          <h1 className="font-display text-xl font-bold tracking-tight text-ink-900">
            Maple Construction
          </h1>
          <p className="mt-1 font-sans text-xs text-ink-500">
            {isRegister
              ? 'Register an enterprise account with role permissions'
              : 'Sign in to access your role-specific dashboard'}
          </p>
        </div>

        {error && (
          <div className="mt-4 rounded-md bg-signal-redSoft p-2.5 text-xs text-signal-red">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4 font-sans">
          {isRegister && (
            <div>
              <label className="block text-2xs font-semibold uppercase tracking-wider text-ink-500">
                Full Name
              </label>
              <div className="relative mt-1">
                <UserIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Tanishqa Dayma"
                  className="w-full rounded-md border border-ink-200 bg-white pl-9 pr-3 py-2 text-xs text-ink-900 focus:border-ink-400 focus:outline-none"
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-2xs font-semibold uppercase tracking-wider text-ink-500">
              Email Address
            </label>
            <div className="relative mt-1">
              <MailIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@mapleconstruction.com"
                className="w-full rounded-md border border-ink-200 bg-white pl-9 pr-3 py-2 text-xs text-ink-900 focus:border-ink-400 focus:outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-2xs font-semibold uppercase tracking-wider text-ink-500">
              Password
            </label>
            <div className="relative mt-1">
              <LockIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-md border border-ink-200 bg-white pl-9 pr-3 py-2 text-xs text-ink-900 focus:border-ink-400 focus:outline-none"
                required
              />
            </div>
          </div>

          {/* Role Selection during Registration */}
          {isRegister && (
            <div>
              <label className="block text-2xs font-semibold uppercase tracking-wider text-ink-500 mb-1.5">
                Designated Access Role
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setRole('owner')}
                  className={`flex flex-col items-center justify-center rounded-lg border p-2.5 text-xs transition-colors ${
                    role === 'owner'
                      ? 'border-ink-900 bg-ink-900 text-white font-semibold'
                      : 'border-ink-200 bg-white text-ink-600 hover:bg-ink-50'
                  }`}
                >
                  <ShieldCheckIcon className="mb-1 h-4 w-4" />
                  Owner
                </button>
                <button
                  type="button"
                  onClick={() => setRole('hr')}
                  className={`flex flex-col items-center justify-center rounded-lg border p-2.5 text-xs transition-colors ${
                    role === 'hr'
                      ? 'border-ink-900 bg-ink-900 text-white font-semibold'
                      : 'border-ink-200 bg-white text-ink-600 hover:bg-ink-50'
                  }`}
                >
                  <UsersIcon className="mb-1 h-4 w-4" />
                  HR / PM
                </button>
                <button
                  type="button"
                  onClick={() => setRole('worker')}
                  className={`flex flex-col items-center justify-center rounded-lg border p-2.5 text-xs transition-colors ${
                    role === 'worker'
                      ? 'border-ink-900 bg-ink-900 text-white font-semibold'
                      : 'border-ink-200 bg-white text-ink-600 hover:bg-ink-50'
                  }`}
                >
                  <HardHatIcon className="mb-1 h-4 w-4" />
                  Worker
                </button>
              </div>
            </div>
          )}

          <Button
            variant="primary"
            size="md"
            type="submit"
            className="w-full justify-center font-medium"
            disabled={loading}
          >
            {loading ? 'Authenticating...' : isRegister ? 'Create Account & Sign In' : 'Sign In'}
          </Button>
        </form>

        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => {
              setIsRegister(!isRegister);
              setError(null);
            }}
            className="text-xs text-ink-600 underline hover:text-ink-900"
          >
            {isRegister ? 'Already registered? Sign In' : "Need an account? Register with designated role"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
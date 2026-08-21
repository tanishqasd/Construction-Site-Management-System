import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LoginPage } from './pages/LoginPage';
import { AppShell } from './components/layout/AppShell';
import { Dashboard } from './pages/Dashboard';
import { Projects } from './pages/Projects';
import { Tasks } from './pages/Tasks';
import { Materials } from './pages/Materials';
import Labour from './pages/Labour';
import { Expenses } from './pages/Expenses';
import { Issues } from './pages/Issues';
import { Reports } from './pages/Reports';
import { Documents } from './pages/Documents';
import { Settings } from './pages/Settings';

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Authentication Route */}
          <Route path="/login" element={<LoginPage />} />

          {/* Root Protected Application Shell */}
          <Route
            element={
              <ProtectedRoute>
                <AppShell />
              </ProtectedRoute>
            }
          >
            {/* Common Authenticated Routes */}
            <Route path="/" element={<Dashboard />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/documents" element={<Documents />} />
            <Route path="/settings" element={<Settings />} />

            {/* Owner & HR / Site Manager Restricted Routes */}
            <Route
              path="/projects"
              element={
                <ProtectedRoute allowedRoles={['owner', 'admin', 'hr', 'manager', 'site_manager']}>
                  <Projects />
                </ProtectedRoute>
              }
            />
            <Route
              path="/labour"
              element={
                <ProtectedRoute allowedRoles={['owner', 'admin', 'hr', 'manager', 'site_manager']}>
                  <Labour />
                </ProtectedRoute>
              }
            />
            <Route
              path="/materials"
              element={
                <ProtectedRoute allowedRoles={['owner', 'admin', 'hr', 'manager', 'site_manager']}>
                  <Materials />
                </ProtectedRoute>
              }
            />
            <Route
              path="/issues"
              element={
                <ProtectedRoute allowedRoles={['owner', 'admin', 'hr', 'manager', 'site_manager']}>
                  <Issues />
                </ProtectedRoute>
              }
            />

            {/* Owner-Exclusive Financial Route */}
            <Route
              path="/expenses"
              element={
                <ProtectedRoute allowedRoles={['owner', 'admin']}>
                  <Expenses />
                </ProtectedRoute>
              }
            />

            {/* Wildcard Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { WorkspaceProvider } from './context/WorkspaceContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LoginPage } from './pages/LoginPage';
import { AppShell } from './components/layout/AppShell';
import { Dashboard } from './pages/Dashboard';
import { ResourcePage } from './pages/ResourcePage';
import { AttendancePage, WagesPage } from './pages/AttendancePage';
import { ErrorBoundary } from './components/ErrorBoundary';
import { NotFound } from './pages/NotFound';
import { AccountPage } from './pages/AccountPage';
import { roleModules, normalizeRole } from './utils/permissions';
import { useAuth } from './context/AuthContext';
import type { ReactNode } from 'react';
function ModuleRoute({path,children}:{path:string;children:ReactNode}) {const {user}=useAuth();return roleModules[normalizeRole(user?.role)].includes(path)?<>{children}</>:<Navigate to="/" replace/>;}
export function App() {
  return <ErrorBoundary><AuthProvider><BrowserRouter><WorkspaceProvider><Routes><Route path="/login" element={<LoginPage/>}/><Route element={<ProtectedRoute><AppShell/></ProtectedRoute>}>
    <Route index element={<Dashboard/>}/>
    {Object.entries({'/projects':'sites','/workers':'workers','/contractors':'contractors','/tasks':'tasks','/materials':'materials','/expenses':'expenses','/issues':'issues','/reports':'reports','/documents':'documents','/team':'team'} as const).map(([path,resource])=><Route key={path} path={path} element={<ModuleRoute path={path}><ResourcePage key={resource} resource={resource}/></ModuleRoute>}/>)}
    <Route path="/labour" element={<ModuleRoute path="/labour"><AttendancePage/></ModuleRoute>}/><Route path="/my-attendance" element={<ModuleRoute path="/my-attendance"><AttendancePage/></ModuleRoute>}/><Route path="/wages" element={<WagesPage/>}/><Route path="/settings" element={<AccountPage/>}/><Route path="/sites" element={<Navigate to="/projects" replace/>}/><Route path="*" element={<NotFound/>}/>
  </Route></Routes></WorkspaceProvider></BrowserRouter></AuthProvider></ErrorBoundary>;
}
export default App;

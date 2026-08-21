import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user) {
    const currentRole = (user.role || 'owner').toLowerCase();
    const normalizedAllowed = allowedRoles.map((r) => r.toLowerCase());

    if (!normalizedAllowed.includes(currentRole)) {
      // User does not have access permissions for this route
      return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
}
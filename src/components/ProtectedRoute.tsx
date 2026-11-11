import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ForbiddenView } from './ForbiddenView';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireAdmin = false }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Verificando sesión segura...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    const returnPath = location.pathname.startsWith('/') ? location.pathname : '/';
    return <Navigate to={`/login?returnTo=${encodeURIComponent(returnPath)}`} replace />;
  }

  if (requireAdmin && !user.isAdmin) {
    return <ForbiddenView />;
  }

  return <>{children}</>;
};

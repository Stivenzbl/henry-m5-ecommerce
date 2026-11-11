import React from 'react';
import { ShieldAlert, ArrowLeft, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export const ForbiddenView: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center border border-gray-100 dark:border-gray-700">
        <div className="w-16 h-16 bg-red-100 dark:bg-red-950/50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-red-600 dark:text-red-400">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          403 — Acceso Denegado
        </h1>

        <p className="text-gray-600 dark:text-gray-300 text-sm mb-6 leading-relaxed">
          La cuenta activa <strong className="text-gray-900 dark:text-white">{user?.email || 'actual'}</strong> cuenta con permisos de <span className="inline-block px-2 py-0.5 text-xs font-semibold rounded bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 uppercase">{user?.role || 'CLIENTE'}</span> y no está autorizada para acceder a la consola administrativa.
        </p>

        <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 rounded-lg p-3 text-xs text-amber-800 dark:text-amber-300 text-left mb-6">
          <strong>Seguridad RBAC:</strong> Los permisos de administración se verifican en el servidor mediante Custom Claims en el token de sesión.
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => navigate('/')}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-medium text-sm hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al Catálogo
          </button>
          
          <button
            onClick={async () => {
              await logout();
              navigate('/login?returnTo=/admin');
            }}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 font-medium text-sm hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Cambiar de Cuenta
          </button>
        </div>
      </div>
    </div>
  );
};

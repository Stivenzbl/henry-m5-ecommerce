import React, { useState } from 'react';
import { X, ShieldCheck, User, Lock, Mail, CheckCircle2, LogOut, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types/user';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  requiredRole?: UserRole;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  requiredRole,
}) => {
  const { user, loginAs, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'quick' | 'form'>('quick');
  const [customEmail, setCustomEmail] = useState('');
  const [customPassword, setCustomPassword] = useState('');
  const [customName, setCustomName] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>(requiredRole || 'customer');
  const [formError, setFormError] = useState('');

  if (!isOpen) return null;

  const handleQuickLogin = (role: UserRole) => {
    loginAs(role);
    onClose();
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customEmail || !customPassword) {
      setFormError('Por favor completa todos los campos.');
      return;
    }
    if (!customEmail.includes('@')) {
      setFormError('Ingresa un correo electrónico válido.');
      return;
    }

    const displayName = customName.trim() || customEmail.split('@')[0];
    loginAs(selectedRole, displayName, customEmail);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="login-modal-title"
      >
        {/* Header */}
        <div className="relative bg-gradient-to-r from-slate-900 to-indigo-950 p-6 text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition"
            aria-label="Cerrar modal de autenticación"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center space-x-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Control de Acceso RBAC</span>
          </div>
          <h2 id="login-modal-title" className="text-xl font-bold">
            {user ? 'Tu Cuenta & Sesión' : 'Iniciar Sesión en Patagonix'}
          </h2>
          <p className="text-slate-300 text-xs mt-1">
            {requiredRole === 'admin' 
              ? 'Se requiere rol de Administrador para acceder a esta sección.'
              : 'Selecciona una cuenta de muestra o ingresa tus credenciales.'}
          </p>
        </div>

        {/* User is already logged in: View Profile & Switch */}
        {user ? (
          <div className="p-6 space-y-6">
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center space-x-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md ${
                user.role === 'admin' 
                  ? 'bg-gradient-to-br from-purple-600 to-indigo-700 shadow-purple-100' 
                  : 'bg-gradient-to-br from-indigo-500 to-blue-600 shadow-blue-100'
              }`}>
                {user.role === 'admin' ? <ShieldCheck className="w-6 h-6" /> : <User className="w-6 h-6" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <h3 className="font-semibold text-slate-900 truncate">{user.displayName}</h3>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                    user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-indigo-100 text-indigo-700'
                  }`}>
                    {user.role}
                  </span>
                </div>
                <p className="text-xs text-slate-500 truncate">{user.email}</p>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Cambiar a otra cuenta de demostración
              </h4>
              
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleQuickLogin('customer')}
                  className={`p-3 rounded-xl border text-left transition ${
                    user.role === 'customer'
                      ? 'border-indigo-600 bg-indigo-50/50 ring-1 ring-indigo-600'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center space-x-2 text-indigo-600 font-semibold text-xs mb-1">
                    <User className="w-3.5 h-3.5" />
                    <span>Cliente</span>
                  </div>
                  <p className="text-[11px] text-slate-600">Catálogo, carrito y órdenes</p>
                </button>

                <button
                  onClick={() => handleQuickLogin('admin')}
                  className={`p-3 rounded-xl border text-left transition ${
                    user.role === 'admin'
                      ? 'border-purple-600 bg-purple-50/50 ring-1 ring-purple-600'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center space-x-2 text-purple-600 font-semibold text-xs mb-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Administrador</span>
                  </div>
                  <p className="text-[11px] text-slate-600">CRUD inventario, KPIs y AWS S3</p>
                </button>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => {
                  logout();
                  onClose();
                }}
                className="flex items-center space-x-2 text-xs font-semibold text-rose-600 hover:text-rose-700 transition px-2 py-1.5 rounded-lg hover:bg-rose-50"
              >
                <LogOut className="w-4 h-4" />
                <span>Cerrar Sesión</span>
              </button>

              <button
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
              >
                Continuar
              </button>
            </div>
          </div>
        ) : (
          /* User is logged out: Login options */
          <div className="p-6">
            
            {/* Tabs */}
            <div className="flex border-b border-slate-200 mb-5">
              <button
                onClick={() => setActiveTab('quick')}
                className={`flex-1 pb-2.5 text-xs font-semibold border-b-2 transition ${
                  activeTab === 'quick'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                ⚡ Acceso Rápido por Rol
              </button>
              <button
                onClick={() => setActiveTab('form')}
                className={`flex-1 pb-2.5 text-xs font-semibold border-b-2 transition ${
                  activeTab === 'form'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                📝 Formulario Credenciales
              </button>
            </div>

            {activeTab === 'quick' ? (
              <div className="space-y-4">
                <p className="text-xs text-slate-600">
                  Haz clic en cualquiera de las cuentas de demostración para iniciar sesión instantáneamente con los permisos del rol:
                </p>

                {/* Option 1: Customer */}
                <div 
                  onClick={() => handleQuickLogin('customer')}
                  className="p-4 rounded-xl border border-slate-200 hover:border-indigo-500 hover:bg-indigo-50/30 transition cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center group-hover:scale-105 transition">
                        <User className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-slate-900 text-sm">Stiven Zabala</span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-700 uppercase">
                            Cliente
                          </span>
                        </div>
                        <p className="text-xs text-slate-500">cliente@patagonix.com</p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition" />
                  </div>
                  <ul className="mt-3 text-[11px] text-slate-600 list-disc list-inside space-y-0.5 pl-1">
                    <li>Explorar catálogo y filtrar por categoría</li>
                    <li>Añadir productos al carrito de compras</li>
                    <li>Completar pedidos y consultar historial de órdenes</li>
                  </ul>
                </div>

                {/* Option 2: Admin */}
                <div 
                  onClick={() => handleQuickLogin('admin')}
                  className="p-4 rounded-xl border border-slate-200 hover:border-purple-500 hover:bg-purple-50/30 transition cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center group-hover:scale-105 transition">
                        <ShieldCheck className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-slate-900 text-sm">Administrador Patagonix</span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800 uppercase">
                            Admin
                          </span>
                        </div>
                        <p className="text-xs text-slate-500">admin@patagonix.com</p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-purple-600 group-hover:translate-x-1 transition" />
                  </div>
                  <ul className="mt-3 text-[11px] text-slate-600 list-disc list-inside space-y-0.5 pl-1">
                    <li>Acceso al Panel de Control (`/admin`)</li>
                    <li>Dashboard de Analytics (Revenue, AOV, Órdenes)</li>
                    <li>Crear, editar, eliminar productos y subir fotos a AWS S3</li>
                  </ul>
                </div>
              </div>
            ) : (
              /* Classical Form Tab */
              <form onSubmit={handleFormSubmit} className="space-y-4">
                {formError && (
                  <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                    {formError}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nombre o Alias (Opcional)
                  </label>
                  <input
                    type="text"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    placeholder="Ej. Stiven Zabala"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Correo Electrónico
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="email"
                      required
                      value={customEmail}
                      onChange={(e) => setCustomEmail(e.target.value)}
                      placeholder="usuario@ejemplo.com"
                      className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Contraseña
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="password"
                      required
                      value={customPassword}
                      onChange={(e) => setCustomPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Rol Asignado
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedRole('customer')}
                      className={`py-2 px-3 rounded-lg text-xs font-semibold border flex items-center justify-center space-x-1.5 transition ${
                        selectedRole === 'customer'
                          ? 'bg-indigo-50 border-indigo-600 text-indigo-700'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <User className="w-3.5 h-3.5" />
                      <span>Cliente</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedRole('admin')}
                      className={`py-2 px-3 rounded-lg text-xs font-semibold border flex items-center justify-center space-x-1.5 transition ${
                        selectedRole === 'admin'
                          ? 'bg-purple-50 border-purple-600 text-purple-700'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Administrador</span>
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full mt-2 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-md shadow-indigo-100 transition"
                >
                  Ingresar a Patagonix
                </button>
              </form>
            )}

            <div className="mt-5 pt-3 border-t border-slate-100 text-[11px] text-slate-400 flex items-center space-x-1.5 justify-center">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>Sesión persistente mediante tokens locales y arquitectura RBAC.</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

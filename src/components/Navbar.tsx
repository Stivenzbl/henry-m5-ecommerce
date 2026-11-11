import React from 'react';
import { ShoppingBag, ShieldCheck, User, RefreshCw } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

interface NavbarProps {
  currentView: 'catalog' | 'orders' | 'admin';
  onNavigate: (view: 'catalog' | 'orders' | 'admin') => void;
  onOpenCart: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate, onOpenCart }) => {
  const { user, switchRole } = useAuth();
  const { state: cartState } = useCart();

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onNavigate('catalog')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white font-bold shadow-md shadow-indigo-100">
            PX
          </div>
          <div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700">
              Patagonix
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 block -mt-1">
              Retail AI
            </span>
          </div>
        </div>

        {/* Navigation links */}
        <nav className="hidden sm:flex items-center space-x-1">
          <button
            onClick={() => onNavigate('catalog')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
              currentView === 'catalog'
                ? 'bg-indigo-50 text-indigo-700 font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            Catálogo
          </button>
          
          <button
            onClick={() => onNavigate('orders')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
              currentView === 'orders'
                ? 'bg-indigo-50 text-indigo-700 font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            Mis Órdenes
          </button>

          {user?.role === 'admin' && (
            <button
              onClick={() => onNavigate('admin')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition flex items-center space-x-1.5 ${
                currentView === 'admin'
                  ? 'bg-purple-100 text-purple-800 font-semibold'
                  : 'text-purple-700 hover:bg-purple-50'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Panel Admin</span>
            </button>
          )}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center space-x-3">
          
          {/* Role Switcher pill */}
          <button
            onClick={switchRole}
            title="Alternar rol para pruebas (Customer / Admin)"
            className="flex items-center space-x-1.5 px-2.5 py-1 text-xs rounded-full border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 transition"
          >
            <RefreshCw className="w-3 h-3 text-slate-500" />
            <span>Rol: <strong className={user?.role === 'admin' ? 'text-purple-600' : 'text-indigo-600'}>{user?.role}</strong></span>
          </button>

          {/* User info */}
          <div className="hidden md:flex items-center space-x-2 text-slate-600 text-xs">
            <User className="w-4 h-4 text-slate-400" />
            <span className="truncate max-w-[120px] font-medium">{user?.displayName}</span>
          </div>

          {/* Cart button */}
          <button
            onClick={onOpenCart}
            className="relative p-2 rounded-xl text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label="Abrir carrito"
          >
            <ShoppingBag className="w-6 h-6" />
            {cartState.totalQuantity > 0 && (
              <span className="absolute -top-1 -right-1 bg-indigo-600 text-white font-bold text-xs w-5 h-5 rounded-full flex items-center justify-center shadow-sm animate-pulse">
                {cartState.totalQuantity}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

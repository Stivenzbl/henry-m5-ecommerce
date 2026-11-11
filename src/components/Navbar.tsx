import React, { useState } from 'react';
import { ShoppingBag, ShieldCheck, User, Menu, X as CloseIcon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

interface NavbarProps {
  currentView: 'catalog' | 'orders' | 'admin';
  onNavigate: (view: 'catalog' | 'orders' | 'admin') => void;
  onOpenCart: () => void;
  onOpenLogin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate, onOpenCart, onOpenLogin }) => {
  const { user } = useAuth();
  const { state: cartState } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleMobileNav = (view: 'catalog' | 'orders' | 'admin') => {
    onNavigate(view);
    setMobileMenuOpen(false);
  };

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

        {/* Desktop Navigation links */}
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
        <div className="flex items-center space-x-2 sm:space-x-3">
          
          {/* User Authentication Pill / Login Button */}
          {user ? (
            <button
              onClick={onOpenLogin}
              title="Administrar sesión y roles de usuario"
              className="flex items-center space-x-2 px-3 py-1.5 rounded-full border border-slate-200 bg-slate-50 hover:bg-slate-100 transition shadow-xs group"
            >
              <div className={`w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-bold ${
                user.role === 'admin' ? 'bg-purple-600' : 'bg-indigo-600'
              }`}>
                {user.role === 'admin' ? <ShieldCheck className="w-3 h-3" /> : <User className="w-3 h-3" />}
              </div>
              <div className="flex items-center space-x-1 text-xs">
                <span className="font-semibold text-slate-800 hidden md:inline max-w-[100px] truncate">
                  {user.displayName}
                </span>
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                  user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-indigo-100 text-indigo-700'
                }`}>
                  {user.role}
                </span>
              </div>
            </button>
          ) : (
            <button
              onClick={onOpenLogin}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition shadow-sm"
            >
              <User className="w-3.5 h-3.5" />
              <span>Iniciar Sesión</span>
            </button>
          )}

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

          {/* Mobile hamburger menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="sm:hidden p-2 text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition focus:outline-none"
            aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú móvil'}
          >
            {mobileMenuOpen ? <CloseIcon className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile navigation drawer / dropdown */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-slate-100 bg-white/98 backdrop-blur-md px-4 pt-2 pb-4 space-y-1 shadow-lg animate-in slide-in-from-top-2 duration-150">
          <button
            onClick={() => handleMobileNav('catalog')}
            className={`w-full text-left px-3 py-2 rounded-xl text-sm font-medium transition ${
              currentView === 'catalog'
                ? 'bg-indigo-50 text-indigo-700 font-semibold'
                : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            Catálogo
          </button>

          <button
            onClick={() => handleMobileNav('orders')}
            className={`w-full text-left px-3 py-2 rounded-xl text-sm font-medium transition ${
              currentView === 'orders'
                ? 'bg-indigo-50 text-indigo-700 font-semibold'
                : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            Mis Órdenes
          </button>

          {user?.role === 'admin' && (
            <button
              onClick={() => handleMobileNav('admin')}
              className={`w-full text-left px-3 py-2 rounded-xl text-sm font-medium transition flex items-center space-x-2 ${
                currentView === 'admin'
                  ? 'bg-purple-100 text-purple-800 font-semibold'
                  : 'text-purple-700 hover:bg-purple-50'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Panel Admin</span>
            </button>
          )}

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs px-1">
            {user ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenLogin();
                }}
                className="flex items-center space-x-2 text-slate-700 font-medium hover:text-indigo-600 transition"
              >
                <span>{user.displayName}</span>
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                  user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-indigo-100 text-indigo-700'
                }`}>
                  {user.role}
                </span>
              </button>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenLogin();
                }}
                className="font-semibold text-indigo-600 hover:text-indigo-700"
              >
                Iniciar Sesión
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, ShieldCheck, User, Menu, X as CloseIcon, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

interface NavbarProps {
  onOpenCart: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenCart }) => {
  const { user, logout } = useAuth();
  const { state: cartState } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const currentPath = location.pathname;

  const handleLogout = async () => {
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
    await logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 shadow-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand */}
        <div 
          className="flex items-center space-x-3 cursor-pointer group" 
          onClick={() => navigate('/')}
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-sky-500 flex items-center justify-center text-white font-bold shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            PX
          </div>
          <div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200">
              Patagonix
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 block -mt-1">
              Retail AI
            </span>
          </div>
        </div>

        {/* Desktop Navigation links */}
        <nav className="hidden sm:flex items-center space-x-1">
          <button
            onClick={() => navigate('/')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
              currentPath === '/'
                ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 font-semibold'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            Catálogo
          </button>
          
          <button
            onClick={() => navigate('/orders')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
              currentPath === '/orders'
                ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 font-semibold'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            Mis Órdenes
          </button>

          {user?.isAdmin && (
            <button
              onClick={() => navigate('/admin')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition flex items-center space-x-1.5 ${
                currentPath === '/admin'
                  ? 'bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 font-semibold'
                  : 'text-purple-700 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/30'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Panel Admin</span>
            </button>
          )}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          
          {/* User Authentication Pill / Dropdown */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center space-x-2 px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-750 transition shadow-xs group"
                aria-expanded={userDropdownOpen}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-[11px] font-bold shadow-xs ${
                  user.isAdmin ? 'bg-purple-600' : 'bg-indigo-600'
                }`}>
                  {user.displayName ? user.displayName.slice(0, 2).toUpperCase() : 'US'}
                </div>
                <div className="flex items-center space-x-1.5 text-xs">
                  <span className="font-semibold text-gray-800 dark:text-gray-200 hidden md:inline max-w-[110px] truncate">
                    {user.displayName}
                  </span>
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                    user.isAdmin ? 'bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300' : 'bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300'
                  }`}>
                    {user.role}
                  </span>
                </div>
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-2 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-3 py-2 border-b border-gray-100 dark:border-gray-700 mb-1">
                    <p className="text-xs font-semibold text-gray-900 dark:text-white truncate">{user.displayName}</p>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                  </div>
                  
                  {user.isAdmin && (
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        navigate('/admin');
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-purple-700 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/40 rounded-xl transition"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>Consola de Administración</span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      navigate('/orders');
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-750 rounded-xl transition"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Mis Pedidos</span>
                  </button>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition border-t border-gray-100 dark:border-gray-700 mt-1"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Cerrar Sesión</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white transition shadow-sm"
            >
              <User className="w-3.5 h-3.5" />
              <span>Iniciar Sesión</span>
            </button>
          )}

          {/* Cart button */}
          <button
            onClick={onOpenCart}
            className="relative p-2 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition focus:outline-none"
            aria-label="Abrir carrito de compras"
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
            className="sm:hidden p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú móvil'}
          >
            {mobileMenuOpen ? <CloseIcon className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile navigation drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-gray-100 dark:border-gray-800 bg-white/98 dark:bg-gray-900/98 backdrop-blur-md px-4 pt-2 pb-4 space-y-1 shadow-lg">
          <button
            onClick={() => {
              navigate('/');
              setMobileMenuOpen(false);
            }}
            className={`w-full text-left px-3 py-2 rounded-xl text-sm font-medium transition ${
              currentPath === '/'
                ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-semibold'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
            }`}
          >
            Catálogo
          </button>

          <button
            onClick={() => {
              navigate('/orders');
              setMobileMenuOpen(false);
            }}
            className={`w-full text-left px-3 py-2 rounded-xl text-sm font-medium transition ${
              currentPath === '/orders'
                ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-semibold'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
            }`}
          >
            Mis Órdenes
          </button>

          {user?.isAdmin && (
            <button
              onClick={() => {
                navigate('/admin');
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2 rounded-xl text-sm font-medium transition flex items-center space-x-2 ${
                currentPath === '/admin'
                  ? 'bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 font-semibold'
                  : 'text-purple-700 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/30'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Panel Admin</span>
            </button>
          )}

          <div className="pt-2 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs px-1">
            {user ? (
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-between text-red-600 dark:text-red-400 font-semibold py-1.5"
              >
                <span>Cerrar Sesión ({user.displayName})</span>
                <LogOut className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate('/login');
                }}
                className="w-full text-center py-2 font-semibold text-white bg-indigo-600 rounded-xl"
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

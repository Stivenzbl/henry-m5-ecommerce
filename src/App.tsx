import React, { useState, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { CatalogView } from './pages/CatalogView';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './pages/CheckoutModal';
import { ProtectedRoute } from './components/ProtectedRoute';

const OrdersView = lazy(() => import('./pages/OrdersView').then(m => ({ default: m.OrdersView })));
const AdminView = lazy(() => import('./pages/AdminView').then(m => ({ default: m.AdminView })));
const LoginView = lazy(() => import('./pages/LoginView').then(m => ({ default: m.LoginView })));

const RouteLoadingFallback: React.FC = () => (
  <div className="flex items-center justify-center min-h-[50vh]" role="status" aria-label="Cargando vista">
    <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
  </div>
);

const AppLayout: React.FC = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-900 flex flex-col font-sans transition-colors">
      {!isLoginPage && (
        <Navbar onOpenCart={() => setIsCartOpen(true)} />
      )}

      <main className={isLoginPage ? 'flex-1' : 'flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8'}>
        <Suspense fallback={<RouteLoadingFallback />}>
          <Routes>
            <Route path="/" element={<CatalogView />} />
            <Route path="/catalog" element={<Navigate to="/" replace />} />
            <Route path="/login" element={<LoginView />} />
            <Route 
              path="/orders" 
              element={
                <ProtectedRoute>
                  <OrdersView />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute requireAdmin>
                  <AdminView />
                </ProtectedRoute>
              } 
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </main>

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onOrderSuccess={() => {
          // Handled within modal
        }}
      />

      {!isLoginPage && (
        <footer className="bg-white dark:bg-gray-800 border-t border-slate-200 dark:border-gray-700 mt-12 py-8 text-center text-xs text-slate-500 dark:text-gray-400">
          <p>© 2026 Patagonix Retail — E-Commerce Enterprise Architecture · Stiven Zabala</p>
        </footer>
      )}
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
};

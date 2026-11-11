import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { CatalogView } from './pages/CatalogView';
import { OrdersView } from './pages/OrdersView';
import { AdminView } from './pages/AdminView';
import { LoginView } from './pages/LoginView';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './pages/CheckoutModal';
import { ProtectedRoute } from './components/ProtectedRoute';

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

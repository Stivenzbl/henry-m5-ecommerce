import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { CatalogView } from './pages/CatalogView';
import { OrdersView } from './pages/OrdersView';
import { AdminView } from './pages/AdminView';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './pages/CheckoutModal';
import { useAuth } from './contexts/AuthContext';

export const App: React.FC = () => {
  const { user } = useAuth();
  const [currentView, setCurrentView] = useState<'catalog' | 'orders' | 'admin'>('catalog');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const handleNavigate = (view: 'catalog' | 'orders' | 'admin') => {
    if (view === 'admin' && user?.role !== 'admin') {
      alert('Acceso restringido: Esta vista requiere rol de administrador.');
      return;
    }
    setCurrentView(view);
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      
      {/* Top Navbar */}
      <Navbar
        currentView={currentView}
        onNavigate={handleNavigate}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'catalog' && <CatalogView />}
        {currentView === 'orders' && <OrdersView />}
        {currentView === 'admin' && <AdminView />}
      </main>

      {/* Cart Slide-Over */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onProceedToCheckout={handleProceedToCheckout}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onOrderSuccess={() => {
          // Switch to orders view on successful purchase
          setCurrentView('orders');
        }}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-8 text-center text-xs text-slate-400">
        <p>Patagonix Tech Retail © 2026 · Proyecto Integrador M5 Front-End (Full Stack IA)</p>
        <p className="mt-1">React 18 + TypeScript + Vite + Firebase Firestore + AWS S3 Presigned URLs</p>
      </footer>
    </div>
  );
};

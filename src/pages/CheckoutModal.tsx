import React, { useState } from 'react';
import { X, CheckCircle, ShieldCheck } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { OrderService } from '../services/orderService';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderSuccess: (orderId: string) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  onOrderSuccess,
}) => {
  const { state: cartState, clearCart } = useCart();
  const { user } = useAuth();

  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('Colombia');
  const [postalCode, setPostalCode] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleConfirmOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsProcessing(true);
    try {
      const order = await OrderService.createOrder({
        userId: user.uid,
        userEmail: user.email,
        items: cartState.items,
        totalPrice: cartState.totalPrice,
        totalQuantity: cartState.totalQuantity,
        shippingAddress: {
          street,
          city,
          country,
          postalCode,
        },
      });

      clearCart();
      setCompletedOrder(order.id);
      onOrderSuccess(order.id);
    } catch (err) {
      console.error('Error confirming order:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 sm:p-8 overflow-hidden">
          
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>

          {completedOrder ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900">¡Orden Confirmada!</h3>
              <p className="text-sm text-slate-500 max-w-sm mx-auto">
                Tu orden <strong>#{completedOrder}</strong> ha sido registrada exitosamente en el historial con estado <strong>pending</strong>.
              </p>
              
              <div className="pt-4">
                <button
                  onClick={onClose}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm shadow-md shadow-indigo-100 transition"
                >
                  Volver al Catálogo
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleConfirmOrder} className="space-y-5">
              <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-3 flex items-start gap-2.5 text-xs text-amber-900">
                <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Modo Demostración Activo:</strong> Las órdenes se registran en el historial de sesión local. No se requiere tarjeta de crédito ni se realizan cobros reales.
                </span>
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 block">
                  Simulación de Checkout
                </span>
                <h3 className="text-xl font-extrabold text-slate-900 mt-1">
                  Dirección de Entrega
                </h3>
              </div>

              {/* Order summary box */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 flex justify-between items-center text-sm">
                <div>
                  <span className="text-slate-500 text-xs block">Artículos: {cartState.totalQuantity}</span>
                  <span className="font-bold text-slate-900">Total a Pagar:</span>
                </div>
                <span className="text-xl font-extrabold text-indigo-600">
                  ${cartState.totalPrice.toFixed(2)}
                </span>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Calle y Número</label>
                  <input
                    type="text"
                    required
                    value={street}
                    onChange={e => setStreet(e.target.value)}
                    placeholder="Ej. Carrera 15 #85-30"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Ciudad</label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={e => setCity(e.target.value)}
                      placeholder="Ej. Bogotá"
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">País</label>
                    <input
                      type="text"
                      required
                      value={country}
                      onChange={e => setCountry(e.target.value)}
                      placeholder="Ej. Colombia"
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Código Postal</label>
                    <input
                      type="text"
                      required
                      value={postalCode}
                      onChange={e => setPostalCode(e.target.value)}
                      placeholder="Ej. 110221"
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center space-x-2 text-xs text-slate-400">
                <ShieldCheck className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span>Simulación de pago segura. No se requieren tarjetas reales.</span>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm shadow-lg shadow-indigo-100 transition active:scale-[0.99]"
              >
                {isProcessing ? 'Procesando orden...' : 'Confirmar y Pagar'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

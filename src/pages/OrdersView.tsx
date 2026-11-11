import React, { useState, useEffect } from 'react';
import { Package, Clock, CheckCircle2, AlertCircle, Calendar } from 'lucide-react';
import { Order, OrderStatus } from '../types/order';
import { OrderService } from '../services/orderService';
import { useAuth } from '../contexts/AuthContext';

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; icon: React.ReactNode }> = {
  pending: {
    label: 'Pendiente',
    color: 'bg-amber-50 text-amber-700 border-amber-200',
    icon: <Clock className="w-3.5 h-3.5" />,
  },
  processing: {
    label: 'En Preparación',
    color: 'bg-blue-50 text-blue-700 border-blue-200',
    icon: <Clock className="w-3.5 h-3.5" />,
  },
  completed: {
    label: 'Completada',
    color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    icon: <CheckCircle2 className="w-3.5 h-3.5" />,
  },
  cancelled: {
    label: 'Cancelada',
    color: 'bg-rose-50 text-rose-700 border-rose-200',
    icon: <AlertCircle className="w-3.5 h-3.5" />,
  },
};

export const OrdersView: React.FC = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const loadOrders = async () => {
      setIsLoading(true);
      try {
        const data = await OrderService.getOrdersByUser(user.uid);
        setOrders(data);
      } catch (err) {
        console.error('Error loading orders:', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadOrders();
  }, [user]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900">Historial de Órdenes</h2>
        <p className="text-xs text-slate-500 mt-1">
          Seguimiento en tiempo real de tus pedidos vinculados a Firestore por usuario.
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2].map(n => (
            <div key={n} className="p-6 bg-white rounded-2xl border border-slate-200 animate-pulse space-y-3">
              <div className="h-4 bg-slate-100 rounded w-1/4" />
              <div className="h-3 bg-slate-100 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center flex flex-col items-center justify-center">
          <Package className="w-16 h-16 text-slate-300 stroke-[1.2] mb-3" />
          <h3 className="text-base font-bold text-slate-800">Aún no tienes órdenes registradas</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm">
            Completa tu primera compra desde el catálogo para ver el historial y estado de envío aquí.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => {
            const statusMeta = STATUS_CONFIG[order.status];
            return (
              <div
                key={order.id}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden"
              >
                {/* Header */}
                <div className="p-4 sm:p-5 bg-slate-50 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <span className="text-xs font-mono font-bold text-slate-900 block">
                      Orden #{order.id}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center space-x-1 mt-0.5">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(order.createdAt).toLocaleDateString()} {new Date(order.createdAt).toLocaleTimeString()}</span>
                    </span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <span className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold border ${statusMeta.color}`}>
                      {statusMeta.icon}
                      <span>{statusMeta.label}</span>
                    </span>

                    <span className="text-sm font-extrabold text-indigo-600">
                      ${order.totalPrice.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Items preview */}
                <div className="p-4 sm:p-5 divide-y divide-slate-100">
                  {order.items.map(item => (
                    <div key={item.product.id} className="py-2.5 flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-3">
                        <img
                          src={item.product.imageUrl}
                          alt={item.product.title}
                          className="w-10 h-10 rounded-lg object-cover bg-slate-100"
                        />
                        <div>
                          <p className="font-semibold text-slate-900">{item.product.title}</p>
                          <p className="text-slate-400">Cantidad: {item.quantity}</p>
                        </div>
                      </div>
                      <span className="font-bold text-slate-700">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}

                  <div className="pt-3 flex justify-between items-center text-xs text-slate-500">
                    <span>Destino: {order.shippingAddress.street}, {order.shippingAddress.city}</span>
                    <span className="font-medium text-slate-400">{order.items.length} productos</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

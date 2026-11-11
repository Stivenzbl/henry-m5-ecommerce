import React, { useState, useEffect, useMemo } from 'react';
import { Product } from '../types/product';
import { Order, OrderStatus } from '../types/order';
import { ProductService } from '../services/productService';
import { OrderService } from '../services/orderService';
import { AdminProductModal } from '../components/AdminProductModal';
import {
  Package,
  Plus,
  Trash2,
  Edit2,
  Clock,
  CheckCircle2,
  AlertCircle,
  Truck,
  TrendingUp,
  DollarSign,
  ShoppingBag,
  Star,
  Sparkles,
  BarChart3,
  Layers
} from 'lucide-react';

export const AdminView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'analytics' | 'products' | 'orders'>('analytics');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [orderStatusFilter, setOrderStatusFilter] = useState<OrderStatus | 'all'>('all');

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [prods, ords] = await Promise.all([
        ProductService.getAll(),
        OrderService.getAllOrders(),
      ]);
      setProducts(prods);
      setOrders(ords);
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este producto del catálogo?')) return;
    try {
      await ProductService.delete(id);
      await fetchData();
    } catch (err) {
      alert('Error eliminando producto');
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      await OrderService.updateOrderStatus(orderId, newStatus);
      await fetchData();
    } catch (err) {
      alert('Error actualizando estado de la orden');
    }
  };

  // Analytics Computations (Extra Credit 1)
  const analytics = useMemo(() => {
    const totalRevenue = orders
      .filter((o) => o.status !== 'cancelled')
      .reduce((sum, o) => sum + o.totalPrice, 0);

    const totalOrders = orders.length;
    const completedOrders = orders.filter((o) => o.status === 'completed').length;
    const pendingOrders = orders.filter((o) => o.status === 'pending').length;
    const processingOrders = orders.filter((o) => o.status === 'processing').length;
    const cancelledOrders = orders.filter((o) => o.status === 'cancelled').length;

    const aov = totalOrders > 0 ? totalRevenue / (totalOrders - cancelledOrders || 1) : 0;
    const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
    const inventoryValue = products.reduce((sum, p) => sum + p.price * p.stock, 0);

    // Sales by Category
    const categorySales: Record<string, { count: number; total: number }> = {};
    orders.forEach((o) => {
      if (o.status === 'cancelled') return;
      o.items.forEach((item) => {
        const cat = item.product.category || 'otros';
        if (!categorySales[cat]) categorySales[cat] = { count: 0, total: 0 };
        categorySales[cat].count += item.quantity;
        categorySales[cat].total += item.product.price * item.quantity;
      });
    });

    // Top selling products
    const productSales: Record<string, { title: string; units: number; revenue: number }> = {};
    orders.forEach((o) => {
      if (o.status === 'cancelled') return;
      o.items.forEach((item) => {
        if (!productSales[item.product.id]) {
          productSales[item.product.id] = { title: item.product.title, units: 0, revenue: 0 };
        }
        productSales[item.product.id].units += item.quantity;
        productSales[item.product.id].revenue += item.product.price * item.quantity;
      });
    });

    const topSelling = Object.values(productSales)
      .sort((a, b) => b.units - a.units)
      .slice(0, 5);

    return {
      totalRevenue,
      totalOrders,
      completedOrders,
      pendingOrders,
      processingOrders,
      cancelledOrders,
      aov,
      totalStock,
      inventoryValue,
      categorySales,
      topSelling,
    };
  }, [orders, products]);

  const filteredOrders = useMemo(() => {
    if (orderStatusFilter === 'all') return orders;
    return orders.filter((o) => o.status === orderStatusFilter);
  }, [orders, orderStatusFilter]);

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" /> Completada
          </span>
        );
      case 'processing':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
            <Truck className="w-3.5 h-3.5" /> En Proceso
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3.5 h-3.5" /> Pendiente
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
            <AlertCircle className="w-3.5 h-3.5" /> Cancelada
          </span>
        );
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Admin Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl relative overflow-hidden">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-semibold backdrop-blur-md mb-3 border border-amber-500/30">
            <Sparkles className="w-3.5 h-3.5" /> Panel de Control de Administración
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Gestión Retail · Patagonix Tech
          </h1>
          <p className="mt-1 text-slate-400 text-xs sm:text-sm">
            Control de inventario, subida a AWS S3 con presigned URLs, órdenes y métricas de negocio.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-slate-800 p-1 rounded-xl border border-slate-700">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition ${
              activeTab === 'analytics'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Analytics</span>
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition ${
              activeTab === 'products'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Productos ({products.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition ${
              activeTab === 'orders'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Órdenes ({orders.length})</span>
          </button>
        </div>
      </div>

      {/* Loading state */}
      {isLoading ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400">
          Cargando panel de administración...
        </div>
      ) : (
        <>
          {/* TAB 1: ANALYTICS DASHBOARD (EXTRA CREDIT 1) */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              
              {/* KPI Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                {/* Revenue */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <DollarSign className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-medium text-slate-400">Ingresos Totales</span>
                    <h3 className="text-2xl font-extrabold text-slate-900">
                      ${analytics.totalRevenue.toFixed(2)}
                    </h3>
                    <span className="text-[10px] text-emerald-600 font-semibold">
                      +{analytics.completedOrders} órdenes pagadas
                    </span>
                  </div>
                </div>

                {/* Orders count */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <ShoppingBag className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-medium text-slate-400">Total de Órdenes</span>
                    <h3 className="text-2xl font-extrabold text-slate-900">
                      {analytics.totalOrders}
                    </h3>
                    <span className="text-[10px] text-indigo-600 font-semibold">
                      {analytics.pendingOrders} pendientes de despacho
                    </span>
                  </div>
                </div>

                {/* Average Order Value (AOV) */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-medium text-slate-400">Ticket Promedio (AOV)</span>
                    <h3 className="text-2xl font-extrabold text-slate-900">
                      ${analytics.aov.toFixed(2)}
                    </h3>
                    <span className="text-[10px] text-blue-600 font-semibold">Por carrito procesado</span>
                  </div>
                </div>

                {/* Inventory Stock */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                    <Layers className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-medium text-slate-400">Valor de Inventario</span>
                    <h3 className="text-2xl font-extrabold text-slate-900">
                      ${analytics.inventoryValue.toFixed(0)}
                    </h3>
                    <span className="text-[10px] text-slate-500 font-semibold">
                      {analytics.totalStock} unidades en almacén
                    </span>
                  </div>
                </div>
              </div>

              {/* Charts & Breakdown Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Sales by Category Chart */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-indigo-600" />
                      <span>Ventas por Categoría</span>
                    </h3>
                    <span className="text-xs text-slate-400">Desglose de facturación</span>
                  </div>

                  <div className="space-y-3 pt-2">
                    {Object.entries(analytics.categorySales).length === 0 ? (
                      <p className="text-xs text-slate-400 italic py-4 text-center">
                        Aún no hay compras registradas para calcular métricas por categoría.
                      </p>
                    ) : (
                      Object.entries(analytics.categorySales).map(([cat, stats]) => {
                        const pct =
                          analytics.totalRevenue > 0
                            ? Math.round((stats.total / analytics.totalRevenue) * 100)
                            : 0;
                        return (
                          <div key={cat} className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span className="font-semibold text-slate-700 uppercase tracking-wider">
                                {cat}
                              </span>
                              <span className="text-slate-500 font-medium">
                                ${stats.total.toFixed(2)} ({pct}%)
                              </span>
                            </div>
                            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* Top Selling Products & Order Health */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-emerald-600" />
                      <span>Productos más Vendidos</span>
                    </h3>
                    <span className="text-xs text-slate-400">Por unidades vendidas</span>
                  </div>

                  <div className="space-y-3 pt-2">
                    {analytics.topSelling.length === 0 ? (
                      <p className="text-xs text-slate-400 italic py-4 text-center">
                        Realiza un pedido desde el catálogo para ver productos aquí.
                      </p>
                    ) : (
                      analytics.topSelling.map((prod, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                          <div className="flex items-center gap-3">
                            <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center justify-center">
                              {idx + 1}
                            </span>
                            <span className="text-xs font-semibold text-slate-800 line-clamp-1 max-w-[200px]">
                              {prod.title}
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="text-xs font-bold text-slate-900 block">
                              {prod.units} uds.
                            </span>
                            <span className="text-[10px] text-slate-400">
                              ${prod.revenue.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PRODUCTS CRUD */}
          {activeTab === 'products' && (
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
              <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-800 text-base">Catálogo de Productos</h3>
                  <p className="text-xs text-slate-400">Total: {products.length} productos registrados</p>
                </div>
                <button
                  onClick={() => {
                    setEditingProduct(null);
                    setIsModalOpen(true);
                  }}
                  className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2 rounded-xl transition shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>Nuevo Producto</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-[11px] font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                      <th className="py-3 px-4">Producto</th>
                      <th className="py-3 px-4">Categoría</th>
                      <th className="py-3 px-4">Precio</th>
                      <th className="py-3 px-4">Stock</th>
                      <th className="py-3 px-4">Rating</th>
                      <th className="py-3 px-4 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {products.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50/70 transition">
                        <td className="py-3 px-4 flex items-center gap-3">
                          <img
                            src={p.imageUrl}
                            alt={p.title}
                            className="w-10 h-10 rounded-lg object-cover bg-slate-100 shrink-0"
                          />
                          <div>
                            <span className="font-semibold text-slate-800 line-clamp-1 block">
                              {p.title}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">ID: {p.id}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-semibold uppercase">
                            {p.category}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-bold text-slate-800">
                          ${p.price.toFixed(2)}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`font-semibold ${
                              p.stock <= 5 ? 'text-amber-600' : 'text-slate-700'
                            }`}
                          >
                            {p.stock} uds.
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1 font-semibold text-slate-700">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            <span>{p.rating || 5.0}</span>
                            <span className="text-[10px] text-slate-400 font-normal">
                              ({p.ratingCount || p.reviews?.length || 0})
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => {
                                setEditingProduct(p);
                                setIsModalOpen(true);
                              }}
                              className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                              title="Editar producto"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(p.id)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                              title="Eliminar producto"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: ORDERS MANAGEMENT */}
          {activeTab === 'orders' && (
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
              <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-bold text-slate-800 text-base">Órdenes de Clientes</h3>
                  <p className="text-xs text-slate-400">Total: {orders.length} pedidos</p>
                </div>

                {/* Filter */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 font-medium">Filtrar por:</span>
                  <select
                    value={orderStatusFilter}
                    onChange={(e) => setOrderStatusFilter(e.target.value as OrderStatus | 'all')}
                    className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="all">Todos los estados</option>
                    <option value="pending">Pendientes</option>
                    <option value="processing">En Proceso</option>
                    <option value="completed">Completadas</option>
                    <option value="cancelled">Canceladas</option>
                  </select>
                </div>
              </div>

              {filteredOrders.length === 0 ? (
                <div className="p-12 text-center text-slate-400 text-xs italic">
                  No se encontraron órdenes con el filtro seleccionado.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 text-[11px] font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                        <th className="py-3 px-4">Orden / Fecha</th>
                        <th className="py-3 px-4">Cliente</th>
                        <th className="py-3 px-4">Items</th>
                        <th className="py-3 px-4">Total</th>
                        <th className="py-3 px-4">Estado</th>
                        <th className="py-3 px-4 text-right">Actualizar Estado</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs">
                      {filteredOrders.map((ord) => (
                        <tr key={ord.id} className="hover:bg-slate-50/70 transition">
                          <td className="py-3 px-4">
                            <span className="font-mono font-bold text-slate-800 block">
                              {ord.id}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              {new Date(ord.createdAt).toLocaleString()}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="font-medium text-slate-800 block">
                              {ord.userEmail}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              {ord.shippingAddress?.city}, {ord.shippingAddress?.country}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="font-semibold text-slate-700">
                              {ord.totalQuantity} items
                            </span>
                            <span className="text-[10px] text-slate-400 block truncate max-w-[150px]">
                              {ord.items.map((i) => `${i.quantity}x ${i.product.title}`).join(', ')}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-bold text-slate-900">
                            ${ord.totalPrice.toFixed(2)}
                          </td>
                          <td className="py-3 px-4">{getStatusBadge(ord.status)}</td>
                          <td className="py-3 px-4 text-right">
                            <select
                              value={ord.status}
                              onChange={(e) =>
                                handleUpdateOrderStatus(ord.id, e.target.value as OrderStatus)
                              }
                              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                              <option value="pending">Pendiente</option>
                              <option value="processing">En Proceso</option>
                              <option value="completed">Completada</option>
                              <option value="cancelled">Cancelada</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* Product Create/Edit Modal with S3 Presigned URL Flow */}
      <AdminProductModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingProduct(null);
        }}
        productToEdit={editingProduct}
        onSuccess={() => {
          setIsModalOpen(false);
          setEditingProduct(null);
          fetchData();
        }}
      />
    </div>
  );
};

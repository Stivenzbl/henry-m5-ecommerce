import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CartProvider, useCart } from '../contexts/CartContext';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import { OrderService } from '../services/orderService';
import { Product } from '../types/product';

// Uses valid catalog product prod-001 (Auriculares Inalámbricos Noise-Cancelling Pro, 189.99, stock: 15)
const catalogProduct: Product = {
  id: 'prod-001',
  title: 'Auriculares Inalámbricos Noise-Cancelling Pro',
  description: 'Sonido de alta definición con cancelación activa de ruido híbrida y batería de 30 horas con carga rápida USB-C.',
  price: 189.99,
  category: 'electronics',
  imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
  stock: 15,
  rating: 4.8,
  ratingCount: 34,
  createdAt: '2026-11-01T10:00:00.000Z',
};

// Test helper component that exercises cart & auth
const ShoppingSimulationComponent: React.FC = () => {
  const { user } = useAuth();
  const { state, addItem, removeItem, clearCart } = useCart();

  return (
    <div>
      <div data-testid="user-role">{user?.role || 'unauthenticated'}</div>
      <div data-testid="user-email">{user?.email || 'none'}</div>
      <div data-testid="cart-count">{state.totalQuantity}</div>
      <div data-testid="cart-total">{state.totalPrice}</div>

      <button onClick={() => addItem(catalogProduct)}>Agregar Producto</button>
      <button onClick={() => removeItem(catalogProduct.id)}>Remover Producto</button>
      <button onClick={() => clearCart()}>Vaciar Carrito</button>
    </div>
  );
};

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <AuthProvider>
      <CartProvider>{ui}</CartProvider>
    </AuthProvider>
  );
};

describe('Full E-Commerce User Flow Integration', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('initializes auth and cart with default empty states', () => {
    renderWithProviders(<ShoppingSimulationComponent />);

    expect(screen.getByTestId('user-role').textContent).toBe('unauthenticated');
    expect(screen.getByTestId('cart-count').textContent).toBe('0');
    expect(screen.getByTestId('cart-total').textContent).toBe('0');
  });

  it('updates cart state correctly when items are added and removed', async () => {
    renderWithProviders(<ShoppingSimulationComponent />);

    const addButton = screen.getByText('Agregar Producto');
    fireEvent.click(addButton);

    // Quantity should be 1, total should be 189.99
    expect(screen.getByTestId('cart-count').textContent).toBe('1');
    expect(screen.getByTestId('cart-total').textContent).toBe('189.99');

    // Add again
    fireEvent.click(addButton);
    expect(screen.getByTestId('cart-count').textContent).toBe('2');
    expect(screen.getByTestId('cart-total').textContent).toBe('379.98');

    // Remove item completely
    const removeButton = screen.getByText('Remover Producto');
    fireEvent.click(removeButton);
    expect(screen.getByTestId('cart-count').textContent).toBe('0');
    expect(screen.getByTestId('cart-total').textContent).toBe('0');
  });

  it('creates an order successfully in OrderService and enforces authoritative pricing', async () => {
    const testUid = 'user-auth-real-999';
    
    // Intentionally send forged price of $0.01 from client
    const order = await OrderService.createOrder({
      userId: testUid,
      userEmail: 'cliente.verificado@patagonix.com',
      items: [{ product: { ...catalogProduct, price: 0.01 }, quantity: 2 }],
      totalPrice: 0.02, // Forged client total
      totalQuantity: 2,
      shippingAddress: {
        street: 'Av. Corrientes 1234',
        city: 'Buenos Aires',
        country: 'Argentina',
        postalCode: 'C1043',
      },
    });

    expect(order.id).toBeDefined();
    expect(order.status).toBe('pending');
    // Price must be authoritative: 189.99 * 2 = 379.98, overriding client forgery of 0.02
    expect(order.totalPrice).toBe(379.98);
    expect(order.items.length).toBe(1);

    // Query orders for user
    const userOrders = await OrderService.getOrdersByUser(testUid);
    expect(userOrders.length).toBeGreaterThanOrEqual(1);
    expect(userOrders[0].id).toBe(order.id);
  });

  it('rejects order creation if product does not exist in catalog', async () => {
    const fakeProduct: Product = {
      id: 'fake-prod-999',
      title: 'Producto Inexistente',
      description: 'Test',
      price: 100,
      category: 'electronics',
      imageUrl: '',
      stock: 5,
      createdAt: '',
    };

    await expect(
      OrderService.createOrder({
        userId: 'usr-1',
        userEmail: 'test@patagonix.com',
        items: [{ product: fakeProduct, quantity: 1 }],
        shippingAddress: { street: 'Main St', city: 'Bogota', country: 'Colombia', postalCode: '110111' },
      })
    ).rejects.toThrow(/no existe en el catálogo/i);
  });

  it('rejects order creation if requested quantity exceeds product stock', async () => {
    await expect(
      OrderService.createOrder({
        userId: 'usr-1',
        userEmail: 'test@patagonix.com',
        items: [{ product: catalogProduct, quantity: 9999 }], // Exceeds stock (15)
        shippingAddress: { street: 'Main St', city: 'Bogota', country: 'Colombia', postalCode: '110111' },
      })
    ).rejects.toThrow(/Stock insuficiente/i);
  });

  it('grants Verified Buyer status ONLY for completed orders (rejects pending/cancelled)', async () => {
    const buyerId = 'verified-buyer-test-uid';

    // 1. Initially, user has no orders -> false
    const initialCheck = await OrderService.hasUserPurchasedProduct(buyerId, catalogProduct.id);
    expect(initialCheck).toBe(false);

    // 2. Create order (starts in 'pending' status)
    const order = await OrderService.createOrder({
      userId: buyerId,
      userEmail: 'buyer@patagonix.com',
      items: [{ product: catalogProduct, quantity: 1 }],
      shippingAddress: { street: 'Calle 100', city: 'Medellín', country: 'Colombia', postalCode: '050021' },
    });

    // 3. Pending order must NOT grant verified buyer badge
    const pendingCheck = await OrderService.hasUserPurchasedProduct(buyerId, catalogProduct.id);
    expect(pendingCheck).toBe(false);

    // 4. Update order to 'processing' -> still must NOT grant verified buyer badge
    await OrderService.updateOrderStatus(order.id, 'processing');
    const processingCheck = await OrderService.hasUserPurchasedProduct(buyerId, catalogProduct.id);
    expect(processingCheck).toBe(false);

    // 5. Update order to 'completed' -> MUST grant verified buyer badge
    await OrderService.updateOrderStatus(order.id, 'completed');
    const completedCheck = await OrderService.hasUserPurchasedProduct(buyerId, catalogProduct.id);
    expect(completedCheck).toBe(true);

    // 6. Update order to 'cancelled' -> MUST NOT grant verified buyer badge
    await OrderService.updateOrderStatus(order.id, 'cancelled');
    const cancelledCheck = await OrderService.hasUserPurchasedProduct(buyerId, catalogProduct.id);
    expect(cancelledCheck).toBe(false);
  });
});

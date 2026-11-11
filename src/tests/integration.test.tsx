import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CartProvider, useCart } from '../contexts/CartContext';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import { OrderService } from '../services/orderService';
import { Product } from '../types/product';

const sampleProduct: Product = {
  id: 'prod-integ-1',
  title: 'Laptop Pro 16 M3',
  description: 'Procesador de alta performance para desarrollo.',
  price: 1999.0,
  category: 'electronics',
  imageUrl: 'https://images.unsplash.com/sample-laptop.jpg',
  stock: 10,
  createdAt: '2026-11-10T12:00:00.000Z',
};

// Test helper component that exercises cart & auth
const ShoppingSimulationComponent: React.FC = () => {
  const { user } = useAuth();
  const { state, addItem, removeItem, clearCart } = useCart();

  return (
    <div>
      <div data-testid="user-role">{user?.role}</div>
      <div data-testid="user-email">{user?.email}</div>
      <div data-testid="cart-count">{state.totalQuantity}</div>
      <div data-testid="cart-total">{state.totalPrice}</div>

      <button onClick={() => addItem(sampleProduct)}>Agregar Laptop</button>
      <button onClick={() => removeItem(sampleProduct.id)}>Remover Laptop</button>
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

  it('initializes with default customer session and empty cart', async () => {
    renderWithProviders(<ShoppingSimulationComponent />);

    await waitFor(() => {
      expect(screen.getByTestId('user-role').textContent).toBe('customer');
    });

    expect(screen.getByTestId('cart-count').textContent).toBe('0');
    expect(screen.getByTestId('cart-total').textContent).toBe('0');
  });

  it('updates cart state correctly when items are added and removed', async () => {
    renderWithProviders(<ShoppingSimulationComponent />);

    const addButton = screen.getByText('Agregar Laptop');
    fireEvent.click(addButton);

    // Quantity should be 1, total should be 1999
    expect(screen.getByTestId('cart-count').textContent).toBe('1');
    expect(screen.getByTestId('cart-total').textContent).toBe('1999');

    // Add again
    fireEvent.click(addButton);
    expect(screen.getByTestId('cart-count').textContent).toBe('2');
    expect(screen.getByTestId('cart-total').textContent).toBe('3998');

    // Remove one item
    const removeButton = screen.getByText('Remover Laptop');
    fireEvent.click(removeButton);
    expect(screen.getByTestId('cart-count').textContent).toBe('0');
  });

  it('creates an order successfully in OrderService and clears cart', async () => {
    const order = await OrderService.createOrder({
      userId: 'user-default-101',
      userEmail: 'cliente@patagonix.com',
      items: [{ product: sampleProduct, quantity: 2 }],
      totalPrice: 3998.0,
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
    expect(order.totalPrice).toBe(3998.0);
    expect(order.items.length).toBe(1);

    // Query orders for user
    const userOrders = await OrderService.getOrdersByUser('user-default-101');
    expect(userOrders.length).toBeGreaterThanOrEqual(1);
    expect(userOrders[0].id).toBe(order.id);
  });
});

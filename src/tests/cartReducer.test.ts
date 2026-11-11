import { describe, it, expect } from 'vitest';
import { cartReducer, initialCartState } from '../contexts/cartReducer';
import { Product } from '../types/product';

const mockProductA: Product = {
  id: 'prod-1',
  title: 'Auriculares Pro',
  description: 'Noise cancelling',
  price: 100.5,
  category: 'electronics',
  imageUrl: 'https://example.com/1.jpg',
  stock: 10,
  createdAt: '2026-01-01',
};

const mockProductB: Product = {
  id: 'prod-2',
  title: 'Zapatillas Runner',
  description: 'Ultralight',
  price: 50.25,
  category: 'footwear',
  imageUrl: 'https://example.com/2.jpg',
  stock: 5,
  createdAt: '2026-01-01',
};

describe('cartReducer Suite (Unit Tests)', () => {
  it('should return initial state when cart is empty', () => {
    expect(initialCartState.items).toEqual([]);
    expect(initialCartState.totalQuantity).toBe(0);
    expect(initialCartState.totalPrice).toBe(0);
  });

  it('should add a new product to the cart and update totals', () => {
    const state = cartReducer(initialCartState, {
      type: 'ADD_ITEM',
      payload: { product: mockProductA, quantity: 1 },
    });

    expect(state.items).toHaveLength(1);
    expect(state.items[0].product.id).toBe('prod-1');
    expect(state.items[0].quantity).toBe(1);
    expect(state.totalQuantity).toBe(1);
    expect(state.totalPrice).toBe(100.5);
  });

  it('should increment quantity if the product is already in the cart', () => {
    let state = cartReducer(initialCartState, {
      type: 'ADD_ITEM',
      payload: { product: mockProductA, quantity: 1 },
    });

    state = cartReducer(state, {
      type: 'ADD_ITEM',
      payload: { product: mockProductA, quantity: 2 },
    });

    expect(state.items).toHaveLength(1);
    expect(state.items[0].quantity).toBe(3);
    expect(state.totalQuantity).toBe(3);
    expect(state.totalPrice).toBe(301.5);
  });

  it('should handle multiple different products with precise decimal totals', () => {
    let state = cartReducer(initialCartState, {
      type: 'ADD_ITEM',
      payload: { product: mockProductA, quantity: 2 }, // 2 * 100.50 = 201.00
    });

    state = cartReducer(state, {
      type: 'ADD_ITEM',
      payload: { product: mockProductB, quantity: 3 }, // 3 * 50.25 = 150.75
    });

    expect(state.items).toHaveLength(2);
    expect(state.totalQuantity).toBe(5);
    expect(state.totalPrice).toBe(351.75);
  });

  it('should update item quantity correctly', () => {
    let state = cartReducer(initialCartState, {
      type: 'ADD_ITEM',
      payload: { product: mockProductA, quantity: 5 },
    });

    state = cartReducer(state, {
      type: 'UPDATE_QUANTITY',
      payload: { productId: 'prod-1', quantity: 2 },
    });

    expect(state.items[0].quantity).toBe(2);
    expect(state.totalQuantity).toBe(2);
    expect(state.totalPrice).toBe(201);
  });

  it('should remove item when quantity is updated to 0 or negative', () => {
    let state = cartReducer(initialCartState, {
      type: 'ADD_ITEM',
      payload: { product: mockProductA, quantity: 2 },
    });

    state = cartReducer(state, {
      type: 'UPDATE_QUANTITY',
      payload: { productId: 'prod-1', quantity: 0 },
    });

    expect(state.items).toHaveLength(0);
    expect(state.totalQuantity).toBe(0);
    expect(state.totalPrice).toBe(0);
  });

  it('should remove specific item with REMOVE_ITEM', () => {
    let state = cartReducer(initialCartState, {
      type: 'ADD_ITEM',
      payload: { product: mockProductA, quantity: 1 },
    });
    state = cartReducer(state, {
      type: 'ADD_ITEM',
      payload: { product: mockProductB, quantity: 1 },
    });

    state = cartReducer(state, {
      type: 'REMOVE_ITEM',
      payload: { productId: 'prod-1' },
    });

    expect(state.items).toHaveLength(1);
    expect(state.items[0].product.id).toBe('prod-2');
    expect(state.totalQuantity).toBe(1);
    expect(state.totalPrice).toBe(50.25);
  });

  it('should clear all items with CLEAR_CART', () => {
    let state = cartReducer(initialCartState, {
      type: 'ADD_ITEM',
      payload: { product: mockProductA, quantity: 3 },
    });

    state = cartReducer(state, { type: 'CLEAR_CART' });

    expect(state.items).toEqual([]);
    expect(state.totalQuantity).toBe(0);
    expect(state.totalPrice).toBe(0);
  });
});

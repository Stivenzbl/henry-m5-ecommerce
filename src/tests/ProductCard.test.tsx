import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ProductCard } from '../components/ProductCard';
import { CartProvider } from '../contexts/CartContext';
import { Product } from '../types/product';

const mockProduct: Product = {
  id: 'prod-test-01',
  title: 'Cámara 4K Mirrorless',
  description: 'Sensor full-frame con grabación 4K a 60fps.',
  price: 899.99,
  category: 'electronics',
  imageUrl: 'https://images.unsplash.com/photo-test.jpg',
  stock: 4, // low stock <= 5
  rating: 4.9,
  ratingCount: 15,
  createdAt: '2026-11-10T12:00:00.000Z',
};

const renderWithCartProvider = (ui: React.ReactElement) => {
  return render(<CartProvider>{ui}</CartProvider>);
};

describe('ProductCard Component', () => {
  it('renders product information correctly', () => {
    renderWithCartProvider(<ProductCard product={mockProduct} />);

    expect(screen.getByText('Cámara 4K Mirrorless')).toBeDefined();
    expect(screen.getByText('Sensor full-frame con grabación 4K a 60fps.')).toBeDefined();
    expect(screen.getByText('$899.99')).toBeDefined();
    expect(screen.getByText('electronics')).toBeDefined();
  });

  it('displays low stock indicator when stock <= 5', () => {
    renderWithCartProvider(<ProductCard product={mockProduct} />);
    expect(screen.getByText('¡Pocas unidades!')).toBeDefined();
  });

  it('displays rating and review count from Extra Credit 3', () => {
    renderWithCartProvider(<ProductCard product={mockProduct} />);
    expect(screen.getByText('4.9')).toBeDefined();
    expect(screen.getByText('(15)')).toBeDefined();
  });

  it('calls onViewDetail callback when card is clicked', () => {
    const handleViewDetail = vi.fn();
    renderWithCartProvider(
      <ProductCard product={mockProduct} onViewDetail={handleViewDetail} />
    );

    const card = screen.getByText('Cámara 4K Mirrorless').closest('.group');
    if (card) {
      fireEvent.click(card);
      expect(handleViewDetail).toHaveBeenCalledWith(mockProduct);
    }
  });

  it('changes button state to "Agregado" when add button is clicked', () => {
    renderWithCartProvider(<ProductCard product={mockProduct} />);

    const addButton = screen.getByRole('button', { name: /agregar/i });
    fireEvent.click(addButton);

    expect(screen.getByText('Agregado')).toBeDefined();
  });
});

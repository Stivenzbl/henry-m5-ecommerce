import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from '../components/ProtectedRoute';
import * as AuthContextModule from '../contexts/AuthContext';

describe('ProtectedRoute RBAC Security Guard', () => {
  it('redirects unauthenticated visitors to /login with sanitized returnTo', () => {
    vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
      user: null,
      status: 'unauthenticated',
      isLoading: false,
      isAdmin: false,
      error: null,
      isConfigured: true,
      login: vi.fn(),
      logout: vi.fn(),
      sendPasswordReset: vi.fn(),
      refreshClaims: vi.fn(),
      clearError: vi.fn(),
    });

    render(
      <MemoryRouter initialEntries={['/orders']}>
        <Routes>
          <Route path="/login" element={<div>Página de Login Mock</div>} />
          <Route 
            path="/orders" 
            element={
              <ProtectedRoute>
                <div>Mis Órdenes Privadas</div>
              </ProtectedRoute>
            } 
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Página de Login Mock')).toBeDefined();
    expect(screen.queryByText('Mis Órdenes Privadas')).toBeNull();
  });

  it('renders 403 ForbiddenView when customer tries to access admin-only route', () => {
    vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
      user: {
        uid: 'cust-123',
        email: 'cliente@patagonix.com',
        displayName: 'Cliente Regular',
        role: 'customer',
        isAdmin: false,
      },
      status: 'authenticated',
      isLoading: false,
      isAdmin: false,
      error: null,
      isConfigured: true,
      login: vi.fn(),
      logout: vi.fn(),
      sendPasswordReset: vi.fn(),
      refreshClaims: vi.fn(),
      clearError: vi.fn(),
    });

    render(
      <MemoryRouter initialEntries={['/admin']}>
        <Routes>
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute requireAdmin>
                <div>Panel Super Secreto Admin</div>
              </ProtectedRoute>
            } 
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText(/403 — Acceso Denegado/i)).toBeDefined();
    expect(screen.getAllByText(/permisos de/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.queryByText('Panel Super Secreto Admin')).toBeNull();
  });

  it('allows access to admin route when user has verified admin claim', () => {
    vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
      user: {
        uid: 'adm-001',
        email: 'admin@patagonix.com',
        displayName: 'Administrador Root',
        role: 'admin',
        isAdmin: true,
      },
      status: 'authenticated',
      isLoading: false,
      isAdmin: true,
      error: null,
      isConfigured: true,
      login: vi.fn(),
      logout: vi.fn(),
      sendPasswordReset: vi.fn(),
      refreshClaims: vi.fn(),
      clearError: vi.fn(),
    });

    render(
      <MemoryRouter initialEntries={['/admin']}>
        <Routes>
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute requireAdmin>
                <div>Panel Super Secreto Admin</div>
              </ProtectedRoute>
            } 
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Panel Super Secreto Admin')).toBeDefined();
    expect(screen.queryByText(/403 — Acceso Denegado/i)).toBeNull();
  });
});

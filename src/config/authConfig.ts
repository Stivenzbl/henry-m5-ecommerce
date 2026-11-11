export const authConfig = {
  enableDemoAccounts: true,
  demoAccounts: {
    customer: {
      email: 'cliente@patagonix.com',
      role: 'customer' as const,
      label: 'Cliente Demo',
      description: 'Navegación completa, carrito, checkout y órdenes personales.',
    },
    admin: {
      email: 'admin@patagonix.com',
      role: 'admin' as const,
      label: 'Admin Demo',
      description: 'Acceso a consola administrativa, S3 presign y métricas de negocio.',
    },
  },
  routes: {
    public: ['/', '/catalog', '/login'],
    customerRequired: ['/orders'],
    adminRequired: ['/admin'],
    defaultRedirectAfterLogin: '/',
    defaultRedirectAfterLogout: '/',
  },
} as const;

export const appConfig = {
  brandName: 'Patagonix Retail',
  brandShort: 'Patagonix',
  tagline: 'AI-Driven E-Commerce SPA',
  version: '2.0.0',
  locale: 'es-CO',
  currency: 'USD',
  currencySymbol: '$',
  supportEmail: 'soporte@patagonix.com',
  routes: {
    home: '/',
    catalog: '/catalog',
    login: '/login',
    orders: '/orders',
    admin: '/admin',
  },
} as const;

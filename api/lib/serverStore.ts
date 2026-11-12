import { Product, Review } from '../../src/types/product';
import { Order } from '../../src/types/order';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-001',
    title: 'Auriculares Inalámbricos Noise-Cancelling Pro',
    description: 'Sonido de alta definición con cancelación activa de ruido híbrida y batería de 30 horas con carga rápida USB-C.',
    price: 189.99,
    category: 'electronics',
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
    stock: 15,
    rating: 4.8,
    ratingCount: 34,
    reviews: [
      {
        id: 'rev-01',
        productId: 'prod-001',
        userId: 'usr-1',
        userName: 'Carlos Méndez',
        rating: 5,
        comment: 'Excelente cancelación de ruido. Los uso para trabajar a diario y la batería dura casi una semana.',
        createdAt: '2026-11-01T14:30:00.000Z',
        isVerifiedBuyer: true,
      },
      {
        id: 'rev-02',
        productId: 'prod-001',
        userId: 'usr-2',
        userName: 'Lucía Torres',
        rating: 4,
        comment: 'Muy cómodos y el audio es nítido. Podrían tener una app móvil con más ecualizaciones pero van genial.',
        createdAt: '2026-11-04T09:15:00.000Z',
        isVerifiedBuyer: true,
      },
    ],
    createdAt: '2026-11-01T10:00:00.000Z',
  },
  {
    id: 'prod-002',
    title: 'Zapatillas Running Ultralight Carbon',
    description: 'Amortiguación reactiva con placa de fibra de carbono para propulsión y rendimiento en maratón o asfalto.',
    price: 145.5,
    category: 'footwear',
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80',
    stock: 8,
    rating: 4.9,
    ratingCount: 28,
    reviews: [
      {
        id: 'rev-03',
        productId: 'prod-002',
        userId: 'usr-3',
        userName: 'Marcos Benítez',
        rating: 5,
        comment: 'Una maravilla para fondos largos. La respuesta de la placa de carbono se siente en cada zancada.',
        createdAt: '2026-10-28T18:20:00.000Z',
        isVerifiedBuyer: true,
      },
    ],
    createdAt: '2026-11-02T11:00:00.000Z',
  },
  {
    id: 'prod-003',
    title: 'Reloj Smartwatch GPS Titanium Edition',
    description: 'Monitoreo de frecuencia cardíaca, oxigenación en sangre, altímetro barométrico y resistencia al agua 50m.',
    price: 299.0,
    category: 'accessories',
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
    stock: 12,
    rating: 4.7,
    ratingCount: 19,
    reviews: [],
    createdAt: '2026-11-03T09:00:00.000Z',
  },
  {
    id: 'prod-004',
    title: 'Cafetera Espresso Barista Touch',
    description: 'Bomba italiana de 15 bares, molinillo integrado cónico de acero inoxidable y vaporizador manual para latte art.',
    price: 349.99,
    category: 'home',
    imageUrl: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=600&auto=format&fit=crop&q=80',
    stock: 5,
    rating: 4.9,
    ratingCount: 42,
    reviews: [],
    createdAt: '2026-11-04T14:00:00.000Z',
  },
  {
    id: 'prod-005',
    title: 'Teclado Mecánico RGB Switch Óptico',
    description: 'Switches lineales de activación inmediata, chasis de aluminio aeroespacial y teclas PBT de doble inyección.',
    price: 99.99,
    category: 'electronics',
    imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80',
    stock: 20,
    rating: 4.6,
    ratingCount: 15,
    reviews: [],
    createdAt: '2026-11-05T08:00:00.000Z',
  },
  {
    id: 'prod-006',
    title: 'Mochila Urbana Impermeable Antirrobo',
    description: 'Compartimento acolchado para laptop de 16", puerto USB integrado y cremalleras ocultas repelentes al agua.',
    price: 68.0,
    category: 'accessories',
    imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80',
    stock: 18,
    rating: 4.8,
    ratingCount: 31,
    reviews: [],
    createdAt: '2026-11-06T15:00:00.000Z',
  },
  {
    id: 'prod-007',
    title: 'Lámpara LED Inteligente de Escritorio',
    description: 'Control de temperatura de color, sensor de brillo ambiental automático y base de carga inalámbrica Qi de 15W.',
    price: 54.9,
    category: 'home',
    imageUrl: 'https://images.unsplash.com/photo-1534972195531-a756b1126f24?w=600&auto=format&fit=crop&q=80',
    stock: 25,
    rating: 4.5,
    ratingCount: 12,
    reviews: [],
    createdAt: '2026-11-07T13:00:00.000Z',
  },
  {
    id: 'prod-008',
    title: 'Bota Trekking Gore-Tex All-Terrain',
    description: 'Membrana impermeable transpirable, suela Vibram antideslizante y puntera reforzada para senderismo de montaña.',
    price: 179.0,
    category: 'footwear',
    imageUrl: 'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=600&auto=format&fit=crop&q=80',
    stock: 7,
    rating: 4.9,
    ratingCount: 22,
    reviews: [],
    createdAt: '2026-11-08T16:00:00.000Z',
  },
];

// In-memory authoritative store for server execution & tests
let serverProducts: Product[] = JSON.parse(JSON.stringify(INITIAL_PRODUCTS));
let serverOrders: Order[] = [];

export function resetServerStore() {
  serverProducts = JSON.parse(JSON.stringify(INITIAL_PRODUCTS));
  serverOrders = [];
}

export async function getAuthoritativeProduct(id: string): Promise<Product | null> {
  const product = serverProducts.find(p => p.id === id);
  return product ? { ...product } : null;
}

export async function reserveProductStock(
  productId: string,
  quantity: number
): Promise<{ success: boolean; remainingStock: number; error?: string }> {
  const index = serverProducts.findIndex(p => p.id === productId);
  if (index === -1) {
    return { success: false, remainingStock: 0, error: `Producto ${productId} no existe en el catálogo.` };
  }
  const product = serverProducts[index];
  if (product.stock < quantity) {
    return {
      success: false,
      remainingStock: product.stock,
      error: `Stock insuficiente para "${product.title}". Disponible: ${product.stock}, Solicitado: ${quantity}.`,
    };
  }

  // Atomic reservation / decrement
  product.stock -= quantity;
  return { success: true, remainingStock: product.stock };
}

export async function rollbackProductStock(productId: string, quantity: number): Promise<void> {
  const index = serverProducts.findIndex(p => p.id === productId);
  if (index !== -1) {
    serverProducts[index].stock += quantity;
  }
}

export async function saveAuthoritativeOrder(order: Order): Promise<Order> {
  serverOrders.unshift({ ...order });
  return { ...order };
}

export async function getAuthoritativeOrdersByUser(userId: string): Promise<Order[]> {
  return serverOrders.filter(o => o.userId === userId).map(o => ({ ...o }));
}

export async function updateAuthoritativeOrderStatus(
  orderId: string,
  newStatus: Order['status']
): Promise<Order | null> {
  const index = serverOrders.findIndex(o => o.id === orderId);
  if (index === -1) return null;
  serverOrders[index].status = newStatus;
  return { ...serverOrders[index] };
}

export async function hasAuthoritativeCompletedOrder(userId: string, productId: string): Promise<boolean> {
  return serverOrders.some(
    o => o.userId === userId && o.status === 'completed' && o.items.some(i => i.product.id === productId)
  );
}

export async function addAuthoritativeReview(
  productId: string,
  review: Review
): Promise<Product> {
  const index = serverProducts.findIndex(p => p.id === productId);
  if (index === -1) {
    throw new Error(`Producto ${productId} no encontrado`);
  }

  const product = serverProducts[index];
  const reviews = [review, ...(product.reviews || [])];
  const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
  const avgRating = Number((totalRating / reviews.length).toFixed(1));

  product.reviews = reviews;
  product.rating = avgRating;
  product.ratingCount = reviews.length;

  return { ...product };
}

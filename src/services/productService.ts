import { Product, ProductCategory, Review } from '../types/product';

const INITIAL_PRODUCTS: Product[] = [
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
      },
      {
        id: 'rev-02',
        productId: 'prod-001',
        userId: 'usr-2',
        userName: 'Lucía Torres',
        rating: 4,
        comment: 'Muy cómodos y el audio es nítido. Podrían tener una app móvil con más ecualizaciones pero van genial.',
        createdAt: '2026-11-04T09:15:00.000Z',
      },
    ],
    createdAt: new Date().toISOString(),
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
      },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'prod-003',
    title: 'Smartwatch Fitness AMOLED Titanio',
    description: 'Monitoreo de frecuencia cardíaca, SpO2, GPS dual integrado, 120 modos deportivos y resistencia al agua 50m.',
    price: 219.0,
    category: 'electronics',
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
    stock: 22,
    rating: 4.7,
    ratingCount: 19,
    reviews: [
      {
        id: 'rev-04',
        productId: 'prod-003',
        userId: 'usr-4',
        userName: 'Andrea Rivas',
        rating: 5,
        comment: 'La pantalla AMOLED brilla perfecto incluso bajo sol directo. Súper elegante.',
        createdAt: '2026-11-02T11:45:00.000Z',
      },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'prod-004',
    title: 'Mochila Urbana Ergonómica Impermeable',
    description: 'Compartimento acolchado para laptop de 16", puerto USB de carga exterior y tela cordura repelente al agua.',
    price: 64.99,
    category: 'accessories',
    imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80',
    stock: 30,
    rating: 4.6,
    ratingCount: 42,
    reviews: [
      {
        id: 'rev-05',
        productId: 'prod-004',
        userId: 'usr-5',
        userName: 'Diego Castro',
        rating: 4,
        comment: 'Muy espaciosa y bien distribuida. Las costuras son resistentes.',
        createdAt: '2026-10-15T16:00:00.000Z',
      },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'prod-005',
    title: 'Lámpara de Escritorio LED con Carga Qi',
    description: 'Control táctil de temperatura de color (3000K-6000K), dimmer continuo y base de carga rápida inalámbrica de 15W.',
    price: 49.9,
    category: 'home',
    imageUrl: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&auto=format&fit=crop&q=80',
    stock: 12,
    rating: 4.5,
    ratingCount: 15,
    reviews: [],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'prod-006',
    title: 'Teclado Mecánico Custom 75% Wireless',
    description: 'Switches lineales lubricados de fábrica, keycaps PBT dye-sub, conectividad Bluetooth 5.2 / 2.4GHz / Type-C.',
    price: 129.0,
    category: 'electronics',
    imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80',
    stock: 6,
    rating: 4.9,
    ratingCount: 51,
    reviews: [
      {
        id: 'rev-06',
        productId: 'prod-006',
        userId: 'usr-6',
        userName: 'Valeria Solís',
        rating: 5,
        comment: 'El sonido thock es espectacular directamente de caja. No tuve que modificar nada.',
        createdAt: '2026-11-06T20:10:00.000Z',
      },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'prod-007',
    title: 'Botella Térmica Acero Inoxidable 1L',
    description: 'Aislamiento al vacío de doble pared. Mantiene bebidas frías por 24 horas y calientes por 12 horas. Libre de BPA.',
    price: 28.5,
    category: 'accessories',
    imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&auto=format&fit=crop&q=80',
    stock: 45,
    rating: 4.7,
    ratingCount: 23,
    reviews: [],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'prod-008',
    title: 'Zapatillas Urban Casual Minimalist',
    description: 'Cuero sintético ecológico premium, suela cosida antideslizante y plantilla viscoelástica para confort diario.',
    price: 89.0,
    category: 'footwear',
    imageUrl: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=600&auto=format&fit=crop&q=80',
    stock: 18,
    rating: 4.6,
    ratingCount: 17,
    reviews: [],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'prod-009',
    title: 'Cafetera Prensa Francesa Vidrio Borosilicato',
    description: 'Capacidad 800ml con filtro de acero inoxidable de cuatro niveles. Máxima extracción aromática.',
    price: 36.0,
    category: 'home',
    imageUrl: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=600&auto=format&fit=crop&q=80',
    stock: 20,
    rating: 4.8,
    ratingCount: 29,
    reviews: [],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'prod-010',
    title: 'Mouse Ergonómico Vertical Inalámbrico',
    description: 'Diseño para reducir la tensión muscular de la muñeca. Sensor óptico de 4000 DPI con batería recargable.',
    price: 45.0,
    category: 'electronics',
    imageUrl: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&auto=format&fit=crop&q=80',
    stock: 14,
    rating: 4.4,
    ratingCount: 12,
    reviews: [],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'prod-011',
    title: 'Gafas de Sol Polarizadas UV400 Wayfarer',
    description: 'Montura de acetato ligero italiano y cristales polarizados de alta definición con protección anti-reflejo.',
    price: 55.0,
    category: 'accessories',
    imageUrl: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&auto=format&fit=crop&q=80',
    stock: 25,
    rating: 4.8,
    ratingCount: 31,
    reviews: [],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'prod-012',
    title: 'Difusor de Aromas Ultrasónico Madera Zen',
    description: 'Capacidad 500ml, 7 luces LED ambientales, apagado automático sin agua y funcionamiento ultrasilencioso.',
    price: 39.5,
    category: 'home',
    imageUrl: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=600&auto=format&fit=crop&q=80',
    stock: 16,
    rating: 4.7,
    ratingCount: 22,
    reviews: [],
    createdAt: new Date().toISOString(),
  },
];

const PRODUCTS_STORAGE_KEY = 'patagonix_products_v2';

export class ProductService {
  private static getStoredProducts(): Product[] {
    try {
      const stored = localStorage.getItem(PRODUCTS_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored) as Product[];
      }
    } catch (e) {
      console.warn('Error reading products from storage:', e);
    }
    // Seed initial products
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(INITIAL_PRODUCTS));
    return INITIAL_PRODUCTS;
  }

  private static saveProducts(products: Product[]): void {
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
  }

  static async getAll(): Promise<Product[]> {
    // Simulate network delay for realistic skeletons and loading states
    await new Promise(resolve => setTimeout(resolve, 200));
    return this.getStoredProducts();
  }

  static async getById(id: string): Promise<Product | null> {
    const products = await this.getAll();
    return products.find(p => p.id === id) || null;
  }

  static async getByCategory(category?: ProductCategory | 'all'): Promise<Product[]> {
    const products = await this.getAll();
    if (!category || category === 'all') {
      return products;
    }
    return products.filter(p => p.category === category);
  }

  static async create(data: Omit<Product, 'id' | 'createdAt'>): Promise<Product> {
    const products = this.getStoredProducts();
    const newProduct: Product = {
      ...data,
      id: `prod-${Date.now()}`,
      rating: 5.0,
      ratingCount: 0,
      reviews: [],
      createdAt: new Date().toISOString(),
    };
    products.unshift(newProduct);
    this.saveProducts(products);
    return newProduct;
  }

  static async update(id: string, updates: Partial<Product>): Promise<Product> {
    const products = this.getStoredProducts();
    const index = products.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error(`Product with ID ${id} not found`);
    }
    products[index] = { ...products[index], ...updates };
    this.saveProducts(products);
    return products[index];
  }

  static async delete(id: string): Promise<void> {
    const products = this.getStoredProducts();
    const filtered = products.filter(p => p.id !== id);
    this.saveProducts(filtered);
  }

  static async addReview(
    productId: string,
    reviewData: { userId: string; userName: string; rating: number; comment: string }
  ): Promise<Product> {
    const products = this.getStoredProducts();
    const index = products.findIndex(p => p.id === productId);
    if (index === -1) {
      throw new Error(`Product with ID ${productId} not found`);
    }

    const target = products[index];
    const newReview: Review = {
      id: `rev-${Date.now()}`,
      productId,
      userId: reviewData.userId,
      userName: reviewData.userName,
      rating: Math.max(1, Math.min(5, reviewData.rating)),
      comment: reviewData.comment,
      createdAt: new Date().toISOString(),
    };

    const currentReviews = target.reviews || [];
    const updatedReviews = [newReview, ...currentReviews];
    const totalRating = updatedReviews.reduce((sum, r) => sum + r.rating, 0);
    const avgRating = Number((totalRating / updatedReviews.length).toFixed(1));

    products[index] = {
      ...target,
      reviews: updatedReviews,
      rating: avgRating,
      ratingCount: updatedReviews.length,
    };

    this.saveProducts(products);
    return products[index];
  }
}

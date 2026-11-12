import { Product, ProductCategory, Review } from '../types/product';
import { db, isFirebaseConfigured, auth } from '../lib/firebase';
import { OrderService } from './orderService';
import {
  collection,
  getDocs,
  getDoc,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  setDoc,
} from 'firebase/firestore';

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
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(INITIAL_PRODUCTS));
    return INITIAL_PRODUCTS;
  }

  private static saveProducts(products: Product[]): void {
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
  }

  static async getAll(): Promise<Product[]> {
    if (isFirebaseConfigured && db) {
      try {
        const colRef = collection(db, 'products');
        const snapshot = await getDocs(colRef);
        if (!snapshot.empty) {
          return snapshot.docs.map(d => ({
            id: d.id,
            ...d.data(),
          } as Product));
        } else {
          // Seed Firestore with initial catalogue
          for (const prod of INITIAL_PRODUCTS) {
            const { id, ...data } = prod;
            await setDoc(doc(db, 'products', id), data);
          }
          return INITIAL_PRODUCTS;
        }
      } catch (err) {
        console.error('Error fetching products from Firestore, falling back to local:', err);
      }
    }

    return this.getStoredProducts();
  }

  static async getById(id: string): Promise<Product | null> {
    if (isFirebaseConfigured && db) {
      try {
        const docRef = doc(db, 'products', id);
        const snapshot = await getDoc(docRef);
        if (snapshot.exists()) {
          return { id: snapshot.id, ...snapshot.data() } as Product;
        }
      } catch (err) {
        console.error('Error fetching product by ID from Firestore:', err);
      }
    }

    const products = await this.getAll();
    return products.find(p => p.id === id) || null;
  }

  static async getByCategory(category?: ProductCategory | 'all'): Promise<Product[]> {
    if (isFirebaseConfigured && db && category && category !== 'all') {
      try {
        const q = query(collection(db, 'products'), where('category', '==', category));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Product));
      } catch (err) {
        console.error('Error fetching products by category from Firestore:', err);
      }
    }

    const products = await this.getAll();
    if (!category || category === 'all') {
      return products;
    }
    return products.filter(p => p.category === category);
  }

  static async create(data: Omit<Product, 'id' | 'createdAt'>): Promise<Product> {
    const newProductData = {
      ...data,
      rating: 5.0,
      ratingCount: 0,
      reviews: [],
      createdAt: new Date().toISOString(),
    };

    if (isFirebaseConfigured && db) {
      try {
        const docRef = await addDoc(collection(db, 'products'), newProductData);
        return {
          id: docRef.id,
          ...newProductData,
        };
      } catch (err) {
        console.error('Error creating product in Firestore:', err);
      }
    }

    const products = this.getStoredProducts();
    const newProduct: Product = {
      id: `prod-${Date.now()}`,
      ...newProductData,
    };
    products.unshift(newProduct);
    this.saveProducts(products);
    return newProduct;
  }

  static async update(id: string, updates: Partial<Product>): Promise<Product> {
    if (isFirebaseConfigured && db) {
      try {
        const docRef = doc(db, 'products', id);
        await updateDoc(docRef, {
          ...updates,
          updatedAt: new Date().toISOString(),
        });
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          return { id: snap.id, ...snap.data() } as Product;
        }
      } catch (err) {
        console.error('Error updating product in Firestore:', err);
      }
    }

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
    if (isFirebaseConfigured && db) {
      try {
        await deleteDoc(doc(db, 'products', id));
        return;
      } catch (err) {
        console.error('Error deleting product from Firestore:', err);
      }
    }

    const products = this.getStoredProducts();
    const filtered = products.filter(p => p.id !== id);
    this.saveProducts(filtered);
  }

  static async addReview(
    productId: string,
    reviewData: { userId: string; userName: string; rating: number; comment: string }
  ): Promise<Product> {
    // 1. Authoritative Backend Endpoint: POST /api/reviews
    try {
      if (typeof window !== 'undefined' && typeof window.fetch === 'function') {
        const token = await auth?.currentUser?.getIdToken().catch(() => null);
        if (token) {
          const res = await fetch('/api/reviews', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
              productId,
              rating: reviewData.rating,
              comment: reviewData.comment,
              userName: reviewData.userName,
            }),
          });

          if (res.ok) {
            const data = await res.json();
            return data.product;
          } else {
            const errBody = await res.json().catch(() => ({}));
            throw new Error(errBody.error || 'Fallo al publicar la reseña en el servidor.');
          }
        }
      }
    } catch (netErr: any) {
      if (netErr.message && !netErr.message.includes('Failed to fetch') && !netErr.message.includes('fetch is not defined')) {
        throw netErr;
      }
    }

    // 2. Local fallback calculation (offline development & testing)
    const isVerifiedBuyer = await OrderService.hasUserPurchasedProduct(
      reviewData.userId,
      productId
    );

    const newReview: Review = {
      id: `rev-${Date.now()}`,
      productId,
      userId: reviewData.userId,
      userName: reviewData.userName,
      rating: Math.max(1, Math.min(5, reviewData.rating)),
      comment: reviewData.comment,
      createdAt: new Date().toISOString(),
      isVerifiedBuyer,
    };

    const currentProduct = await this.getById(productId);
    if (!currentProduct) {
      throw new Error(`Product with ID ${productId} not found`);
    }

    const currentReviews = currentProduct.reviews || [];
    const updatedReviews = [newReview, ...currentReviews];
    const totalRating = updatedReviews.reduce((sum, r) => sum + r.rating, 0);
    const avgRating = Number((totalRating / updatedReviews.length).toFixed(1));

    const updates = {
      reviews: updatedReviews,
      rating: avgRating,
      ratingCount: updatedReviews.length,
    };

    return this.update(productId, updates);
  }
}

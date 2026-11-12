import { Order, OrderStatus } from '../types/order';
import { CartItem } from '../types/cart';
import { db, isFirebaseConfigured } from '../lib/firebase';
import { ProductService } from './productService';
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  query, 
  where, 
  orderBy,
  getDoc
} from 'firebase/firestore';

const ORDERS_STORAGE_KEY = 'patagonix_orders_v1';

export class OrderService {
  private static getStoredOrders(): Order[] {
    try {
      const stored = localStorage.getItem(ORDERS_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored) as Order[];
      }
    } catch (e) {
      console.warn('Error reading orders from storage:', e);
    }
    return [];
  }

  private static saveOrders(orders: Order[]): void {
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
  }

  /**
   * Creates an order with strict server-side price and stock validation.
   * Total price is computed authoritatively from catalogue data, never blindly trusting client.
   */
  static async createOrder(params: {
    userId: string;
    userEmail: string;
    items: CartItem[];
    totalPrice?: number;
    totalQuantity?: number;
    shippingAddress: {
      street: string;
      city: string;
      country: string;
      postalCode: string;
    };
  }): Promise<Order> {
    if (!params.userId || !params.userEmail) {
      throw new Error('Identidad de usuario requerida para registrar la orden.');
    }

    if (!params.items || params.items.length === 0) {
      throw new Error('No se puede crear una orden con el carrito vacío.');
    }

    if (!params.shippingAddress || !params.shippingAddress.street || !params.shippingAddress.city) {
      throw new Error('Dirección de envío completa es requerida.');
    }

    // Authoritative calculation & stock verification from catalogue
    const verifiedItems: CartItem[] = [];
    let calculatedTotalPrice = 0;
    let calculatedTotalQuantity = 0;

    for (const item of params.items) {
      if (!item.product || !item.product.id) {
        throw new Error('Producto inválido en el carrito.');
      }
      if (!item.quantity || item.quantity <= 0) {
        throw new Error(`Cantidad inválida (${item.quantity}) para producto ${item.product.id}.`);
      }

      const authoritativeProduct = await ProductService.getById(item.product.id);
      if (!authoritativeProduct) {
        throw new Error(`El producto ${item.product.title || item.product.id} no existe en el catálogo.`);
      }

      if (authoritativeProduct.stock < item.quantity) {
        throw new Error(
          `Stock insuficiente para "${authoritativeProduct.title}". Disponible: ${authoritativeProduct.stock}, Solicitado: ${item.quantity}.`
        );
      }

      const authoritativePrice = Number(authoritativeProduct.price);
      if (isNaN(authoritativePrice) || authoritativePrice <= 0) {
        throw new Error(`Precio inválido en catálogo para producto ${authoritativeProduct.id}.`);
      }

      verifiedItems.push({
        product: {
          ...authoritativeProduct,
          price: authoritativePrice,
        },
        quantity: item.quantity,
      });

      calculatedTotalPrice += authoritativePrice * item.quantity;
      calculatedTotalQuantity += item.quantity;
    }

    // Ensure round to 2 decimals
    calculatedTotalPrice = Math.round(calculatedTotalPrice * 100) / 100;

    const newOrderData = {
      userId: params.userId,
      userEmail: params.userEmail,
      items: verifiedItems,
      totalPrice: calculatedTotalPrice,
      totalQuantity: calculatedTotalQuantity,
      status: 'pending' as OrderStatus,
      shippingAddress: params.shippingAddress,
      createdAt: new Date().toISOString(),
    };

    // If Firebase is configured, persist to Firestore with fail-closed guarantee
    if (isFirebaseConfigured && db) {
      try {
        const docRef = await addDoc(collection(db, 'orders'), newOrderData);
        return {
          id: docRef.id,
          ...newOrderData,
        };
      } catch (err: any) {
        console.error('Error writing order to Firestore:', err);
        throw new Error(`Fallo de persistencia en base de datos de órdenes: ${err?.message || 'Error desconocido'}`);
      }
    }

    // Local / Dev emulator fallback (only active when Firebase credentials are not configured)
    const orders = this.getStoredOrders();
    const localOrder: Order = {
      id: `ord-${Date.now()}`,
      ...newOrderData,
    };
    orders.unshift(localOrder);
    this.saveOrders(orders);
    return localOrder;
  }

  static async getOrdersByUser(userId: string): Promise<Order[]> {
    if (isFirebaseConfigured && db) {
      try {
        const q = query(
          collection(db, 'orders'), 
          where('userId', '==', userId),
          orderBy('createdAt', 'desc')
        );
        const snapshot = await getDocs(q);
        return snapshot.docs.map(d => ({
          id: d.id,
          ...d.data(),
        } as Order));
      } catch (err) {
        console.error('Error reading user orders from Firestore:', err);
        throw new Error('No fue posible consultar las órdenes del usuario desde el servidor.');
      }
    }

    const orders = this.getStoredOrders();
    return orders.filter(o => o.userId === userId);
  }

  static async getAllOrders(): Promise<Order[]> {
    if (isFirebaseConfigured && db) {
      try {
        const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(d => ({
          id: d.id,
          ...d.data(),
        } as Order));
      } catch (err) {
        console.error('Error reading all orders from Firestore:', err);
        throw new Error('No fue posible consultar todas las órdenes desde el servidor.');
      }
    }

    return this.getStoredOrders();
  }

  static async updateOrderStatus(orderId: string, status: OrderStatus): Promise<Order> {
    if (isFirebaseConfigured && db) {
      try {
        const orderRef = doc(db, 'orders', orderId);
        await updateDoc(orderRef, { status, updatedAt: new Date().toISOString() });
        const snapshot = await getDoc(orderRef);
        if (snapshot.exists()) {
          return { id: snapshot.id, ...snapshot.data() } as Order;
        }
      } catch (err) {
        console.error('Error updating order status in Firestore:', err);
        throw new Error(`No fue posible actualizar el estado de la orden ${orderId} en el servidor.`);
      }
    }

    const orders = this.getStoredOrders();
    const index = orders.findIndex(o => o.id === orderId);
    if (index === -1) {
      throw new Error(`Order ${orderId} not found`);
    }
    const updated = { ...orders[index], status };
    orders[index] = updated;
    this.saveOrders(orders);
    return updated;
  }

  /**
   * Verifies if a user has genuinely purchased a product with COMPLETED order status.
   * Enforces that pending, processing, cancelled or fake local orders do NOT grant verified status.
   */
  static async hasUserPurchasedProduct(userId: string, productId: string): Promise<boolean> {
    if (!userId || !productId) return false;

    if (isFirebaseConfigured && db) {
      try {
        const q = query(
          collection(db, 'orders'),
          where('userId', '==', userId),
          where('status', '==', 'completed')
        );
        const snapshot = await getDocs(q);
        const completedOrders = snapshot.docs.map(d => d.data() as Order);
        return completedOrders.some(order =>
          order.items && order.items.some(item => item.product?.id === productId)
        );
      } catch (err) {
        console.error('Error verifying completed purchases in Firestore:', err);
        return false;
      }
    }

    // Fallback mode for local dev without Firebase
    const orders = this.getStoredOrders();
    const userCompletedOrders = orders.filter(
      o => o.userId === userId && o.status === 'completed'
    );
    return userCompletedOrders.some(order => 
      order.items && order.items.some(item => item.product?.id === productId)
    );
  }
}

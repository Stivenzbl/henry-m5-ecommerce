import { Order, OrderStatus } from '../types/order';
import { CartItem } from '../types/cart';
import { db, isFirebaseConfigured } from '../lib/firebase';
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

  static async createOrder(params: {
    userId: string;
    userEmail: string;
    items: CartItem[];
    totalPrice: number;
    totalQuantity: number;
    shippingAddress: {
      street: string;
      city: string;
      country: string;
      postalCode: string;
    };
  }): Promise<Order> {
    const newOrderData = {
      userId: params.userId,
      userEmail: params.userEmail,
      items: params.items,
      totalPrice: params.totalPrice,
      totalQuantity: params.totalQuantity,
      status: 'pending' as OrderStatus,
      shippingAddress: params.shippingAddress,
      createdAt: new Date().toISOString(),
    };

    if (isFirebaseConfigured && db) {
      try {
        const docRef = await addDoc(collection(db, 'orders'), newOrderData);
        return {
          id: docRef.id,
          ...newOrderData,
        };
      } catch (err) {
        console.error('Error writing order to Firestore, falling back to local:', err);
      }
    }

    // Local / Emulator fallback
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
        console.error('Error reading user orders from Firestore, falling back to local:', err);
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
        console.error('Error reading all orders from Firestore, falling back to local:', err);
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
        console.error('Error updating order status in Firestore, falling back to local:', err);
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
   * Verifies if a user has genuinely purchased a product
   * Used to substantiate the "Verified Buyer" badge in product reviews
   */
  static async hasUserPurchasedProduct(userId: string, productId: string): Promise<boolean> {
    if (!userId || !productId) return false;
    const userOrders = await this.getOrdersByUser(userId);
    return userOrders.some(order => 
      order.items && order.items.some(item => item.product?.id === productId)
    );
  }
}

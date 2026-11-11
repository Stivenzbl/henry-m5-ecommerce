import { Order, OrderStatus } from '../types/order';
import { CartItem } from '../types/cart';

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
    await new Promise(resolve => setTimeout(resolve, 300));
    const orders = this.getStoredOrders();
    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      userId: params.userId,
      userEmail: params.userEmail,
      items: params.items,
      totalPrice: params.totalPrice,
      totalQuantity: params.totalQuantity,
      status: 'pending',
      shippingAddress: params.shippingAddress,
      createdAt: new Date().toISOString(),
    };
    orders.unshift(newOrder);
    this.saveOrders(orders);
    return newOrder;
  }

  static async getOrdersByUser(userId: string): Promise<Order[]> {
    await new Promise(resolve => setTimeout(resolve, 150));
    const orders = this.getStoredOrders();
    return orders.filter(o => o.userId === userId);
  }

  static async getAllOrders(): Promise<Order[]> {
    await new Promise(resolve => setTimeout(resolve, 150));
    return this.getStoredOrders();
  }

  static async updateOrderStatus(orderId: string, status: OrderStatus): Promise<Order> {
    const orders = this.getStoredOrders();
    const index = orders.findIndex(o => o.id === orderId);
    if (index === -1) {
      throw new Error(`Order ${orderId} not found`);
    }
    orders[index] = { ...orders[index], status };
    this.saveOrders(orders);
    return orders[index];
  }
}

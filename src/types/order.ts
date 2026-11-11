import { CartItem } from './cart';

export type OrderStatus = 'pending' | 'processing' | 'completed' | 'cancelled';

export interface Order {
  id: string;
  userId: string;
  userEmail: string;
  items: CartItem[];
  totalPrice: number;
  totalQuantity: number;
  status: OrderStatus;
  shippingAddress: {
    street: string;
    city: string;
    country: string;
    postalCode: string;
  };
  createdAt: string;
}

export type ProductCategory = 'electronics' | 'footwear' | 'accessories' | 'home';

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number; // 1 to 5
  comment: string;
  createdAt: string;
  isVerifiedBuyer?: boolean;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  category: ProductCategory;
  imageUrl: string;
  stock: number;
  rating?: number;
  ratingCount?: number;
  reviews?: Review[];
  createdAt: string;
}

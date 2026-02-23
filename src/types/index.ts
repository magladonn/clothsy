export interface Product {
  id: string;
  code: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  sizes: string[];
  colors: string[];
  images: string[];
  model3d?: string;
  category: 'mens' | 'womens' | 'accessories';
  inStock: boolean;
  visible: boolean;
  createdAt: string;
}

export interface Order {
  id: string;
  productId: string;
  productCode: string;
  productName: string;
  productImage: string;
  productPrice: number;
  size: string;
  color: string;
  quantity: number;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerAddress: string;
  customerCity: string;
  notes: string;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
}

export interface Subscriber {
  id: string;
  email: string;
  subscribedAt: string;
}

export interface SiteStats {
  totalVisits: number;
  totalOrders: number;
  totalProducts: number;
  totalSubscribers: number;
  ordersByStatus: Record<string, number>;
  visitsByDate: { date: string; visits: number }[];
  ordersByDate: { date: string; orders: number }[];
}

export interface AdminUser {
  username: string;
  password: string;
}

export type View = 'home' | 'products' | 'product-detail' | 'contact' | 'confirmation' | 'admin' | 'admin-products' | 'admin-orders' | 'admin-subscribers' | 'admin-stats';

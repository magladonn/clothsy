import { createClient } from '@supabase/supabase-js';
import type { Product, Order, Subscriber, SiteStats, AdminUser } from '@/types';

// ✅ 1. ADDED: EmailJS Configuration (Required for Contact Page)
export const EMAILJS_CONFIG = {
  SERVICE_ID: 'service_clothsy',   // Replace with your real EmailJS Service ID
  TEMPLATE_ID: 'template_contact', // Replace with your real EmailJS Template ID
  PUBLIC_KEY: 'user_public_key'    // Replace with your real EmailJS Public Key
};

// ✅ 2. MOROCCAN CITIES (Required for Checkout)
export const MOROCCAN_CITIES = [
  "Casablanca", "Rabat", "Marrakech", "Fes", "Tangier",
  "Agadir", "Meknes", "Oujda", "Kenitra", "Tetouan",
  "Safi", "Mohammedia", "Beni Mellal", "Khouribga", "El Jadida",
  "Nador", "Taza", "Settat", "Berrechid", "Khemisset",
  "Laayoune", "Dakhla", "Errachidia"
];

// Admin credentials
export const ADMIN_USERS: AdminUser[] = [
  { username: 'admin1', password: 'clothsy2025' },
  { username: 'admin2', password: 'clothsy2025' },
  { username: 'admin3', password: 'clothsy2025' }
];

// Supabase Configuration
const SUPABASE_URL = 'https://fdgvhmgxyxdnxwhvmrhk.supabase.co';
const SUPABASE_KEY = 'sb_publishable_StTNEygqktlS_s0p26-3yA_ioUXh10q';
export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export function formatPrice(price: number): string {
  return `${price} MAD`;
}

class DataStore {
  private products: Product[] = [];
  private orders: Order[] = [];
  private subscribers: Subscriber[] = [];
  private stats: SiteStats | null = null;
  private listeners: (() => void)[] = [];

  constructor() {
    this.init();
  }

  // Initialize and fetch all data
  async init() {
    await Promise.all([
      this.fetchProducts(),
      this.fetchOrders(),
      this.fetchSubscribers(),
      this.fetchStats()
    ]);
    this.notifyListeners();
  }

  // --- Real-time Subscription System ---
  subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notifyListeners() {
    this.listeners.forEach(l => l());
  }

  // --- Products ---
  async fetchProducts() {
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    if (data) {
      this.products = data.map(p => ({
        ...p,
        createdAt: p.created_at,
        inStock: p.in_stock
      }));
    }
  }

  getProducts(): Product[] {
    return this.products;
  }

  setProducts(newProducts: Product[]) {
    this.products = newProducts;
    this.notifyListeners();
  }

  getVisibleProducts(): Product[] {
    return this.products.filter(p => p.visible);
  }

  async addProduct(product: Omit<Product, 'id' | 'createdAt'>) {
    const dbProduct = {
      code: product.code,
      name: product.name,
      description: product.description,
      price: product.price,
      sizes: product.sizes,
      colors: product.colors,
      images: product.images,
      category: product.category,
      in_stock: product.inStock,
      visible: product.visible
    };

    const { data, error } = await supabase.from('products').insert([dbProduct]).select().single();
    
    if (error) {
      console.error("Error adding product:", error);
      return null;
    }

    if (data) {
      const newProduct = { ...data, createdAt: data.created_at, inStock: data.in_stock };
      this.products.unshift(newProduct);
      this.notifyListeners();
      return newProduct;
    }
  }

  async deleteProduct(id: string) {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (!error) {
      this.products = this.products.filter(p => p.id !== id);
      this.notifyListeners();
    }
  }

  async toggleProductVisibility(id: string) {
    const product = this.products.find(p => p.id === id);
    if (!product) return;

    const newVisibility = !product.visible;
    const { error } = await supabase.from('products').update({ visible: newVisibility }).eq('id', id);

    if (!error) {
      product.visible = newVisibility;
      this.notifyListeners();
    }
  }

  // --- Orders ---
  async fetchOrders() {
    const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    if (data) {
      this.orders = data.map(o => ({
        id: o.id,
        createdAt: o.created_at,
        customerName: o.customer_name,
        customerPhone: o.customer_phone,
        customerCity: o.customer_city,
        customerAddress: o.customer_address,
        productName: o.product_name,
        productPrice: o.product_price,
        productImage: '', 
        quantity: o.quantity,
        status: o.status,
        size: o.size,
        color: o.color,
        notes: o.notes
      }));
    }
  }

  getOrders(): Order[] {
    return this.orders;
  }

  async addOrder(order: any) {
    const newId = `ORD-${Date.now().toString().slice(-6)}`;
    
    const dbOrder = {
      id: newId,
      customer_name: order.customerName,
      customer_phone: order.customerPhone,
      customer_city: order.customerCity,
      customer_address: order.customerAddress,
      product_id: order.productId || 'unknown',
      product_name: order.productName,
      product_price: order.productPrice,
      size: order.size,
      color: order.color,
      quantity: order.quantity,
      status: 'pending',
      notes: order.notes
    };

    const { error } = await supabase.from('orders').insert([dbOrder]);

    if (!error) {
      await this.fetchOrders();
      await this.updateStats('total_orders', 1);
      this.notifyListeners();
      return { id: newId };
    }
    return null;
  }

  async updateOrderStatus(orderId: string, status: string) {
    const { error } = await supabase.from('orders').update({ status }).eq('id', orderId);
    if (!error) {
      const order = this.orders.find(o => o.id === orderId);
      if (order) order.status = status as any;
      this.notifyListeners();
    }
  }

  async deleteOrder(orderId: string) {
    const { error } = await supabase.from('orders').delete().eq('id', orderId);
    if (!error) {
      this.orders = this.orders.filter(o => o.id !== orderId);
      this.notifyListeners();
    }
  }

  // --- Subscribers ---
  async fetchSubscribers() {
    const { data } = await supabase.from('subscribers').select('*');
    if (data) {
      this.subscribers = data.map(s => ({
        id: s.id,
        email: s.email,
        subscribedAt: s.subscribed_at || new Date().toISOString()
      }));
    }
  }

  getSubscribers() {
    return this.subscribers;
  }

  // --- Stats ---
  async fetchStats() {
    const { data } = await supabase.from('site_stats').select('*').single();
    if (data) {
      this.stats = {
        totalVisits: data.total_visits,
        totalOrders: data.total_orders,
        totalProducts: data.total_products,
        totalSubscribers: data.total_subscribers,
        ordersByStatus: this.calculateOrderStatus(),
        visitsByDate: [],
        ordersByDate: []
      };
    }
  }

  private async updateStats(field: string, increment: number) {
    const { data } = await supabase.from('site_stats').select(field).single();
    if (data) {
      const newValue = (data as any)[field] + increment;
      await supabase.from('site_stats').update({ [field]: newValue }).eq('id', 1);
    }
  }

  recordVisit() {
    this.updateStats('total_visits', 1);
  }

  getStats(): SiteStats {
    if (!this.stats) {
       return {
         totalVisits: 0, totalOrders: 0, totalProducts: 0, totalSubscribers: 0,
         ordersByStatus: { pending: 0, confirmed: 0, shipped: 0, delivered: 0, cancelled: 0 },
         visitsByDate: [], ordersByDate: []
       };
    }
    return {
      ...this.stats,
      ordersByStatus: this.calculateOrderStatus(),
      totalProducts: this.products.length,
      totalOrders: this.orders.length,
      totalSubscribers: this.subscribers.length
    };
  }

  private calculateOrderStatus() {
    const counts = { pending: 0, confirmed: 0, shipped: 0, delivered: 0, cancelled: 0 };
    this.orders.forEach(o => {
      if (counts[o.status] !== undefined) counts[o.status]++;
    });
    return counts;
  }

  exportOrdersToCSV(): string {
    const headers = ['Order ID,Date,Customer,Phone,City,Items,Total,Status'];
    const rows = this.orders.map(o => {
      const total = o.productPrice * o.quantity;
      return `${o.id},${new Date(o.createdAt).toLocaleDateString()},${o.customerName},${o.customerPhone},${o.customerCity},${o.quantity},${total},${o.status}`;
    });
    return [...headers, ...rows].join('\n');
  }
}

export const dataStore = new DataStore();

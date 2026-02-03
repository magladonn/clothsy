import { createClient } from '@supabase/supabase-js';
import type { Product, Order, Subscriber, SiteStats, AdminUser } from '@/types';

// Admin credentials
export const ADMIN_USERS: AdminUser[] = [
  { username: 'admin1', password: 'clothsy2025' },
  { username: 'admin2', password: 'clothsy2025' },
  { username: 'admin3', password: 'clothsy2025' }
];

// EmailJS configuration - ✅ CONFIGURED
export const EMAILJS_CONFIG = {
  serviceId: 'service_gn8ecp6',
  templateId: 'template_ft3yuor',
  publicKey: 'HyBzOZ_aiLwpVDlq0',
  email: 'clothsy.business.ma@gmail.com',
  phone: '+212786193181'
};

// Supabase configuration - ✅ CONFIGURED
export const SUPABASE_CONFIG = {
  url: 'https://fdgvhmgxyxdnxwhvmrhk.supabase.co',
  apiKey: 'sb_publishable_StTNEygqktlS_s0p26-3yA_ioUXh10q'
};

// Initialize Supabase client
const supabase = createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.apiKey);

// ALL Moroccan cities (complete list from all 12 regions)
export const MOROCCAN_CITIES = [
  // Casablanca-Settat Region
  'Casablanca', 'Mohammedia', 'Settat', 'El Jadida', 'Benslimane', 'Berrechid', 'Mediouna', 'Nouaceur',
  'Tit Mellil', 'Ain Harrouda', 'Sidi Rahal', 'Bouznika', 'Skhirat', 'Ben Ahmed', 'Oulad Frej',
  'Sidi Bennour', 'Sidi Smail', 'Azemmour', 'Oualidia', 'Zemamra', 'Bir Jdid', 'Lahraouyine',
  'Ain Sebaa', 'Hay Hassani', 'Sidi Bernoussi', 'Sidi Moumen', 'Ben Msik', 'Sidi Othmane',
  'Al Fida', 'Mers Sultan', 'Anfa', 'Maarif', 'Gauthier', 'Racine', 'Bourgogne',
  'Les Hopitaux', 'Sidi Maarouf', 'Californie', 'Oasis', 'Ain Chock', 'Hay Mohammadi',
  // Rabat-Sale-Kenitra Region
  'Rabat', 'Sale', 'Kenitra', 'Temara', 'Skhirat', 'Khemisset', 'Sidi Slimane', 'Sidi Yahya',
  'Sidi Kacem', 'Mehdia', 'Salé El Jadida', 'Tabriquet', 'Bettana', 'Hssain', 'Bab Lamrissa',
  'Hay Karima', 'Hay Rahma', 'El Menzeh', 'Souissi', 'Agdal', 'Hassan', 'Les Orangers',
  // Marrakech-Safi Region
  'Marrakech', 'Safi', 'El Kelaa des Sraghna', 'Essaouira', 'Youssoufia', 'Chichaoua',
  'Ben Guerir', 'Tameslouht', 'Ait Ourir', 'Amizmiz', 'Asni', 'Tahannaout', 'Tamansourt',
  'Sidi Rahhal', 'Smimou', 'Tafetachte', 'Talmest', 'Tamanar', 'Ida Ougourd', 'Imintanoute',
  // Fes-Meknes Region
  'Fes', 'Meknes', 'Taza', 'Sefrou', 'Boulemane', 'Moulay Yacoub', 'El Hajeb', 'Ifrane',
  'Azrou', 'Bhalil', 'Imouzzer Kandar', 'Ain Taoujdate', 'My Ali Cherif', 'Missour',
  'Outat El Haj', 'Rissani', 'Arfoud', 'Ahermoumou', 'Boufakrane', 'Mrirt', 'Khenifra',
  // Tangier-Tetouan-Al Hoceima Region
  'Tangier', 'Tetouan', 'Al Hoceima', 'Larache', 'Asilah', 'Fnideq', 'Martil', 'Mdiq',
  'Chefchaouen', 'Oued Laou', 'Bab Berred', 'Bab Taza', 'Bni Bouayach', 'Bni Hadifa',
  'Imzouren', 'Issaguen', 'Ketama', 'Ouezzane', 'Targuist', 'Taza El Jadida', 'Zoumi',
  // Oriental Region
  'Oujda', 'Nador', 'Berkane', 'Jerada', 'Taourirt', 'Figuig', 'Ain Beni Mathar',
  'Ahfir', 'Ain El Aouda', 'Ain Erreggada', 'Beni Ansar', 'Beni Drar', 'Bouanane',
  'Bouarfa', 'Bouhdila', 'Bni Tadjite', 'Debdou', 'Driouch', 'El Aioun', 'Guercif',
  'Hassi Berkane', 'Jaadar', 'Laatamna', 'Madagh', 'Ras El Ma', 'Saidia', 'Selouane',
  'Sidi Bouhria', 'Sidi Slimane Echcharaa', 'Tafoughalt', 'Tendrara', 'Touissit', 'Zaio',
  // Souss-Massa Region
  'Agadir', 'Inezgane', 'Ait Melloul', 'Tiznit', 'Taroudant', 'Oulad Teima', 'Tata',
  'Biougra', 'Drargua', 'Dcheira El Jihadia', 'Aourir', 'Dcheira', 'Irherm', 'Lqliaa',
  'Massa', 'Sidi Bibi', 'Sidi Ifni', 'Tafraout', 'Tamraght', 'Temsia', 'Ait Baha',
  'Ait Iaaza', 'Aoulouz', 'El Guerdane', 'Imsouane', 'Sidi Moussa Lhamri', 'Taliouine',
  // Guelmim-Oued Noun Region
  'Guelmim', 'Tan-Tan', 'Sidi Ifni', 'Assa', 'Zag', 'Bouizakarne', 'Foum Zguid',
  'Lakhsas', 'Plage Blanche', 'Taghjijt', 'Tiglit', 'Tighmert', 'Ait Boufoulen',
  'Aouinet', 'Bouanane', 'Ibn Chambred', 'Lemsid', 'Tarsouat', 'Tigmmi',
  // Laayoune-Sakia El Hamra Region
  'Laayoune', 'Boujdour', 'Tarfaya', 'Es-Semara', 'Dakhla', 'Haouza', 'Jdiriya',
  'El Marsa', 'Foum El Oued', 'Aousserd', 'Amgala', 'Bir Anzarane', 'Chlaghmim',
  'Chtouka', 'Dougoum', 'Guelta Zemmur', 'Imlili', 'Jraifia', 'Lamsid', 'Mijik',
  'Oum Dreyga', 'Tichla', 'Zoug', 'Chirfa', 'El Argoub', 'Guerguerat', 'Imlili',
  // Dakhla-Oued Ed-Dahab Region
  'Dakhla', 'Aousserd', 'Bir Gandouz', 'Gleibat El Foula', 'Imlili', 'Mijik',
  'Oum Dreyga', 'Tichla', 'Zoug', 'Chirfa', 'El Argoub', 'Guerguerat', 'Aouinet',
  'Bouanane', 'Ibn Chambred', 'Lemsid', 'Tarsouat', 'Tigmmi', 'Aglou', 'Aridal',
  'Bouizakarne', 'Foum Zguid', 'Lakhsas', 'Plage Blanche', 'Taghjijt', 'Tiglit',
  // Beni Mellal-Khenifra Region
  'Beni Mellal', 'Khouribga', 'Khenifra', 'Azilal', 'Fquih Ben Salah', 'Ouaouizeght',
  'Demnate', 'Kasba Tadla', 'Oulad Ayad', 'Souk Sebt Oulad Nemma', 'Zaouiat Cheikh',
  'Afourar', 'Ait Ishaq', 'Ait Oum El Bekht', 'Boujniba', 'Boulanouare', 'Bradia',
  'Dar Ould Zidouh', 'El Ksiba', 'Fetouaka', 'Had Bouhssoussen', 'Kasbat Troch',
  'Kerrouchen', 'Mrirt', 'Naour', 'Oulad Mbarek', 'Oulad Yaich', 'Sidi Jaber',
  'Sidi Lamine', 'Tafraout', 'Taghzirt', 'Tighassaline', 'Tizi Nisly', 'Zawyat',
  // Draa-Tafilalet Region
  'Errachidia', 'Ouarzazate', 'Midelt', 'Tinghir', 'Zagora', 'Rissani', 'Erfoud',
  'Goulmima', 'Taznakht', 'Agdz', 'Alnif', 'Boumalne Dades', 'Imilchil', 'Mhamid',
  'Nkob', 'Skoura', 'Tamegroute', 'Tazenakht', 'Tinejdad', 'Ait Hani', 'Amellagou',
  'Amersid', 'Aoufous', 'Arfoud', 'Assoul', 'Boudnib', 'El Hart', 'Enjil', 'Errouha',
  'Fezna', 'Ferkla', 'Gheris', 'Goulmima', 'Hassi Berdad', 'Hassi Mbarek', 'Hassi',
  'Ighil N Oumgoun', 'Ighrem N Ougdal', 'Imider', 'Imilchil', 'Jorf', 'Ksar Tazougart',
  'M Ssici', 'Melaab', 'Mibladen', 'Moulay Ali Cherif', 'My Brahim Salah', 'N Oual',
  'Ouaouizeght', 'Ouarzazate', 'Rich', 'Sidi Ayad', 'Tabant', 'Taghzirt N Imilchil',
  'Tamellalt', 'Tamedakhte', 'Tameslohte', 'Taznakht', 'Telouet', 'Tiddas', 'Tifernine',
  'Tighdouine', 'Tighza', 'Tinejdad', 'Tisrasse', 'Tizi N Ougoug', 'Toundoute', 'Tounfite',
  'Zagora', 'Zaouiat Sidi Hamza', 'Zaouiat Sidi Salah',
  // Other
  'Other'
];

// DataStore class with Supabase integration
class DataStore {
  // Admin Authentication (still local for now)
  authenticateAdmin(username: string, password: string): boolean {
    return ADMIN_USERS.some(admin => admin.username === username && admin.password === password);
  }

  // Products - Now using Supabase
  async getProducts(): Promise<Product[]> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Convert snake_case to camelCase
      return (data || []).map(p => ({
        id: p.id,
        code: p.code,
        name: p.name,
        description: p.description,
        price: p.price,
        sizes: p.sizes,
        colors: p.colors,
        images: p.images,
        category: p.category,
        inStock: p.in_stock,
        visible: p.visible,
        createdAt: p.created_at
      }));
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  }

  async getVisibleProducts(): Promise<Product[]> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('visible', true)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return (data || []).map(p => ({
        id: p.id,
        code: p.code,
        name: p.name,
        description: p.description,
        price: p.price,
        sizes: p.sizes,
        colors: p.colors,
        images: p.images,
        category: p.category,
        inStock: p.in_stock,
        visible: p.visible,
        createdAt: p.created_at
      }));
    } catch (error) {
      console.error('Error fetching visible products:', error);
      return [];
    }
  }

  async getProductById(id: string): Promise<Product | null> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      if (!data) return null;
      
      return {
        id: data.id,
        code: data.code,
        name: data.name,
        description: data.description,
        price: data.price,
        sizes: data.sizes,
        colors: data.colors,
        images: data.images,
        category: data.category,
        inStock: data.in_stock,
        visible: data.visible,
        createdAt: data.created_at
      };
    } catch (error) {
      console.error('Error fetching product:', error);
      return null;
    }
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    try {
      let query = supabase
        .from('products')
        .select('*')
        .eq('visible', true);
      
      if (category !== 'all') {
        query = query.eq('category', category);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return (data || []).map(p => ({
        id: p.id,
        code: p.code,
        name: p.name,
        description: p.description,
        price: p.price,
        sizes: p.sizes,
        colors: p.colors,
        images: p.images,
        category: p.category,
        inStock: p.in_stock,
        visible: p.visible,
        createdAt: p.created_at
      }));
    } catch (error) {
      console.error('Error fetching products by category:', error);
      return [];
    }
  }

  async addProduct(product: Omit<Product, 'id' | 'createdAt'>): Promise<Product | null> {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert([{
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
        }])
        .select()
        .single();
      
      if (error) throw error;
      
      // Update stats
      await this.updateProductCount();
      
      return data ? {
        id: data.id,
        code: data.code,
        name: data.name,
        description: data.description,
        price: data.price,
        sizes: data.sizes,
        colors: data.colors,
        images: data.images,
        category: data.category,
        inStock: data.in_stock,
        visible: data.visible,
        createdAt: data.created_at
      } : null;
    } catch (error) {
      console.error('Error adding product:', error);
      return null;
    }
  }

  async updateProduct(id: string, updates: Partial<Product>): Promise<boolean> {
    try {
      const dbUpdates: any = {};
      if (updates.code !== undefined) dbUpdates.code = updates.code;
      if (updates.name !== undefined) dbUpdates.name = updates.name;
      if (updates.description !== undefined) dbUpdates.description = updates.description;
      if (updates.price !== undefined) dbUpdates.price = updates.price;
      if (updates.sizes !== undefined) dbUpdates.sizes = updates.sizes;
      if (updates.colors !== undefined) dbUpdates.colors = updates.colors;
      if (updates.images !== undefined) dbUpdates.images = updates.images;
      if (updates.category !== undefined) dbUpdates.category = updates.category;
      if (updates.inStock !== undefined) dbUpdates.in_stock = updates.inStock;
      if (updates.visible !== undefined) dbUpdates.visible = updates.visible;
      
      const { error } = await supabase
        .from('products')
        .update(dbUpdates)
        .eq('id', id);
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating product:', error);
      return false;
    }
  }

  async deleteProduct(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      // Update stats
      await this.updateProductCount();
      
      return true;
    } catch (error) {
      console.error('Error deleting product:', error);
      return false;
    }
  }

  async toggleProductVisibility(id: string): Promise<boolean> {
    try {
      // Get current product
      const product = await this.getProductById(id);
      if (!product) return false;
      
      // Toggle visibility
      const { error } = await supabase
        .from('products')
        .update({ visible: !product.visible })
        .eq('id', id);
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error toggling visibility:', error);
      return false;
    }
  }

  // Orders - Using Supabase
  async getOrders(): Promise<Order[]> {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return (data || []).map(o => ({
        id: o.id,
        customerName: o.customer_name,
        customerPhone: o.customer_phone,
        customerCity: o.customer_city,
        customerAddress: o.customer_address,
        productId: o.product_id,
        productName: o.product_name,
        productPrice: o.product_price,
        size: o.size,
        color: o.color,
        quantity: o.quantity,
        status: o.status,
        notes: o.notes,
        createdAt: o.created_at
      }));
    } catch (error) {
      console.error('Error fetching orders:', error);
      return [];
    }
  }

  async addOrder(order: Omit<Order, 'id' | 'createdAt' | 'status'>): Promise<Order | null> {
    try {
      const orderId = 'CLTH-' + Date.now().toString().slice(-6);
      
      const { data, error } = await supabase
        .from('orders')
        .insert([{
          id: orderId,
          customer_name: order.customerName,
          customer_phone: order.customerPhone,
          customer_city: order.customerCity,
          customer_address: order.customerAddress,
          product_id: order.productId,
          product_name: order.productName,
          product_price: order.productPrice,
          size: order.size,
          color: order.color,
          quantity: order.quantity,
          status: 'pending',
          notes: order.notes
        }])
        .select()
        .single();
      
      if (error) throw error;
      
      // Update stats
      await this.updateOrderStats('pending', 1);
      
      return data ? {
        id: data.id,
        customerName: data.customer_name,
        customerPhone: data.customer_phone,
        customerCity: data.customer_city,
        customerAddress: data.customer_address,
        productId: data.product_id,
        productName: data.product_name,
        productPrice: data.product_price,
        size: data.size,
        color: data.color,
        quantity: data.quantity,
        status: data.status,
        notes: data.notes,
        createdAt: data.created_at
      } : null;
    } catch (error) {
      console.error('Error adding order:', error);
      return null;
    }
  }

  async updateOrderStatus(orderId: string, status: Order['status']): Promise<boolean> {
    try {
      // Get current order to update stats
      const { data: currentOrder } = await supabase
        .from('orders')
        .select('status')
        .eq('id', orderId)
        .single();
      
      if (!currentOrder) return false;
      
      // Update order status
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId);
      
      if (error) throw error;
      
      // Update stats
      await this.updateOrderStats(currentOrder.status, -1);
      await this.updateOrderStats(status, 1);
      
      return true;
    } catch (error) {
      console.error('Error updating order status:', error);
      return false;
    }
  }

  async deleteOrder(orderId: string): Promise<boolean> {
    try {
      // Get order status before deleting
      const { data: order } = await supabase
        .from('orders')
        .select('status')
        .eq('id', orderId)
        .single();
      
      if (!order) return false;
      
      const { error } = await supabase
        .from('orders')
        .delete()
        .eq('id', orderId);
      
      if (error) throw error;
      
      // Update stats
      await this.updateOrderStats(order.status, -1);
      
      return true;
    } catch (error) {
      console.error('Error deleting order:', error);
      return false;
    }
  }

  // Subscribers - Using Supabase
  async getSubscribers(): Promise<Subscriber[]> {
    try {
      const { data, error } = await supabase
        .from('subscribers')
        .select('*')
        .order('subscribed_at', { ascending: false });
      
      if (error) throw error;
      
      return (data || []).map(s => ({
        id: s.id,
        email: s.email,
        subscribedAt: s.subscribed_at
      }));
    } catch (error) {
      console.error('Error fetching subscribers:', error);
      return [];
    }
  }

  async addSubscriber(email: string): Promise<Subscriber | null> {
    try {
      const { data, error } = await supabase
        .from('subscribers')
        .insert([{ email }])
        .select()
        .single();
      
      if (error) {
        // Check if email already exists
        if (error.code === '23505') {
          return null; // Already subscribed
        }
        throw error;
      }
      
      // Update stats
      await this.updateSubscriberCount();
      
      return data ? {
        id: data.id,
        email: data.email,
        subscribedAt: data.subscribed_at
      } : null;
    } catch (error) {
      console.error('Error adding subscriber:', error);
      return null;
    }
  }

  // Stats - Using Supabase
  async getStats(): Promise<SiteStats> {
    try {
      const { data: stats } = await supabase
        .from('site_stats')
        .select('*')
        .eq('id', 1)
        .single();
      
      const { data: orderStats } = await supabase
        .from('order_stats')
        .select('*');
      
      const { data: visitsByDate } = await supabase
        .from('visits_by_date')
        .select('*')
        .order('date', { ascending: false })
        .limit(7);
      
      const { data: ordersByDate } = await supabase
        .from('orders_by_date')
        .select('*')
        .order('date', { ascending: false })
        .limit(7);
      
      const ordersByStatus = {
        pending: 0,
        confirmed: 0,
        shipped: 0,
        delivered: 0,
        cancelled: 0
      };
      
      (orderStats || []).forEach(stat => {
        if (stat.status in ordersByStatus) {
          ordersByStatus[stat.status as keyof typeof ordersByStatus] = stat.count;
        }
      });
      
      return {
        totalVisits: stats?.total_visits || 0,
        totalOrders: stats?.total_orders || 0,
        totalProducts: stats?.total_products || 0,
        totalSubscribers: stats?.total_subscribers || 0,
        ordersByStatus,
        visitsByDate: (visitsByDate || []).map(v => ({
          date: v.date,
          visits: v.visits
        })),
        ordersByDate: (ordersByDate || []).map(o => ({
          date: o.date,
          orders: o.orders
        }))
      };
    } catch (error) {
      console.error('Error fetching stats:', error);
      return {
        totalVisits: 0,
        totalOrders: 0,
        totalProducts: 0,
        totalSubscribers: 0,
        ordersByStatus: {
          pending: 0,
          confirmed: 0,
          shipped: 0,
          delivered: 0,
          cancelled: 0
        },
        visitsByDate: [],
        ordersByDate: []
      };
    }
  }

  async recordVisit(): Promise<void> {
    try {
      // Update total visits
      const { data: stats } = await supabase
        .from('site_stats')
        .select('total_visits')
        .eq('id', 1)
        .single();
      
      await supabase
        .from('site_stats')
        .update({ total_visits: (stats?.total_visits || 0) + 1 })
        .eq('id', 1);
      
      // Update daily visits
      const today = new Date().toISOString().split('T')[0];
      
      const { data: todayVisit } = await supabase
        .from('visits_by_date')
        .select('*')
        .eq('date', today)
        .single();
      
      if (todayVisit) {
        await supabase
          .from('visits_by_date')
          .update({ visits: todayVisit.visits + 1 })
          .eq('date', today);
      } else {
        await supabase
          .from('visits_by_date')
          .insert([{ date: today, visits: 1 }]);
      }
    } catch (error) {
      console.error('Error recording visit:', error);
    }
  }

  // Helper methods for updating stats
  private async updateProductCount(): Promise<void> {
    try {
      const { count } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true });
      
      await supabase
        .from('site_stats')
        .update({ total_products: count || 0 })
        .eq('id', 1);
    } catch (error) {
      console.error('Error updating product count:', error);
    }
  }

  private async updateOrderStats(status: string, increment: number): Promise<void> {
    try {
      const { data: currentStat } = await supabase
        .from('order_stats')
        .select('count')
        .eq('status', status)
        .single();
      
      if (currentStat) {
        await supabase
          .from('order_stats')
          .update({ count: Math.max(0, currentStat.count + increment) })
          .eq('status', status);
      }
      
      // Update total orders
      const { data: allStats } = await supabase
        .from('order_stats')
        .select('count');
      
      const totalOrders = (allStats || []).reduce((sum, stat) => sum + stat.count, 0);
      
      await supabase
        .from('site_stats')
        .update({ total_orders: totalOrders })
        .eq('id', 1);
    } catch (error) {
      console.error('Error updating order stats:', error);
    }
  }

  private async updateSubscriberCount(): Promise<void> {
    try {
      const { count } = await supabase
        .from('subscribers')
        .select('*', { count: 'exact', head: true });
      
      await supabase
        .from('site_stats')
        .update({ total_subscribers: count || 0 })
        .eq('id', 1);
    } catch (error) {
      console.error('Error updating subscriber count:', error);
    }
  }

  // Export orders to CSV
  async exportOrdersToCSV(): Promise<string> {
    const orders = await this.getOrders();
    const headers = ['Order ID,Date,Customer,Phone,City,Items,Total,Status,Notes'];
    const rows = orders.map(order => {
      const total = order.productPrice * order.quantity;
      return `${order.id},${new Date(order.createdAt).toLocaleDateString()},${order.customerName},${order.customerPhone},${order.customerCity},${order.quantity},${total},${order.status},"${order.notes || ''}"`;
    });
    return [...headers, ...rows].join('\n');
  }
}

export const dataStore = new DataStore();

// Format price in MAD
export function formatPrice(price: number): string {
  return `${price} MAD`;
}

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase'; // Make sure this path is correct!
import { Navigation } from '@/components/Navigation';
import { AdminSidebar } from '@/components/AdminSidebar';
import { Hero } from '@/sections/Hero';
import { ProductMarquee } from '@/sections/ProductMarquee';
import { Products } from '@/sections/Products';
import { ProductDetail } from '@/sections/ProductDetail';
import { Contact } from '@/sections/Contact';
import { Confirmation } from '@/sections/Confirmation';
import { Footer } from '@/sections/Footer';
import { AdminLogin } from '@/admin/AdminLogin';
import { AdminDashboard } from '@/admin/Dashboard';
import { AdminProducts } from '@/admin/Products';
import { AdminOrders } from '@/admin/Orders';
import { AdminSubscribers } from '@/admin/Subscribers';
import { AdminStatistics } from '@/admin/Statistics';
import { dataStore } from '@/store/dataStore';
import type { View, Product } from '@/types';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState<View>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cartCount, setCartCount] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);
  const [lastOrderId, setLastOrderId] = useState('');

  // 1. STATE FOR REAL PRODUCTS
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // 2. FETCH FROM SUPABASE ON LOAD
  useEffect(() => {
    async function fetchProducts() {
      try {
        console.log("Fetching products from Supabase...");
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('visible', true); // Only fetch visible products

        if (error) {
          console.error('Supabase Error:', error);
        } else if (data) {
          console.log('Got products:', data);
          setProducts(data);
        }
      } catch (err) {
        console.error('Connection Error:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
    dataStore.recordVisit();
  }, []);

  // Scroll to top on view change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentView]);

  const renderPublicView = () => {
    switch (currentView) {
      case 'home':
        return (
          <>
            <Hero setView={setCurrentView} />
            {/* Pass the real products to Marquee */}
            <ProductMarquee 
              products={products} 
              setView={setCurrentView} 
              setSelectedProduct={setSelectedProduct} 
            />
            <Footer setView={setCurrentView} />
          </>
        );
      case 'products':
        return (
          <>
            {/* Pass the real products to the Grid */}
            <Products 
              products={products} 
              setView={setCurrentView} 
              setSelectedProduct={setSelectedProduct} 
            />
            <Footer setView={setCurrentView} />
          </>
        );
      case 'product-detail':
        if (!selectedProduct) {
          setCurrentView('products');
          return null;
        }
        return (
          <>
            <ProductDetail 
              setView={setCurrentView} 
              product={selectedProduct}
              setCartCount={setCartCount}
              setLastOrderId={setLastOrderId}
            />
            <Footer setView={setCurrentView} />
          </>
        );
      case 'contact':
        return (
          <>
            <Contact />
            <Footer setView={setCurrentView} />
          </>
        );
      case 'confirmation':
        return (
          <>
            <Confirmation setView={setCurrentView} orderId={lastOrderId} />
            <Footer setView={setCurrentView} />
          </>
        );
      default:
        return (
          <>
            <Hero setView={setCurrentView} />
            <ProductMarquee products={products} setView={setCurrentView} setSelectedProduct={setSelectedProduct} />
            <Footer setView={setCurrentView} />
          </>
        );
    }
  };

  const renderAdminView = () => {
    if (!isAdmin) {
      return (
        <AdminLogin 
          setView={setCurrentView} 
          setIsAdmin={setIsAdmin}
        />
      );
    }

    switch (currentView) {
      case 'admin':
        return <AdminDashboard />;
      case 'admin-products':
        return <AdminProducts />;
      case 'admin-orders':
        return <AdminOrders />;
      case 'admin-subscribers':
        return <AdminSubscribers />;
      case 'admin-stats':
        return <AdminStatistics />;
      default:
        return <AdminDashboard />;
    }
  };

  const isAdminView = currentView.startsWith('admin');

  return (
    <div className="min-h-screen bg-white">
      <div className="grain-overlay" />

      {!isAdminView && (
        <Navigation 
          currentView={currentView}
          setView={setCurrentView}
          cartCount={cartCount}
          setSelectedProduct={setSelectedProduct}
        />
      )}

      {isAdminView && isAdmin && (
        <AdminSidebar 
          currentView={currentView}
          setView={setCurrentView}
          setIsAdmin={setIsAdmin}
        />
      )}

      <main className={isAdminView && isAdmin ? 'ml-64' : ''}>
        {isAdminView ? renderAdminView() : renderPublicView()}
      </main>
    </div>
  );
}

export default App;

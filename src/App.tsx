import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Analytics } from "@vercel/analytics/react"; // ✅ ADDED THIS
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
import { WhatsAppButton } from '@/components/WhatsAppButton';
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
  // We keep loading state but don't force a loading screen to keep UI snappy
  const [, setLoading] = useState(true);

  // 2. FETCH FROM SUPABASE ON LOAD
  useEffect(() => {
    async function fetchProducts() {
      try {
        console.log("Fetching products from Supabase...");
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false }); 
          
        if (error) {
          console.error('Supabase Error:', error);
        } else if (data) {
          console.log('Got products:', data);
          setProducts(data);
          
          // Sync to dataStore for Hero section
          // Using strict type checking bypass to ensure build doesn't fail on store methods
          if (dataStore && typeof (dataStore as any).setProducts === 'function') {
             (dataStore as any).setProducts(data);
          } else {
             (dataStore as any).products = data;
             if (typeof (dataStore as any).notify === 'function') (dataStore as any).notify();
          }
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
            <Hero setView={setCurrentView} setSelectedProduct={setSelectedProduct} />
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
            <Hero setView={setCurrentView} setSelectedProduct={setSelectedProduct} />
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
    <div className="min-h-screen bg-white relative">
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

      {!isAdminView && <WhatsAppButton />}
      
      {/* ✅ ADDED: This makes the Vercel Analytics work */}
      <Analytics />
    </div>
  );
}

export default App;

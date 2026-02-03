import { useState, useEffect } from 'react';
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

  // Record visit on initial load
  useEffect(() => {
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
            <ProductMarquee setView={setCurrentView} setSelectedProduct={setSelectedProduct} />
            <Footer setView={setCurrentView} />
          </>
        );
      case 'products':
        return (
          <>
            <Products setView={setCurrentView} setSelectedProduct={setSelectedProduct} />
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
            <ProductMarquee setView={setCurrentView} setSelectedProduct={setSelectedProduct} />
            <Footer setView={setCurrentView} />
          </>
        );
    }
  };

  const renderAdminView = () => {
    // Check if admin is logged in
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
      {/* Grain Overlay */}
      <div className="grain-overlay" />

      {/* Navigation (only for public views) */}
      {!isAdminView && (
        <Navigation 
          currentView={currentView}
          setView={setCurrentView}
          cartCount={cartCount}
          setSelectedProduct={setSelectedProduct}
        />
      )}

      {/* Admin Sidebar */}
      {isAdminView && isAdmin && (
        <AdminSidebar 
          currentView={currentView}
          setView={setCurrentView}
          setIsAdmin={setIsAdmin}
        />
      )}

      {/* Main Content */}
      <main className={isAdminView && isAdmin ? 'ml-64' : ''}>
        {isAdminView ? renderAdminView() : renderPublicView()}
      </main>
    </div>
  );
}

export default App;

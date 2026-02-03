import { useState, useEffect } from 'react';
import { Search, ShoppingBag, Menu, X } from 'lucide-react';
import { dataStore } from '@/store/dataStore';
import type { View, Product } from '@/types';

interface NavigationProps {
  currentView: View;
  setView: (view: View) => void;
  cartCount: number;
  setSelectedProduct?: (product: Product) => void;
}

export function Navigation({ currentView, setView, cartCount, setSelectedProduct }: NavigationProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setSearchResults([]);
      return;
    }
    
    const products = dataStore.getVisibleProducts();
    const filtered = products.filter(p => 
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.code.toLowerCase().includes(query.toLowerCase()) ||
      p.category.toLowerCase().includes(query.toLowerCase())
    );
    setSearchResults(filtered);
  };

  const handleProductClick = (product: Product) => {
    setSearchOpen(false);
    setSearchQuery('');
    setSearchResults([]);
    if (setSelectedProduct) {
      setSelectedProduct(product);
      setView('product-detail');
    }
  };

  const isPublicView = !currentView.startsWith('admin');

  if (!isPublicView) return null;

  return (
    <>
      <nav className={`nav-island ${scrolled ? 'scrolled' : ''}`}>
        <div className={`nav-inner transition-all duration-500 ${scrolled ? '' : 'px-8 py-6'}`}>
          <div className="flex items-center justify-between gap-12">
            {/* Logo */}
            <button 
              onClick={() => setView('home')}
              className="text-xl font-bold tracking-tight hover:opacity-70 transition-opacity"
            >
              CLOTHSY
            </button>

            {/* Desktop Links */}
            <div className="hidden md:flex items-center gap-8">
              <button 
                onClick={() => setView('home')}
                className={`text-sm font-medium hover:opacity-70 transition-opacity ${currentView === 'home' ? 'text-black' : 'text-gray-500'}`}
              >
                Home
              </button>
              <button 
                onClick={() => setView('products')}
                className={`text-sm font-medium hover:opacity-70 transition-opacity ${currentView === 'products' || currentView === 'product-detail' ? 'text-black' : 'text-gray-500'}`}
              >
                Products
              </button>
              <button 
                onClick={() => setView('contact')}
                className={`text-sm font-medium hover:opacity-70 transition-opacity ${currentView === 'contact' ? 'text-black' : 'text-gray-500'}`}
              >
                Contact
              </button>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4">
              {/* Search Button */}
              <button 
                className="hover:opacity-70 transition-opacity"
                onClick={() => setSearchOpen(!searchOpen)}
              >
                <Search className="w-5 h-5" />
              </button>
              
              {/* Cart */}
              <button 
                onClick={() => setView('contact')}
                className="hover:opacity-70 transition-opacity relative"
              >
                <ShoppingBag className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-4 h-4 bg-black text-white text-[10px] flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
              
              {/* Mobile Menu Button */}
              <button 
                className="md:hidden hover:opacity-70 transition-opacity"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Search Bar */}
          {searchOpen && (
            <div className="mt-4 relative">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Search products..."
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 focus:outline-none focus:border-black transition-colors"
                  autoFocus
                />
                <button 
                  onClick={() => {
                    setSearchOpen(false);
                    setSearchQuery('');
                    setSearchResults([]);
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Search Results */}
              {searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 shadow-lg z-50 max-h-80 overflow-auto">
                  {searchResults.map((product) => (
                    <button
                      key={product.id}
                      onClick={() => handleProductClick(product)}
                      className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors text-left"
                    >
                      <img 
                        src={product.images[0]} 
                        alt={product.name}
                        className="w-16 h-20 object-cover"
                      />
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-gray-500">{product.code}</p>
                        <p className="text-sm font-medium">{product.price} MAD</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {searchQuery && searchResults.length === 0 && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 shadow-lg z-50 p-4 text-center text-gray-500">
                  No products found
                </div>
              )}
            </div>
          )}
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-white z-40 pt-24 px-8">
          <div className="flex flex-col gap-6">
            <button 
              onClick={() => { setView('home'); setMobileMenuOpen(false); }}
              className="text-2xl font-medium text-left"
            >
              Home
            </button>
            <button 
              onClick={() => { setView('products'); setMobileMenuOpen(false); }}
              className="text-2xl font-medium text-left"
            >
              Products
            </button>
            <button 
              onClick={() => { setView('contact'); setMobileMenuOpen(false); }}
              className="text-2xl font-medium text-left"
            >
              Contact
            </button>
          </div>
        </div>
      )}
    </>
  );
}

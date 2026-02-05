import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { formatPrice } from '@/store/dataStore';
import type { View, Product } from '@/types';

gsap.registerPlugin(ScrollTrigger);

interface ProductsProps {
  setView: (view: View) => void;
  setSelectedProduct: (product: Product) => void;
  products: Product[]; // 👈 NEW: Now accepts real products from Supabase
}

export function Products({ setView, setSelectedProduct, products: allProducts }: ProductsProps) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const gridRef = useRef<HTMLDivElement>(null);

 setProducts(dataStore.getProducts());

    // 2. Subscribe to updates (so it auto-updates when Supabase loads)
    const unsubscribe = dataStore.subscribe(() => {
      setProducts([...dataStore.getProducts()]); // Create new array to force React re-render
    });

    // 3. Cleanup listener when leaving page
    return () => unsubscribe();
  }, []);

  // 👇 2. GSAP ANIMATION (Kept exactly the same)
  useEffect(() => {
    // Only run animation if we have products to show
    if (filteredProducts.length > 0) {
      const ctx = gsap.context(() => {
        gsap.fromTo(gridRef.current?.children || [],
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.1,
            ease: 'expo.out',
            scrollTrigger: {
              trigger: gridRef.current,
              start: 'top 80%',
              toggleActions: 'play none none none'
            }
          }
        );
      });
      return () => ctx.revert();
    }
  }, [filteredProducts]);

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setView('product-detail');
  };

  return (
    <section className="pt-32 pb-16 px-8 md:px-16 lg:px-24 min-h-screen">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-8">ALL PRODUCTS</h1>
        
        {/* Category Filters */}
        <div className="flex flex-wrap gap-2">
          {['all', 'mens', 'womens', 'accessories'].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`category-filter ${activeCategory === cat ? 'active' : ''}`}
            >
              {cat.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      <div 
        ref={gridRef}
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
      >
        {filteredProducts.map((product) => (
          <div 
            key={product.id}
            onClick={() => handleProductClick(product)}
            className="product-card cursor-pointer group"
          >
            <div className="aspect-[3/4] bg-gray-100 mb-4 overflow-hidden relative">
              <img 
                src={product.images && product.images[0] ? product.images[0] : ''} 
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
               {/* Sold Out Badge */}
               {!product.in_stock && (
                  <div className="absolute top-2 right-2 bg-black text-white text-[10px] px-2 py-1 font-bold uppercase">
                    Sold Out
                  </div>
                )}
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 mb-1">{product.code}</p>
              <h3 className="text-sm font-medium group-hover:underline mb-1">{product.name}</h3>
              <p className="text-sm font-medium">{formatPrice(product.price)}</p>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-24">
          <p className="text-gray-500">
            {allProducts.length === 0 ? "Loading products..." : "No products found in this category."}
          </p>
        </div>
      )}
    </section>
  );
}

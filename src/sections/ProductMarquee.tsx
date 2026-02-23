import { formatPrice } from '@/store/dataStore';
import type { View, Product } from '@/types';

interface ProductMarqueeProps {
  products: Product[];
  setView: (view: View) => void;
  setSelectedProduct: (product: Product) => void;
}

export function ProductMarquee({ products, setView, setSelectedProduct }: ProductMarqueeProps) {
  
  // Create a larger list of products for the infinite loop effect
  const safeProducts = products || [];
  
  if (safeProducts.length === 0) {
    return null; 
  }

  // We repeat the list 4 times to ensure it fills wide screens comfortably
  const marqueeProducts = [...safeProducts, ...safeProducts, ...safeProducts, ...safeProducts];

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setView('product-detail');
  };

  return (
    <section className="py-16 overflow-hidden">
      <div className="mb-8 px-8 md:px-16">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight uppercase">New Drops</h2>
      </div>
      
      <div className="flex w-full overflow-hidden">
        <div 
          className="flex gap-6 animate-marquee will-change-transform whitespace-nowrap"
          style={{ animationDuration: '30s' }} // Slower is usually better for reading prices
        >
          {marqueeProducts.map((product, index) => (
            <div 
              key={`${product.id}-${index}`} 
              onClick={() => handleProductClick(product)}
              className="product-card flex-shrink-0 w-[280px] md:w-[320px] cursor-pointer group"
            >
              <div className="aspect-[3/4] bg-gray-100 mb-4 overflow-hidden relative">
                <img 
                  src={product.images?.[0] || 'https://via.placeholder.com/300'} 
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* Sold Out Badge */}
                {!product.inStock && (
                  <div className="absolute top-2 right-2 bg-black text-white text-[10px] px-2 py-1 font-bold uppercase">
                    Sold Out
                  </div>
                )}
              </div>

              <div className="flex justify-between items-start gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-500 mb-1">{product.code}</p>
                  <h3 className="text-sm font-medium group-hover:underline uppercase truncate pr-2">
                    {product.name}
                  </h3>
                </div>
                
                {/* ✅ UPDATED STACKED PRICE HERE */}
                <div className="flex flex-col items-end">
                  {product.originalPrice && product.originalPrice > product.price ? (
                    <>
                      <span className="text-[11px] text-gray-400 line-through leading-none pb-[2px]">{formatPrice(product.originalPrice)}</span>
                      <span className="text-sm font-bold leading-none whitespace-nowrap">{formatPrice(product.price)}</span>
                    </>
                  ) : (
                    <span className="text-sm font-medium whitespace-nowrap">{formatPrice(product.price)}</span>
                  )}
                </div>

              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

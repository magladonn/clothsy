import { formatPrice } from '@/store/dataStore';
import type { View, Product } from '@/types';

interface ProductMarqueeProps {
  products: Product[];
  setView: (view: View) => void;
  setSelectedProduct: (product: Product) => void;
}

export function ProductMarquee({ products, setView, setSelectedProduct }: ProductMarqueeProps) {
  
  // Create a larger list of products for the infinite loop effect
  // We repeat the list 4 times to ensure it fills wide screens comfortably
  const safeProducts = products || [];
  
  // If no products are loaded yet, don't break the layout
  if (safeProducts.length === 0) {
    return null; 
  }

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
          // ⚡ SPEED CONTROL: Change '20s' to '10s' for faster, '30s' for slower
          style={{ animationDuration: '20s' }} 
        >
          {marqueeProducts.map((product, index) => (
            <div 
              // We use index in key because we have duplicate product IDs now
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
              </div>
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1">{product.code}</p>
                  <h3 className="text-sm font-medium group-hover:underline uppercase">{product.name}</h3>
                </div>
                <p className="text-sm font-medium">{formatPrice(product.price)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

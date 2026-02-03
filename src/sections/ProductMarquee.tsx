import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { dataStore, formatPrice } from '@/store/dataStore';
import type { View, Product } from '@/types';

gsap.registerPlugin(ScrollTrigger);

interface ProductMarqueeProps {
  setView: (view: View) => void;
  setSelectedProduct: (product: Product) => void;
}

export function ProductMarquee({ setView, setSelectedProduct }: ProductMarqueeProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const products = dataStore.getVisibleProducts();

  // Create a larger list of products for the infinite loop effect
  // We repeat the list 4 times to ensure it fills wide screens comfortably
  const marqueeProducts = [...products, ...products, ...products, ...products];

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const ctx = gsap.context(() => {
      // Scroll-based velocity boost
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top bottom',
        end: 'bottom top',
        onUpdate: (self) => {
          const velocity = Math.abs(self.getVelocity()) / 1000;
          const skewAmount = Math.min(velocity * 2, 15);
          
          gsap.to(track, {
            // This skews items slightly when you scroll fast (animation effect)
            // If you want it PERFECTLY straight even when scrolling, change skewAmount to 0
            skewX: self.direction === 1 ? skewAmount : -skewAmount,
            duration: 0.3,
            ease: 'power2.out'
          });
        }
      });
    });

    return () => ctx.revert();
  }, []);

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setView('product-detail');
  };

  return (
    // FIX 1: Removed "-rotate-1" class so the container is straight
    <section ref={sectionRef} className="py-16 overflow-hidden">
      <div className="mb-8 px-8 md:px-16">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">NEW DROPS</h2>
      </div>
      
      <div 
        ref={trackRef}
        className="flex gap-6 animate-marquee will-change-transform"
        style={{ width: 'max-content' }}
      >
        {/* FIX 2: Mapping over the duplicated array so React Clicks still work */}
        {marqueeProducts.map((product, index) => (
          <div 
            // We use index in key because we have duplicate product IDs now
            key={`${product.id}-${index}`} 
            onClick={() => handleProductClick(product)}
            className="product-card flex-shrink-0 w-[280px] md:w-[320px] cursor-pointer group"
          >
            <div className="aspect-[3/4] bg-gray-100 mb-4 overflow-hidden">
              <img 
                src={product.images[0]} 
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-medium text-gray-500 mb-1">{product.code}</p>
                <h3 className="text-sm font-medium group-hover:underline">{product.name}</h3>
              </div>
              <p className="text-sm font-medium">{formatPrice(product.price)}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

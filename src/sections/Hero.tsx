import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import type { View } from '@/types';

interface HeroProps {
  setView: (view: View) => void;
}

export function Hero({ setView }: HeroProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subheadingRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLButtonElement>(null);
  const image1Ref = useRef<HTMLDivElement>(null);
  const image2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(headingRef.current,
        { y: 100, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: 'expo.out', delay: 0.2 }
      );

      gsap.fromTo(subheadingRef.current,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'expo.out', delay: 0.5 }
      );

      gsap.fromTo(ctaRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'expo.out', delay: 0.7 }
      );

      gsap.fromTo(image1Ref.current,
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.5, ease: 'power2.out', delay: 0.5 }
      );

      gsap.fromTo(image2Ref.current,
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.5, ease: 'power2.out', delay: 0.7 }
      );

      gsap.to(image1Ref.current, {
        y: -20,
        duration: 3,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true
      });

      gsap.to(image2Ref.current, {
        y: 20,
        duration: 4,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section className="min-h-screen pt-24 pb-16 px-8 md:px-16 lg:px-24">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center min-h-[80vh]">
        {/* Left - Text Content */}
        <div className="flex flex-col justify-center order-2 lg:order-1">
          <h1 
            ref={headingRef}
            className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-none mb-6"
          >
            CLOTHSY
            <br />
            <span className="text-gray-400">COLLECTION</span>
          </h1>
          
          <p 
            ref={subheadingRef}
            className="text-lg md:text-xl text-gray-600 mb-8 max-w-md"
          >
            Premium clothing for the modern individual.
            <br />
            Trendy, comfortable, and affordable.
          </p>
          
          <button 
            ref={ctaRef}
            onClick={() => setView('products')}
            className="btn-primary w-fit"
          >
            Shop Now
          </button>
        </div>

        {/* Right - Images */}
        <div className="relative h-[500px] md:h-[600px] lg:h-[700px] order-1 lg:order-2">
          {/* Image 1 - Pink Pajama */}
          <div 
            ref={image1Ref}
            className="absolute top-0 right-0 w-[70%] md:w-[60%] aspect-[9/16] z-10"
          >
            <div className="image-hover w-full h-full">
              <img 
                src="/images/a6d77f0d-84ac-4b80-9f86-4c1914f66d41.jpeg" 
                alt="Hello Kitty Pink Pajama"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute bottom-4 left-4 bg-black text-white px-3 py-1 text-xs font-medium">
              PK-01
            </div>
          </div>

          {/* Image 2 - Black Sweatpants */}
          <div 
            ref={image2Ref}
            className="absolute bottom-0 left-0 w-[60%] md:w-[50%] aspect-square z-20"
          >
            <div className="image-hover w-full h-full">
              <img 
                src="/images/fd23f38b-8591-46c9-97d1-c0df9da76fff.jpeg" 
                alt="Black Sweatpants"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute bottom-4 right-4 bg-black text-white px-3 py-1 text-xs font-medium">
              BL-01
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border border-gray-200 -z-10" />
          <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-black" />
          <div className="absolute bottom-1/4 right-1/3 w-3 h-3 bg-gray-300" />
        </div>
      </div>
    </section>
  );
}

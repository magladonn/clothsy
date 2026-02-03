import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { CheckCircle, Phone, Package, Truck, HandCoins, Mail } from 'lucide-react';
import type { View } from '@/types';

interface ConfirmationProps {
  setView: (view: View) => void;
  orderId: string;
}

export function Confirmation({ setView, orderId }: ConfirmationProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.fromTo(contentRef.current,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: 'expo.out' }
    );
  }, []);

  return (
    <section ref={contentRef} className="pt-32 pb-16 px-8 md:px-16 lg:px-24 min-h-screen">
      <div className="max-w-2xl mx-auto text-center">
        {/* Success Icon */}
        <div className="mb-8">
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto" />
        </div>

        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Thank You for Your Order!
        </h1>
        
        <p className="text-gray-600 text-lg mb-8">
          Your order has been received and is being processed.
        </p>

        {/* Order Details Box */}
        <div className="bg-gray-50 p-6 rounded-lg mb-8 text-left">
          <div className="flex justify-between py-3 border-b border-gray-200">
            <span className="text-gray-600">Order Number:</span>
            <span className="font-bold">#{orderId}</span>
          </div>
          <div className="flex justify-between py-3 border-b border-gray-200">
            <span className="text-gray-600">Estimated Delivery:</span>
            <span className="font-bold">2-5 Business Days</span>
          </div>
          <div className="flex justify-between py-3">
            <span className="text-gray-600">Payment Method:</span>
            <span className="font-bold">Cash on Delivery</span>
          </div>
        </div>

        {/* What's Next */}
        <div className="text-left mb-8">
          <h3 className="text-xl font-bold mb-4">What's Next?</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center flex-shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <p className="font-medium">Order Confirmation</p>
                <p className="text-gray-500 text-sm">We'll call you within 24 hours to confirm your order</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center flex-shrink-0">
                <Package className="w-5 h-5" />
              </div>
              <div>
                <p className="font-medium">Order Preparation</p>
                <p className="text-gray-500 text-sm">Your order will be prepared and packed with care</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center flex-shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <p className="font-medium">Delivery</p>
                <p className="text-gray-500 text-sm">You'll receive a call when your delivery is on its way</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center flex-shrink-0">
                <HandCoins className="w-5 h-5" />
              </div>
              <div>
                <p className="font-medium">Payment</p>
                <p className="text-gray-500 text-sm">Pay the delivery person when you receive your order</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="bg-gray-50 p-6 rounded-lg mb-8">
          <p className="text-gray-600 mb-4">Have questions about your order?</p>
          <a 
            href="mailto:clothsy.business@gmail.com" 
            className="inline-flex items-center gap-2 text-black font-medium hover:underline"
          >
            <Mail className="w-4 h-4" />
            clothsy.business@gmail.com
          </a>
        </div>

        {/* Continue Shopping */}
        <button 
          onClick={() => setView('products')}
          className="btn-primary"
        >
          Continue Shopping
        </button>
      </div>
    </section>
  );
}

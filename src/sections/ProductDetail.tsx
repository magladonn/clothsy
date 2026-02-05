import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ArrowLeft, Check, Box, Image as ImageIcon } from 'lucide-react';
import emailjs from '@emailjs/browser';
import { dataStore, MOROCCAN_CITIES, formatPrice } from '@/store/dataStore';
import type { View, Product } from '@/types';

// ModelViewer component 
function ModelViewer({ src, alt }: { src: string; alt: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.innerHTML = `
        <model-viewer
          src="${src}"
          alt="${alt}"
          camera-controls
          auto-rotate
          rotation-per-second="30deg"
          shadow-intensity="1"
          camera-orbit="0deg 75deg 105%"
          field-of-view="30deg"
          exposure="1"
          interaction-prompt="none"
          touch-action="pan-y"
          style="width: 100%; height: 100%;"
        ></model-viewer>
      `;
    }
  }, [src, alt]);
  return <div ref={containerRef} className="w-full h-full" />;
}

interface ProductDetailProps {
  setView: (view: View) => void;
  product: Product;
  setCartCount: React.Dispatch<React.SetStateAction<number>>;
  setLastOrderId: (id: string) => void;
}

export function ProductDetail({ setView, product, setCartCount, setLastOrderId }: ProductDetailProps) {
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState(product.colors && product.colors.length > 0 ? product.colors[0] : '');
  
  // State for the currently displayed image
  const [activeImage, setActiveImage] = useState(product.images[0]);
  
  const [quantity, setQuantity] = useState(1);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSubmitted, setOrderSubmitted] = useState(false);
  const [show3D, setShow3D] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // Order form state
  const [customerData, setCustomerData] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    customerAddress: '',
    customerCity: '',
    notes: ''
  });

  // Reset active image when product changes
  useEffect(() => {
    setActiveImage(product.images[0]);
    setSelectedColor(product.colors && product.colors.length > 0 ? product.colors[0] : '');
  }, [product]);

  useEffect(() => {
    gsap.fromTo(contentRef.current,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: 'expo.out' }
    );
  }, []);

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedSize) {
      alert('Please select a size');
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Save to Database (Supabase)
      // We use await here to ensure the ID is generated and saved first
      const newOrder = await dataStore.addOrder({
        productId: product.id,
        productCode: product.code,
        productName: product.name,
        productImage: product.images[0],
        productPrice: product.price,
        size: selectedSize,
        color: selectedColor,
        quantity: quantity,
        customerName: customerData.customerName,
        customerPhone: customerData.customerPhone,
        customerEmail: customerData.customerEmail,
        customerAddress: customerData.customerAddress,
        customerCity: customerData.customerCity,
        notes: customerData.notes || ''
      });

      // 2. Set ID for confirmation page
      setLastOrderId(newOrder.id);

      // 3. Send Email Notification (Non-blocking)
      emailjs.send(
        "service_gn8ecp6", 
        "template_ft3yuor", 
        {
          order_id: newOrder.id,
          to_name: "Magladonn",
          customer_name: customerData.customerName,
          customer_phone: customerData.customerPhone,
          customer_city: customerData.customerCity,
          customer_address: customerData.customerAddress,
          product_name: product.name,
          size: selectedSize,
          color: selectedColor,
          quantity: quantity,
          total_price: product.price * quantity,
          notes: customerData.notes || "No notes"
        },
        "HyBzOZ_aiLwpVDlq0" 
      ).then(() => {
        console.log("Email sent successfully");
      }).catch((err) => {
        console.error("Email failed", err);
      });

      // 4. Update UI
      setOrderSubmitted(true);
      setCartCount((prev: number) => prev + 1);
      
      // Redirect after delay
      setTimeout(() => {
        setView('confirmation');
      }, 2000);

    } catch (error) {
      console.error("Order submission failed:", error);
      alert("Failed to place order. Please check your internet connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showOrderForm) {
    return (
      <section className="pt-32 pb-16 px-8 md:px-16 lg:px-24 min-h-screen">
        <button 
          onClick={() => setShowOrderForm(false)}
          className="flex items-center gap-2 text-sm mb-8 hover:opacity-70 transition-opacity"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Product
        </button>

        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-2">COMPLETE YOUR ORDER</h2>
          <p className="text-gray-600 mb-8">Cash on Delivery - Pay when you receive</p>

          {orderSubmitted ? (
            <div className="bg-green-50 border border-green-200 p-8 text-center animate-fade-in">
              <Check className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-green-800 mb-2">Order Placed Successfully!</h3>
              <p className="text-green-700">Redirecting to confirmation...</p>
            </div>
          ) : (
            <form onSubmit={handleOrderSubmit} className="space-y-6">
              {/* Order Summary */}
              <div className="bg-gray-50 p-6 mb-8">
                <h3 className="font-bold mb-4">Order Summary</h3>
                <div className="flex gap-4">
                  <img src={product.images[0]} alt={product.name} className="w-20 h-20 object-cover" />
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-gray-600">Code: {product.code}</p>
                    <p className="text-sm text-gray-600">Size: {selectedSize} | Color: {selectedColor}</p>
                    <p className="text-sm text-gray-600">Qty: {quantity}</p>
                    <p className="font-bold mt-1">{formatPrice(product.price * quantity)}</p>
                  </div>
                </div>
              </div>

              {/* Customer Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Full Name *</label>
                  <input 
                    type="text"
                    required
                    value={customerData.customerName}
                    onChange={(e) => setCustomerData({...customerData, customerName: e.target.value})}
                    placeholder="Your full name"
                    className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Phone Number *</label>
                  <input 
                    type="tel"
                    required
                    value={customerData.customerPhone}
                    onChange={(e) => setCustomerData({...customerData, customerPhone: e.target.value})}
                    placeholder="06 XX XX XX XX"
                    className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Email Address (Optional)</label>
                <input 
                  type="email"
                  value={customerData.customerEmail}
                  onChange={(e) => setCustomerData({...customerData, customerEmail: e.target.value})}
                  placeholder="your@email.com"
                  className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">City *</label>
                <select 
                  required
                  value={customerData.customerCity}
                  onChange={(e) => setCustomerData({...customerData, customerCity: e.target.value})}
                  className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors"
                >
                  <option value="">Select your city</option>
                  {MOROCCAN_CITIES.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Full Address *</label>
                <textarea 
                  required
                  rows={3}
                  value={customerData.customerAddress}
                  onChange={(e) => setCustomerData({...customerData, customerAddress: e.target.value})}
                  placeholder="Street name, building number, apartment, etc."
                  className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Order Notes (Optional)</label>
                <textarea 
                  rows={2}
                  value={customerData.notes}
                  onChange={(e) => setCustomerData({...customerData, notes: e.target.value})}
                  placeholder="Any special instructions..."
                  className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors"
                />
              </div>

              {/* Payment Method */}
              <div className="bg-gray-50 p-4 rounded">
                <label className="block text-sm font-medium mb-2">Payment Method</label>
                <div className="flex items-center gap-3">
                  <input type="radio" checked readOnly className="w-4 h-4" />
                  <span className="font-medium">Cash on Delivery (COD)</span>
                </div>
                <p className="text-sm text-gray-500 mt-1 ml-7">Pay when you receive your order</p>
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
              >
                {isSubmitting ? (
                  <>Processing...</>
                ) : (
                  <>PLACE ORDER (CASH ON DELIVERY)</>
                )}
              </button>
            </form>
          )}
        </div>
      </section>
    );
  }

  return (
    <section ref={contentRef} className="pt-32 pb-16 px-8 md:px-16 lg:px-24 min-h-screen">
      <button 
        onClick={() => setView('products')}
        className="flex items-center gap-2 text-sm mb-8 hover:opacity-70 transition-opacity"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Products
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Images Column */}
        <div>
          <div className="relative">
            {/* View Toggle */}
            {product.model3d && (
              <div className="absolute top-4 right-4 z-10 flex bg-white shadow-lg rounded-full overflow-hidden">
                <button
                  onClick={() => setShow3D(false)}
                  className={`p-3 transition-colors ${!show3D ? 'bg-black text-white' : 'hover:bg-gray-100'}`}
                  title="View Image"
                >
                  <ImageIcon className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setShow3D(true)}
                  className={`p-3 transition-colors ${show3D ? 'bg-black text-white' : 'hover:bg-gray-100'}`}
                  title="View 3D Model"
                >
                  <Box className="w-5 h-5" />
                </button>
              </div>
            )}
            
            <div className="aspect-[3/4] bg-gray-100 mb-4">
              {show3D && product.model3d ? (
                <ModelViewer 
                  src={product.model3d} 
                  alt={`${product.name} 3D Model`} 
                />
              ) : (
                <img 
                  src={activeImage || product.images[0]} 
                  alt={product.name}
                  className="w-full h-full object-cover transition-opacity duration-300"
                />
              )}
            </div>
          </div>

          {/* THUMBNAIL GALLERY */}
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setActiveImage(img);
                    setShow3D(false); // Switch back to image view if in 3D
                  }}
                  className={`aspect-[3/4] bg-gray-100 overflow-hidden border-2 transition-all ${
                    activeImage === img && !show3D
                      ? 'border-black' 
                      : 'border-transparent hover:border-gray-300'
                  }`}
                >
                  <img 
                    src={img} 
                    alt={`${product.name} view ${index + 1}`} 
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          <p className="text-sm text-gray-500 mb-2">{product.code}</p>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{product.name}</h1>
          <p className="text-2xl font-medium mb-6">{formatPrice(product.price)}</p>
          
          <p className="text-gray-600 mb-8">{product.description}</p>

          {/* Color Selection */}
          {product.colors && product.colors.length > 0 && (
            <div className="mb-6">
              <label className="block text-sm font-medium mb-3">COLOR: {selectedColor}</label>
              <div className="flex gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`w-10 h-10 border-2 transition-all ${
                      selectedColor === color ? 'border-black' : 'border-gray-200'
                    }`}
                    style={{ backgroundColor: color.toLowerCase() }}
                    title={color}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Size Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-3">SIZE</label>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`w-12 h-12 border-2 text-sm font-medium transition-all ${
                    selectedSize === size 
                      ? 'border-black bg-black text-white' 
                      : 'border-gray-200 hover:border-gray-400'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div className="mb-8">
            <label className="block text-sm font-medium mb-3">QUANTITY</label>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 border border-gray-200 flex items-center justify-center hover:border-black transition-colors"
              >
                -
              </button>
              <span className="w-12 text-center font-medium">{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 border border-gray-200 flex items-center justify-center hover:border-black transition-colors"
              >
                +
              </button>
            </div>
          </div>

          {/* Order Button */}
          <button 
            onClick={() => setShowOrderForm(true)}
            className="btn-primary w-full mb-4"
          >
            ORDER NOW (CASH ON DELIVERY)
          </button>

          <div className="mt-auto pt-8 border-t border-gray-200">
            <div className="grid grid-cols-3 gap-4 text-center text-sm">
              <div>
                <p className="font-medium">Fast Delivery</p>
                <p className="text-gray-500 text-xs">2-5 business days</p>
              </div>
              <div>
                <p className="font-medium">Easy Returns</p>
                <p className="text-gray-500 text-xs">Within 14 days</p>
              </div>
              <div>
                <p className="font-medium">Secure</p>
                <p className="text-gray-500 text-xs">Cash on delivery</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ArrowLeft, Check, Box, Image as ImageIcon } from 'lucide-react';
import { dataStore, MOROCCAN_CITIES, FORMSPREE_CONFIG, formatPrice } from '@/store/dataStore';
import type { View, Product } from '@/types';

// ModelViewer component using dangerouslySetInnerHTML to avoid TS issues
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
  const [selectedColor, setSelectedColor] = useState(product.colors[0] || '');
  const [quantity, setQuantity] = useState(1);
  const [showOrderForm, setShowOrderForm] = useState(false);
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

    // Create order in dataStore
    const newOrder = dataStore.addOrder({
      productId: product.id,
      productCode: product.code,
      productName: product.name,
      productImage: product.images[0],
      productPrice: product.price,
      size: selectedSize,
      color: selectedColor,
      quantity: quantity,
      ...customerData
    });

    setLastOrderId(newOrder.id);

    // Submit to Formspree for email notification
    try {
      const formData = new FormData();
      formData.append('_subject', `🛍️ NEW ORDER - CLOTHSY #${newOrder.id}`);
      formData.append('_replyto', FORMSPREE_CONFIG.email);
      formData.append('order_id', newOrder.id);
      formData.append('full_name', customerData.customerName);
      formData.append('phone', customerData.customerPhone);
      formData.append('email', customerData.customerEmail || 'N/A');
      formData.append('city', customerData.customerCity);
      formData.append('address', customerData.customerAddress);
      formData.append('notes', customerData.notes || 'N/A');
      formData.append('product_name', product.name);
      formData.append('product_code', product.code);
      formData.append('size', selectedSize);
      formData.append('color', selectedColor);
      formData.append('quantity', quantity.toString());
      formData.append('unit_price', product.price.toString());
      formData.append('total', (product.price * quantity).toString());
      formData.append('payment_method', 'Cash on Delivery');

      await fetch(FORMSPREE_CONFIG.endpoint, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });
    } catch (error) {
      console.log('Formspree submission error (non-blocking):', error);
    }

    setOrderSubmitted(true);
    setCartCount((prev: number) => prev + 1);
    
    setTimeout(() => {
      setView('confirmation');
    }, 2000);
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
            <div className="bg-green-50 border border-green-200 p-8 text-center">
              <Check className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-green-800 mb-2">Order Placed!</h3>
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
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Order Notes (Optional)</label>
                <textarea 
                  rows={2}
                  value={customerData.notes}
                  onChange={(e) => setCustomerData({...customerData, notes: e.target.value})}
                  placeholder="Any special instructions..."
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

              <button type="submit" className="btn-primary w-full">
                PLACE ORDER (CASH ON DELIVERY)
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
        {/* Product Image / 3D Viewer */}
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
          
          <div className="aspect-[3/4] bg-gray-100">
            {show3D && product.model3d ? (
              <ModelViewer 
                src={product.model3d} 
                alt={`${product.name} 3D Model`} 
              />
            ) : (
              <img 
                src={product.images[0]} 
                alt={product.name}
                className="w-full h-full object-cover"
              />
            )}
          </div>
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          <p className="text-sm text-gray-500 mb-2">{product.code}</p>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{product.name}</h1>
          <p className="text-2xl font-medium mb-6">{formatPrice(product.price)}</p>
          
          <p className="text-gray-600 mb-8">{product.description}</p>

          {/* Color Selection */}
          {product.colors.length > 0 && (
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

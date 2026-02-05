import { useState, useEffect } from 'react';
import { Plus, Trash2, X, Eye, EyeOff } from 'lucide-react';
import { dataStore, formatPrice } from '@/store/dataStore';
import type { Product } from '@/types';

export function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: 'men',
    image: '',
    code: '',
    description: ''
  });

  // 1. Subscribe to Real Data
  useEffect(() => {
    // Initial fetch
    setProducts(dataStore.getProducts());

    // Listen for updates
    const unsubscribe = dataStore.subscribe(() => {
      setProducts([...dataStore.getProducts()]);
    });

    return () => unsubscribe();
  }, []);

  // 2. Async Delete
  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to permanently delete this product?')) {
      await dataStore.deleteProduct(id);
    }
  };

  // 3. Toggle Visibility (Hide/Show)
  const handleToggleVisibility = async (id: string) => {
    await dataStore.toggleProductVisibility(id);
  };

  // 4. Submit to Database
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Prepare the object for Supabase
      // We fill in missing fields with defaults since your simple form doesn't have them yet
      await dataStore.addProduct({
        name: formData.name,
        price: Number(formData.price),
        category: formData.category,
        code: formData.code || `CL-${Math.floor(Math.random() * 10000)}`, // Auto-generate if empty
        images: formData.image ? [formData.image] : [],
        description: formData.description || 'No description provided.',
        sizes: ['S', 'M', 'L', 'XL'], // Default sizes
        colors: ['Standard'],          // Default color
        inStock: true,
        visible: true
      });

      // Reset and close
      setIsModalOpen(false);
      setFormData({ name: '', price: '', category: 'men', image: '', code: '', description: '' });
    } catch (error) {
      alert('Failed to add product. Check console.');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Products</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className={`bg-white border border-gray-200 group relative ${!product.visible ? 'opacity-60' : ''}`}>
            {/* Image Area */}
            <div className="aspect-[3/4] overflow-hidden bg-gray-100 relative">
              <img 
                src={product.images && product.images[0] ? product.images[0] : 'https://placehold.co/400x600?text=No+Image'} 
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              
              {/* Overlay Actions */}
              <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => handleToggleVisibility(product.id)}
                  className="p-2 bg-white text-gray-600 hover:text-black shadow-sm rounded-full"
                  title={product.visible ? "Hide Product" : "Show Product"}
                >
                  {product.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
                <button 
                  onClick={() => handleDelete(product.id)}
                  className="p-2 bg-white text-red-600 hover:text-red-700 shadow-sm rounded-full"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {!product.visible && (
                <div className="absolute inset-0 bg-white/50 flex items-center justify-center">
                  <span className="bg-black text-white text-xs px-2 py-1 font-bold uppercase">Hidden</span>
                </div>
              )}
            </div>

            {/* Info Area */}
            <div className="p-4">
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-bold truncate pr-4">{product.name}</h3>
                <span className="text-sm font-medium">{formatPrice(product.price)}</span>
              </div>
              <p className="text-sm text-gray-500 capitalize">{product.category}</p>
              <p className="text-xs text-gray-400 mt-2">Code: {product.code}</p>
            </div>
          </div>
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-20 text-gray-500">
          No products found. Add one to get started!
        </div>
      )}

      {/* Add Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Add New Product</h2>
              <button onClick={() => setIsModalOpen(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Product Name</label>
                <input
                  required
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full p-2 border border-gray-300 focus:border-black outline-none"
                  placeholder="e.g. Classic White Tee"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Price</label>
                  <input
                    required
                    type="number"
                    value={formData.price}
                    onChange={e => setFormData({...formData, price: e.target.value})}
                    className="w-full p-2 border border-gray-300 focus:border-black outline-none"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={e => setFormData({...formData, category: e.target.value})}
                    className="w-full p-2 border border-gray-300 focus:border-black outline-none"
                  >
                    <option value="men">Men</option>
                    <option value="women">Women</option>
                    <option value="kids">Kids</option>
                    <option value="accessories">Accessories</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Code (Optional)</label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={e => setFormData({...formData, code: e.target.value})}
                  className="w-full p-2 border border-gray-300 focus:border-black outline-none"
                  placeholder="Leave empty to auto-generate"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  className="w-full p-2 border border-gray-300 focus:border-black outline-none"
                  placeholder="Short description..."
                  rows={2}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Image URL</label>
                <div className="flex flex-col gap-2">
                  <input
                    type="url"
                    value={formData.image}
                    onChange={e => setFormData({...formData, image: e.target.value})}
                    placeholder="https://..."
                    className="w-full p-2 border border-gray-300 focus:border-black outline-none"
                  />
                  {formData.image && (
                    <div className="aspect-square w-20 bg-gray-100 border rounded overflow-hidden">
                       <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="btn-primary w-full mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Saving...' : 'Save Product'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

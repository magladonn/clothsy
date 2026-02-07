import { useState, useEffect } from 'react';
import { Plus, Trash2, X, Eye, EyeOff, Search } from 'lucide-react';
import { dataStore, formatPrice } from '@/store/dataStore';
import type { Product } from '@/types';

export function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState(''); // ✅ New Search State
  
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
    setProducts(dataStore.getProducts());
    const unsubscribe = dataStore.subscribe(() => {
      setProducts([...dataStore.getProducts()]);
    });
    return () => unsubscribe();
  }, []);

  // 2. Handlers
  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to permanently delete this product?')) {
      await dataStore.deleteProduct(id);
    }
  };

  const handleToggleVisibility = async (id: string) => {
    await dataStore.toggleProductVisibility(id);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await dataStore.addProduct({
        name: formData.name,
        price: Number(formData.price),
        category: formData.category,
        code: formData.code || `CL-${Math.floor(Math.random() * 10000)}`,
        images: formData.image ? [formData.image] : [],
        description: formData.description || 'No description provided.',
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['Standard'],
        inStock: true,
        visible: true
      });

      setIsModalOpen(false);
      setFormData({ name: '', price: '', category: 'men', image: '', code: '', description: '' });
    } catch (error) {
      alert('Failed to add product. Check console.');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ✅ 3. Search Filter Logic
  const filteredProducts = products.filter(product => {
    const searchLower = searchQuery.toLowerCase();
    return (
      product.name.toLowerCase().includes(searchLower) ||
      product.category.toLowerCase().includes(searchLower) ||
      (product.code && product.code.toLowerCase().includes(searchLower))
    );
  });

  return (
    <div className="p-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold">Products</h1>
        
        <div className="flex gap-4 w-full md:w-auto">
          {/* ✅ Search Input */}
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search products..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors"
            />
          </div>

          <button 
            onClick={() => setIsModalOpen(true)}
            className="btn-primary flex items-center gap-2 whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            Add Product
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <div key={product.id} className={`bg-white border border-gray-200 group relative ${!product.visible ? 'opacity-75' : ''}`}>
            {/* Image Area */}
            <div className="aspect-[3/4] overflow-hidden bg-gray-100 relative">
              <img 
                src={product.images && product.images[0] ? product.images[0] : 'https://placehold.co/400x600?text=No+Image'} 
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              
              {/* Actions Overlay */}
              <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                <button 
                  onClick={() => handleToggleVisibility(product.id)}
                  className="p-2 bg-white text-gray-600 hover:text-black shadow-sm rounded-full cursor-pointer"
                  title={product.visible ? "Hide Product" : "Show Product"}
                >
                  {product.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
                <button 
                  onClick={() => handleDelete(product.id)}
                  className="p-2 bg-white text-red-600 hover:text-red-700 shadow-sm rounded-full cursor-pointer"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {!product.visible && (
                <div className="absolute inset-0 bg-white/50 flex items-center justify-center pointer-events-none">
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
              <div className="flex justify-between items-center mt-2">
                <p className="text-xs text-gray-400">Code: {product.code}</p>
                {product.inStock ? (
                  <span className="text-xs text-green-600 font-medium">In Stock</span>
                ) : (
                  <span className="text-xs text-red-500 font-medium">Out of Stock</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-20 text-gray-500">
          {products.length === 0 
            ? "No products found. Add one to get started!" 
            : `No products match "${searchQuery}"`}
        </div>
      )}

      {/* Add Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md p-6 max-h-[90vh] overflow-y-auto rounded-lg">
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
                  className="w-full p-2 border border-gray-300 focus:border-black outline-none rounded"
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
                    className="w-full p-2 border border-gray-300 focus:border-black outline-none rounded"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={e => setFormData({...formData, category: e.target.value})}
                    className="w-full p-2 border border-gray-300 focus:border-black outline-none rounded"
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
                  className="w-full p-2 border border-gray-300 focus:border-black outline-none rounded"
                  placeholder="Leave empty to auto-generate"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  className="w-full p-2 border border-gray-300 focus:border-black outline-none rounded"
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
                    className="w-full p-2 border border-gray-300 focus:border-black outline-none rounded"
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
                className="w-full bg-black text-white py-3 font-medium hover:bg-gray-800 transition-colors rounded disabled:opacity-50 disabled:cursor-not-allowed"
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

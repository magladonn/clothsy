import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, Image as ImageIcon } from 'lucide-react';
import { dataStore, formatPrice } from '@/store/dataStore';
import type { Product } from '@/types';

export function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: 'men',
    image: '',
    code: ''
  });

  useEffect(() => {
    setProducts(dataStore.getProducts());
  }, []);

  const handleDelete = (id: string) => {
    if (confirm('Delete this product?')) {
      dataStore.deleteProduct(id);
      setProducts(dataStore.getProducts());
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Create new product object
    const newProduct: Product = {
      id: Math.random().toString(36).substr(2, 9),
      name: formData.name,
      price: Number(formData.price),
      category: formData.category as 'men' | 'women' | 'kids',
      image: formData.image || 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80',
      code: formData.code || `CL-${Math.floor(Math.random() * 1000)}`
    };

    dataStore.addProduct(newProduct);
    setProducts(dataStore.getProducts());
    setIsModalOpen(false);
    setFormData({ name: '', price: '', category: 'men', image: '', code: '' });
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
          <div key={product.id} className="bg-white border border-gray-200 group relative">
            <div className="aspect-[3/4] overflow-hidden bg-gray-100 relative">
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => handleDelete(product.id)}
                  className="p-2 bg-white text-red-600 hover:text-red-700 shadow-sm"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-bold truncate pr-4">{product.name}</h3>
                <span className="text-sm font-medium">{formatPrice(product.price)}</span>
              </div>
              <p className="text-sm text-gray-500 capitalize">{product.category}</p>
              <p className="text-xs text-gray-400 mt-2">Code: {product.code || 'N/A'}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Add Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md p-6">
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
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Image URL</label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={formData.image}
                    onChange={e => setFormData({...formData, image: e.target.value})}
                    placeholder="https://..."
                    className="w-full p-2 border border-gray-300 focus:border-black outline-none"
                  />
                  {formData.image && (
                    <img src={formData.image} alt="Preview" className="w-10 h-10 object-cover border" />
                  )}
                </div>
              </div>

              <button type="submit" className="btn-primary w-full mt-4">
                Save Product
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

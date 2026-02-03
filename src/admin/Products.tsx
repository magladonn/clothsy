import { useState, useEffect } from 'react';
import { Plus, Trash2, X, Eye, EyeOff, Download } from 'lucide-react';
import { dataStore, formatPrice } from '@/store/dataStore';
import type { Product } from '@/types';

export function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    price: 0,
    sizes: [] as string[],
    colors: [] as string[],
    images: [] as string[],
    category: 'mens' as 'mens' | 'womens' | 'accessories',
    inStock: true,
    visible: true
  });

  useEffect(() => {
    setProducts(dataStore.getProducts());
  }, []);

  const handleAddProduct = () => {
    if (!formData.code || !formData.name || !formData.price) {
      alert('Please fill in all required fields');
      return;
    }

    if (editingProduct) {
      dataStore.updateProduct(editingProduct.id, formData);
    } else {
      dataStore.addProduct(formData);
    }
    setProducts(dataStore.getProducts());
    setShowAddForm(false);
    setEditingProduct(null);
    resetForm();
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      dataStore.deleteProduct(id);
      setProducts(dataStore.getProducts());
    }
  };

  const handleToggleVisibility = (id: string) => {
    dataStore.toggleProductVisibility(id);
    setProducts(dataStore.getProducts());
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      code: product.code,
      name: product.name,
      description: product.description,
      price: product.price,
      sizes: product.sizes,
      colors: product.colors,
      images: product.images,
      category: product.category,
      inStock: product.inStock,
      visible: product.visible
    });
    setShowAddForm(true);
  };

  const resetForm = () => {
    setFormData({
      code: '',
      name: '',
      description: '',
      price: 0,
      sizes: [],
      colors: [],
      images: [],
      category: 'mens',
      inStock: true,
      visible: true
    });
  };

  const addSize = (size: string) => {
    if (!formData.sizes.includes(size)) {
      setFormData({ ...formData, sizes: [...formData.sizes, size] });
    }
  };

  const removeSize = (size: string) => {
    setFormData({ ...formData, sizes: formData.sizes.filter(s => s !== size) });
  };

  const addColor = (color: string) => {
    if (!formData.colors.includes(color)) {
      setFormData({ ...formData, colors: [...formData.colors, color] });
    }
  };

  const removeColor = (color: string) => {
    setFormData({ ...formData, colors: formData.colors.filter(c => c !== color) });
  };

  const exportProducts = () => {
    const csv = [
      'ID,Code,Name,Category,Price,Sizes,Stock,Visible',
      ...products.map(p => `${p.id},${p.code},"${p.name}",${p.category},${p.price},"${p.sizes.join(',')}",${p.inStock ? 'Yes' : 'No'},${p.visible ? 'Yes' : 'No'}`)
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `clothsy_products_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Products</h1>
        <div className="flex gap-2">
          <button 
            onClick={exportProducts}
            className="btn-secondary flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
          <button 
            onClick={() => {
              setEditingProduct(null);
              resetForm();
              setShowAddForm(true);
            }}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Product
          </button>
        </div>
      </div>

      {/* Add/Edit Product Form */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
              <button onClick={() => setShowAddForm(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Product Code *</label>
                  <input 
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({...formData, code: e.target.value})}
                    placeholder="PK-01"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Price (MAD) *</label>
                  <input 
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
                    placeholder="149"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Product Name *</label>
                <input 
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Product name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea 
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Product description..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <select 
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value as 'mens' | 'womens' | 'accessories'})}
                >
                  <option value="mens">Mens</option>
                  <option value="womens">Womens</option>
                  <option value="accessories">Accessories</option>
                </select>
              </div>

              {/* Sizes */}
              <div>
                <label className="block text-sm font-medium mb-2">Sizes</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.sizes.map((size) => (
                    <span key={size} className="bg-black text-white px-3 py-1 text-sm flex items-center gap-2">
                      {size}
                      <button onClick={() => removeSize(size)}><X className="w-3 h-3" /></button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  {['XS', 'S', 'M', 'L', 'XL', 'XXL', 'One Size'].map((size) => (
                    <button
                      key={size}
                      onClick={() => addSize(size)}
                      className={`px-3 py-1 text-sm border ${
                        formData.sizes.includes(size) ? 'bg-black text-white' : 'hover:border-black'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Colors */}
              <div>
                <label className="block text-sm font-medium mb-2">Colors</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.colors.map((color) => (
                    <span key={color} className="bg-gray-100 px-3 py-1 text-sm flex items-center gap-2">
                      {color}
                      <button onClick={() => removeColor(color)}><X className="w-3 h-3" /></button>
                    </span>
                  ))}
                </div>
                <input 
                  type="text"
                  placeholder="Type color and press Enter"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      addColor(e.currentTarget.value);
                      e.currentTarget.value = '';
                    }
                  }}
                />
              </div>

              {/* Image URLs */}
              <div>
                <label className="block text-sm font-medium mb-2">Image URLs</label>
                <input 
                  type="text"
                  placeholder="Enter image URL and press Enter"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      setFormData({
                        ...formData, 
                        images: [...formData.images, e.currentTarget.value]
                      });
                      e.currentTarget.value = '';
                    }
                  }}
                />
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.images.map((_img, i) => (
                    <span key={i} className="bg-gray-100 px-3 py-1 text-xs">
                      Image {i + 1}
                    </span>
                  ))}
                </div>
              </div>

              {/* Visibility Toggle */}
              <div className="flex items-center gap-2">
                <input 
                  type="checkbox"
                  id="visible"
                  checked={formData.visible}
                  onChange={(e) => setFormData({...formData, visible: e.target.checked})}
                  className="w-4 h-4"
                />
                <label htmlFor="visible" className="text-sm">Visible in store</label>
              </div>

              <div className="flex gap-4 pt-4">
                <button onClick={handleAddProduct} className="btn-primary flex-1">
                  {editingProduct ? 'Update Product' : 'Add Product'}
                </button>
                <button onClick={() => setShowAddForm(false)} className="btn-secondary">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-white border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Image</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Product</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Category</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Price</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Sizes</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Visible</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4">
                  <img 
                    src={product.images[0] || '/images/placeholder.jpg'} 
                    alt={product.name}
                    className="w-12 h-16 object-cover"
                  />
                </td>
                <td className="py-3 px-4">
                  <p className="font-medium text-sm">{product.name}</p>
                  <p className="text-xs text-gray-500">{product.code}</p>
                </td>
                <td className="py-3 px-4 text-sm capitalize">{product.category}</td>
                <td className="py-3 px-4 text-sm font-medium">{formatPrice(product.price)}</td>
                <td className="py-3 px-4 text-sm">{product.sizes.join(', ')}</td>
                <td className="py-3 px-4">
                  <button 
                    onClick={() => handleToggleVisibility(product.id)}
                    className={`p-2 rounded ${product.visible ? 'text-green-600 bg-green-50' : 'text-gray-400 bg-gray-100'}`}
                  >
                    {product.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                </td>
                <td className="py-3 px-4">
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleEditProduct(product)}
                      className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDeleteProduct(product.id)}
                      className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {products.length === 0 && (
        <div className="text-center py-24">
          <p className="text-gray-500">No products yet. Add your first product!</p>
        </div>
      )}
    </div>
  );
}

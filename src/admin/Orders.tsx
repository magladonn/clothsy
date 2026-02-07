import { useState, useEffect } from 'react';
import { Check, X, Truck, Package, RotateCcw, Download, Eye, Search } from 'lucide-react';
import { dataStore, formatPrice } from '@/store/dataStore';
import type { Order } from '@/types';

export function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState(''); // ✅ New Search State
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);

  // 1. Real-time Data Subscription
  useEffect(() => {
    setOrders(dataStore.getOrders());
    const unsubscribe = dataStore.subscribe(() => {
      setOrders([...dataStore.getOrders()]);
    });
    return () => unsubscribe();
  }, []);

  // 2. Handlers
  const handleStatusChange = async (orderId: string, newStatus: Order['status']) => {
    await dataStore.updateOrderStatus(orderId, newStatus);
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (confirm('Are you sure you want to delete this order?')) {
      await dataStore.deleteOrder(orderId);
      if (viewingOrder?.id === orderId) setViewingOrder(null);
    }
  };

  const exportOrders = () => {
    const csv = dataStore.exportOrdersToCSV();
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `clothsy_orders_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  // ✅ 3. Updated Filter Logic (Status + Search)
  const filteredOrders = orders.filter(order => {
    const matchesStatus = filter === 'all' || order.status === filter;
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = 
      order.id.toLowerCase().includes(searchLower) ||
      order.customerName.toLowerCase().includes(searchLower) ||
      order.customerPhone.includes(searchLower) ||
      order.customerCity.toLowerCase().includes(searchLower);

    return matchesStatus && matchesSearch;
  });

  const statusOptions: Order['status'][] = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Orders</h1>
        <div className="flex gap-4">
          <button 
            onClick={exportOrders}
            className="btn-secondary flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>

      {/* ✅ Search and Filters Bar */}
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-8">
        {/* Status Tabs */}
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => setFilter('all')}
            className={`px-4 py-2 text-sm font-medium transition-all ${
              filter === 'all' ? 'bg-black text-white' : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          {statusOptions.map((status) => (
            <button 
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 text-sm font-medium transition-all capitalize ${
                filter === status ? 'bg-black text-white' : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search orders..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors"
          />
        </div>
      </div>

      {/* Orders Table */}
      {filteredOrders.length === 0 ? (
        <div className="text-center py-24 bg-gray-50 border border-gray-200 rounded-lg">
          <p className="text-gray-500">No orders found matching "{searchQuery}"</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 overflow-hidden rounded-lg shadow-sm">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Order ID</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Date</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Customer</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Phone</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Total</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4 font-medium text-sm">{order.id}</td>
                  <td className="py-3 px-4 text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="py-3 px-4 text-sm font-medium">{order.customerName}</td>
                  <td className="py-3 px-4 text-sm text-gray-500">{order.customerPhone}</td>
                  <td className="py-3 px-4 text-sm font-medium">{formatPrice(order.productPrice * order.quantity)}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 text-xs font-bold rounded-full uppercase tracking-wider ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-1">
                      <button 
                        onClick={() => setViewingOrder(order)}
                        className="p-1.5 text-gray-500 hover:bg-gray-100 rounded transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      
                      {/* Status Actions */}
                      {order.status === 'pending' && (
                        <button onClick={() => handleStatusChange(order.id, 'confirmed')} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded" title="Confirm">
                          <Check className="w-4 h-4" />
                        </button>
                      )}
                      {order.status === 'confirmed' && (
                        <button onClick={() => handleStatusChange(order.id, 'shipped')} className="p-1.5 text-purple-600 hover:bg-purple-50 rounded" title="Ship">
                          <Truck className="w-4 h-4" />
                        </button>
                      )}
                      {order.status === 'shipped' && (
                        <button onClick={() => handleStatusChange(order.id, 'delivered')} className="p-1.5 text-green-600 hover:bg-green-50 rounded" title="Deliver">
                          <Package className="w-4 h-4" />
                        </button>
                      )}
                      
                      {/* Reset / Cancel / Delete */}
                      {(order.status === 'cancelled' || order.status === 'delivered') ? (
                         <button onClick={() => handleStatusChange(order.id, 'pending')} className="p-1.5 text-gray-400 hover:bg-gray-100 rounded" title="Reset">
                           <RotateCcw className="w-4 h-4" />
                         </button>
                      ) : (
                        <button onClick={() => handleStatusChange(order.id, 'cancelled')} className="p-1.5 text-red-600 hover:bg-red-50 rounded" title="Cancel">
                          <X className="w-4 h-4" />
                        </button>
                      )}
                      
                      <button onClick={() => handleDeleteOrder(order.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded" title="Delete">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Order Detail Modal */}
      {viewingOrder && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 rounded-lg shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Order Details</h2>
              <button onClick={() => setViewingOrder(null)} className="p-2 hover:bg-gray-100 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              <div className="flex justify-between items-start bg-gray-50 p-4 rounded-lg">
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold">Order ID</p>
                  <p className="font-mono font-medium">{viewingOrder.id}</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${getStatusColor(viewingOrder.status)}`}>
                  {viewingOrder.status}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Customer</p>
                  <p className="font-medium">{viewingOrder.customerName}</p>
                  <p className="text-sm text-gray-600">{viewingOrder.customerPhone}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Shipping Address</p>
                  <p className="text-sm">{viewingOrder.customerAddress}</p>
                  <p className="text-sm font-medium">{viewingOrder.customerCity}</p>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4">
                <p className="text-xs text-gray-500 uppercase font-semibold mb-3">Items</p>
                <div className="flex gap-4">
                  <div className="w-20 h-24 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                    {viewingOrder.productImage ? (
                      <img src={viewingOrder.productImage} alt={viewingOrder.productName} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No Img</div>
                    )}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{viewingOrder.productName}</p>
                    {viewingOrder.productCode && <p className="text-xs text-gray-500">Code: {viewingOrder.productCode}</p>}
                    <p className="text-sm text-gray-600 mt-1">Size: {viewingOrder.size} | Color: {viewingOrder.color}</p>
                    <p className="text-sm text-gray-600">Qty: {viewingOrder.quantity} x {formatPrice(viewingOrder.productPrice)}</p>
                  </div>
                </div>
              </div>

              {viewingOrder.notes && (
                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
                  <p className="text-xs text-yellow-800 uppercase font-bold mb-1">Customer Notes</p>
                  <p className="text-sm text-yellow-900">{viewingOrder.notes}</p>
                </div>
              )}

              <div className="border-t border-gray-200 pt-4 flex justify-between items-center">
                <span className="font-medium text-gray-500">Total Amount</span>
                <span className="text-2xl font-bold">{formatPrice(viewingOrder.productPrice * viewingOrder.quantity)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

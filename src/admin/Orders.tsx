import { useState, useEffect } from 'react';
import { Check, X, Truck, Package, RotateCcw, Download, Eye } from 'lucide-react';
import { dataStore, formatPrice } from '@/store/dataStore';
import type { Order } from '@/types';

export function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);

  useEffect(() => {
    setOrders(dataStore.getOrders());
  }, []);

  const handleStatusChange = (orderId: string, newStatus: Order['status']) => {
    dataStore.updateOrderStatus(orderId, newStatus);
    setOrders(dataStore.getOrders());
  };

  const handleDeleteOrder = (orderId: string) => {
    if (confirm('Are you sure you want to delete this order?')) {
      dataStore.deleteOrder(orderId);
      setOrders(dataStore.getOrders());
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

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(o => o.status === filter);

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
        <button 
          onClick={exportOrders}
          className="btn-secondary flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-8">
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

      {/* Orders Table */}
      {filteredOrders.length === 0 ? (
        <div className="text-center py-24 bg-gray-50">
          <p className="text-gray-500">No orders found</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Order ID</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Date</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Customer</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Phone</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">City</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Total</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Status</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">{order.id}</td>
                  <td className="py-3 px-4 text-sm">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="py-3 px-4 text-sm">{order.customerName}</td>
                  <td className="py-3 px-4 text-sm">{order.customerPhone}</td>
                  <td className="py-3 px-4 text-sm">{order.customerCity}</td>
                  <td className="py-3 px-4 text-sm font-medium">{formatPrice(order.productPrice * order.quantity)}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-1">
                      <button 
                        onClick={() => setViewingOrder(order)}
                        className="p-2 bg-gray-100 hover:bg-gray-200 rounded"
                        title="View"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {order.status === 'pending' && (
                        <button 
                          onClick={() => handleStatusChange(order.id, 'confirmed')}
                          className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded"
                          title="Confirm"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      )}
                      {order.status === 'confirmed' && (
                        <button 
                          onClick={() => handleStatusChange(order.id, 'shipped')}
                          className="p-2 bg-purple-50 text-purple-600 hover:bg-purple-100 rounded"
                          title="Ship"
                        >
                          <Truck className="w-4 h-4" />
                        </button>
                      )}
                      {order.status === 'shipped' && (
                        <button 
                          onClick={() => handleStatusChange(order.id, 'delivered')}
                          className="p-2 bg-green-50 text-green-600 hover:bg-green-100 rounded"
                          title="Deliver"
                        >
                          <Package className="w-4 h-4" />
                        </button>
                      )}
                      {order.status !== 'cancelled' && order.status !== 'delivered' && (
                        <button 
                          onClick={() => handleStatusChange(order.id, 'cancelled')}
                          className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded"
                          title="Cancel"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                      {(order.status === 'cancelled' || order.status === 'delivered') && (
                        <button 
                          onClick={() => handleStatusChange(order.id, 'pending')}
                          className="p-2 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded"
                          title="Reset"
                        >
                          <RotateCcw className="w-4 h-4" />
                        </button>
                      )}
                      <button 
                        onClick={() => handleDeleteOrder(order.id)}
                        className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded"
                        title="Delete"
                      >
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
          <div className="bg-white w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Order Details</h2>
              <button onClick={() => setViewingOrder(null)}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded">
                <p className="text-sm text-gray-500">Order ID</p>
                <p className="font-medium">{viewingOrder.id}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Customer</p>
                  <p className="font-medium">{viewingOrder.customerName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium">{viewingOrder.customerPhone}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500">Address</p>
                <p className="font-medium">{viewingOrder.customerAddress}</p>
                <p className="text-sm">{viewingOrder.customerCity}</p>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <p className="text-sm text-gray-500 mb-2">Product</p>
                <div className="flex gap-4">
                  <img 
                    src={viewingOrder.productImage} 
                    alt={viewingOrder.productName}
                    className="w-20 h-24 object-cover"
                  />
                  <div>
                    <p className="font-medium">{viewingOrder.productName}</p>
                    <p className="text-sm text-gray-500">Code: {viewingOrder.productCode}</p>
                    <p className="text-sm text-gray-500">Size: {viewingOrder.size} | Color: {viewingOrder.color}</p>
                    <p className="text-sm text-gray-500">Qty: {viewingOrder.quantity}</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4 flex justify-between items-center">
                <span className="text-gray-500">Total</span>
                <span className="text-2xl font-bold">{formatPrice(viewingOrder.productPrice * viewingOrder.quantity)}</span>
              </div>

              {viewingOrder.notes && (
                <div className="bg-yellow-50 p-4 rounded">
                  <p className="text-sm text-gray-500">Customer Notes</p>
                  <p className="text-sm">{viewingOrder.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import { useEffect, useState } from 'react';
import { Package, ShoppingCart, Users, TrendingUp, DollarSign } from 'lucide-react';
import { dataStore, formatPrice } from '@/store/dataStore';
import type { SiteStats, Order } from '@/types';

export function AdminDashboard() {
  const [stats, setStats] = useState<SiteStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);

  useEffect(() => {
    // 1. Initial Load
    setStats(dataStore.getStats());
    setRecentOrders(dataStore.getOrders().slice(0, 5));

    // 2. Subscribe to Real-time Updates
    const unsubscribe = dataStore.subscribe(() => {
      setStats({ ...dataStore.getStats() });
      // Get orders, sort by newest (assuming getOrders returns sorted or we sort here), take top 5
      const allOrders = dataStore.getOrders();
      // Ensure we show the absolute newest orders
      const sorted = [...allOrders].sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setRecentOrders(sorted.slice(0, 5));
    });

    return () => unsubscribe();
  }, []);

  if (!stats) return <div className="p-8">Loading dashboard...</div>;

  // Calculate Total Revenue from *all* orders (not just recent ones)
  // We use the price stored on the order itself (historical price)
  const allOrders = dataStore.getOrders();
  const totalRevenue = allOrders.reduce((sum, order) => {
    // Only count non-cancelled orders
    if (order.status === 'cancelled') return sum;
    return sum + (order.productPrice * order.quantity);
  }, 0);

  const statCards = [
    { label: 'Total Products', value: stats.totalProducts || 0, icon: Package, color: 'bg-blue-500' },
    { label: 'Total Orders', value: stats.totalOrders || 0, icon: ShoppingCart, color: 'bg-green-500' },
    { label: 'Subscribers', value: stats.totalSubscribers || 0, icon: Users, color: 'bg-purple-500' },
    { label: 'Total Visits', value: stats.totalVisits || 0, icon: TrendingUp, color: 'bg-orange-500' },
  ];

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
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="bg-white p-6 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className={`${card.color} p-3 rounded-full`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <p className="text-gray-500 text-sm">{card.label}</p>
              <p className="text-3xl font-bold">{card.value.toLocaleString()}</p>
            </div>
          );
        })}
      </div>

      {/* Revenue Card */}
      <div className="bg-white p-6 border border-gray-200 shadow-sm mb-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="bg-black p-3 rounded-full">
            <DollarSign className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Estimated Total Revenue</p>
            <p className="text-3xl font-bold">{formatPrice(totalRevenue)}</p>
          </div>
        </div>
      </div>

      {/* Order Status */}
      <div className="bg-white p-6 border border-gray-200 shadow-sm mb-8">
        <h3 className="font-bold mb-4 text-lg">Order Status Overview</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {Object.entries(stats.ordersByStatus).map(([status, count]) => (
            <div key={status} className="text-center p-4 bg-gray-50 rounded border border-gray-100">
              <p className="text-2xl font-bold">{count}</p>
              <p className="text-sm text-gray-500 capitalize">{status}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white p-6 border border-gray-200 shadow-sm">
        <h3 className="font-bold mb-4 text-lg">Recent Orders</h3>
        {recentOrders.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No orders yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Order ID</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Customer</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">City</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Total</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-sm">{order.id}</td>
                    <td className="py-3 px-4 text-sm">{order.customerName}</td>
                    <td className="py-3 px-4 text-sm">{order.customerCity}</td>
                    <td className="py-3 px-4 text-sm font-medium">{formatPrice(order.productPrice * order.quantity)}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

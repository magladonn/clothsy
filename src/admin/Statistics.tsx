import { useEffect, useState } from 'react';
import { TrendingUp, Users, ShoppingBag, DollarSign, MapPin } from 'lucide-react';
import { dataStore, formatPrice } from '@/store/dataStore';
import type { SiteStats, Order } from '@/types';

export function AdminStatistics() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<SiteStats | null>(null);

  useEffect(() => {
    setOrders(dataStore.getOrders());
    setStats(dataStore.getStats());
  }, []);

  if (!stats) return <div>Loading...</div>;

  // Calculate top cities
  const cityCount: Record<string, number> = {};
  orders.forEach(order => {
    cityCount[order.customerCity] = (cityCount[order.customerCity] || 0) + 1;
  });
  const topCities = Object.entries(cityCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Analytics</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Sales Breakdown */}
        <div className="bg-white p-6 border border-gray-200 shadow-sm">
          <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-purple-600" />
            Order Status Distribution
          </h3>
          <div className="space-y-4">
            {Object.entries(stats.ordersByStatus).map(([status, count]) => {
              const total = stats.totalOrders || 1;
              const percentage = Math.round((count / total) * 100);
              return (
                <div key={status}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="capitalize">{status}</span>
                    <span className="font-medium">{count} ({percentage}%)</span>
                  </div>
                  <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${
                        status === 'delivered' ? 'bg-green-500' : 
                        status === 'cancelled' ? 'bg-red-500' : 'bg-blue-500'
                      }`} 
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Locations */}
        <div className="bg-white p-6 border border-gray-200 shadow-sm">
          <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-orange-600" />
            Top Locations
          </h3>
          <div className="space-y-4">
            {topCities.map(([city, count], index) => (
              <div key={city} className="flex items-center justify-between p-3 bg-gray-50">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 flex items-center justify-center bg-black text-white text-xs font-bold rounded-full">
                    {index + 1}
                  </span>
                  <span className="font-medium">{city}</span>
                </div>
                <span className="text-gray-600 text-sm">{count} orders</span>
              </div>
            ))}
            {topCities.length === 0 && <p className="text-gray-500">No location data yet</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

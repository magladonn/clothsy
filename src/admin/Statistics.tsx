import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, ShoppingCart, Eye, Users } from 'lucide-react';
import { dataStore } from '@/store/dataStore';
import type { SiteStats } from '@/types';

export function AdminStatistics() {
  const [stats, setStats] = useState<SiteStats | null>(null);

  useEffect(() => {
    setStats(dataStore.getStats());
  }, []);

  if (!stats) return null;

  const orderStatusData = Object.entries(stats.ordersByStatus).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value
  }));

  const COLORS = ['#FCD34D', '#60A5FA', '#A78BFA', '#34D399', '#F87171'];

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Statistics</h1>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="stats-card">
          <div className="flex items-center gap-4">
            <div className="bg-blue-500 p-3">
              <Eye className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Total Visits</p>
              <p className="text-2xl font-bold">{stats.totalVisits.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="stats-card">
          <div className="flex items-center gap-4">
            <div className="bg-green-500 p-3">
              <ShoppingCart className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Total Orders</p>
              <p className="text-2xl font-bold">{stats.totalOrders.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="stats-card">
          <div className="flex items-center gap-4">
            <div className="bg-purple-500 p-3">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Subscribers</p>
              <p className="text-2xl font-bold">{stats.totalSubscribers.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="stats-card">
          <div className="flex items-center gap-4">
            <div className="bg-orange-500 p-3">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Conversion Rate</p>
              <p className="text-2xl font-bold">
                {((stats.totalOrders / stats.totalVisits) * 100).toFixed(2)}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Visits Chart */}
        <div className="stats-card">
          <h3 className="font-bold mb-4">Visits (Last 7 Days)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.visitsByDate}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(date) => new Date(date).toLocaleDateString('en', { weekday: 'short' })}
                  stroke="#9ca3af"
                  fontSize={12}
                />
                <YAxis stroke="#9ca3af" fontSize={12} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb' }}
                  labelFormatter={(date) => new Date(date).toLocaleDateString()}
                />
                <Line 
                  type="monotone" 
                  dataKey="visits" 
                  stroke="#000" 
                  strokeWidth={2}
                  dot={{ fill: '#000', strokeWidth: 0, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Orders Chart */}
        <div className="stats-card">
          <h3 className="font-bold mb-4">Orders (Last 7 Days)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.ordersByDate}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(date) => new Date(date).toLocaleDateString('en', { weekday: 'short' })}
                  stroke="#9ca3af"
                  fontSize={12}
                />
                <YAxis stroke="#9ca3af" fontSize={12} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb' }}
                  labelFormatter={(date) => new Date(date).toLocaleDateString()}
                />
                <Bar dataKey="orders" fill="#000" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Order Status Distribution */}
        <div className="stats-card">
          <h3 className="font-bold mb-4">Order Status Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={orderStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {orderStatusData.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            {orderStatusData.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-2">
                <div 
                  className="w-3 h-3" 
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="text-sm">{entry.name}: {entry.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="stats-card">
          <h3 className="font-bold mb-4">Quick Summary</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-gray-600">Average Orders per Day</span>
              <span className="font-bold">
                {(stats.totalOrders / 7).toFixed(1)}
              </span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-gray-600">Average Visits per Day</span>
              <span className="font-bold">
                {Math.round(stats.totalVisits / 7).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-gray-600">Pending Orders</span>
              <span className="font-bold text-yellow-600">{stats.ordersByStatus.pending}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-gray-600">Delivered Orders</span>
              <span className="font-bold text-green-600">{stats.ordersByStatus.delivered}</span>
            </div>
            <div className="flex justify-between items-center py-3">
              <span className="text-gray-600">Cancelled Orders</span>
              <span className="font-bold text-red-600">{stats.ordersByStatus.cancelled}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { LayoutDashboard, Package, ShoppingCart, Users, BarChart3, LogOut, Store } from 'lucide-react';
import type { View } from '@/types';

interface AdminSidebarProps {
  currentView: View;
  setView: (view: View) => void;
  setIsAdmin: (isAdmin: boolean) => void;
}

export function AdminSidebar({ currentView, setView, setIsAdmin }: AdminSidebarProps) {
  const menuItems = [
    { view: 'admin' as View, label: 'Dashboard', icon: LayoutDashboard },
    { view: 'admin-products' as View, label: 'Products', icon: Package },
    { view: 'admin-orders' as View, label: 'Orders', icon: ShoppingCart },
    { view: 'admin-subscribers' as View, label: 'Subscribers', icon: Users },
    { view: 'admin-stats' as View, label: 'Statistics', icon: BarChart3 },
  ];

  const handleLogout = () => {
    setIsAdmin(false);
    setView('home');
  };

  return (
    <aside className="admin-sidebar">
      <div className="p-6 border-b border-white/10">
        <h1 className="text-xl font-bold">CLOTHSY</h1>
        <p className="text-xs text-gray-400 mt-1">Admin Panel</p>
      </div>

      <nav className="py-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.view;
          
          return (
            <button
              key={item.view}
              onClick={() => setView(item.view)}
              className={`admin-sidebar-link w-full ${isActive ? 'active' : ''}`}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
        <button 
          onClick={() => setView('home')}
          className="admin-sidebar-link w-full mb-2"
        >
          <Store className="w-5 h-5" />
          View Store
        </button>
        <button 
          onClick={handleLogout}
          className="admin-sidebar-link w-full text-red-400 hover:text-red-300"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </aside>
  );
}

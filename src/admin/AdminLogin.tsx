import { useState } from 'react';
import { Lock, User, Eye, EyeOff } from 'lucide-react';
import { dataStore } from '@/store/dataStore';
import type { View } from '@/types';

interface AdminLoginProps {
  setView: (view: View) => void;
  setIsAdmin: (isAdmin: boolean) => void;
}

export function AdminLogin({ setView, setIsAdmin }: AdminLoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulate network delay
    setTimeout(() => {
      const isValid = dataStore.authenticateAdmin(username, password);
      
      if (isValid) {
        setIsAdmin(true);
        setView('admin');
      } else {
        setError('Invalid username or password');
      }
      setLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight">CLOTHSY</h1>
          <p className="text-gray-500 mt-2">Admin Panel</p>
        </div>

        {/* Login Form */}
        <div className="bg-white p-8 shadow-lg">
          <h2 className="text-xl font-bold mb-6 text-center">Admin Login</h2>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Username</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 focus:outline-none focus:border-black transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 focus:outline-none focus:border-black transition-colors"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="animate-spin">⟳</span>
              ) : (
                <Lock className="w-4 h-4" />
              )}
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setView('home')}
              className="text-sm text-gray-500 hover:text-black transition-colors"
            >
              ← Back to Store
            </button>
          </div>
        </div>

        {/* Credentials Hint */}
        <div className="mt-6 text-center text-xs text-gray-400">
          <p>Admin accounts: admin1, admin2, admin3</p>
          <p>Password: clothsy2025</p>
        </div>
      </div>
    </div>
  );
}

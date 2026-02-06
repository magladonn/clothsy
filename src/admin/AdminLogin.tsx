import { useState } from 'react';
import { supabase } from '@/store/dataStore';
import { View } from '@/types';
import { Lock, Mail, AlertCircle, Loader2, Eye, EyeOff } from 'lucide-react';

interface AdminLoginProps {
  setView: (view: View) => void;
  setIsAdmin: (isAdmin: boolean) => void;
}

export function AdminLogin({ setView, setIsAdmin }: AdminLoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 🔐 SECURE: Check directly with Supabase
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (authError) {
        console.error('Login failed:', authError.message);
        setError('Invalid email or password.');
      } else if (data.user) {
        console.log('Login successful:', data.user.email);
        setIsAdmin(true);
        setView('admin');
      }
    } catch (err) {
      setError('An unexpected error occurred.');
      console.error(err);
    } finally {
      setLoading(false);
    }
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
        <div className="bg-white p-8 shadow-lg rounded-lg">
          <h2 className="text-xl font-bold mb-6 text-center">Admin Access</h2>

          {error && (
            <div className="bg-red-50 flex items-center text-red-600 p-3 mb-4 text-sm rounded">
              <AlertCircle size={16} className="mr-2" />
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@clothsy.ma"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 focus:outline-none focus:border-black transition-colors rounded"
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
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 focus:outline-none focus:border-black transition-colors rounded"
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
              className="w-full bg-black text-white py-3 font-medium hover:bg-gray-800 transition-colors rounded flex items-center justify-center"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                  Verifying...
                </>
              ) : (
                'Sign In'
              )}
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
      </div>
    </div>
  );
}

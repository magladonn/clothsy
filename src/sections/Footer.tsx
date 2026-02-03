import { Instagram, Twitter, Facebook, Mail, Phone, MapPin } from 'lucide-react';
import type { View } from '@/types';

interface FooterProps {
  setView: (view: View) => void;
}

export function Footer({ setView }: FooterProps) {
  return (
    <footer className="bg-black text-white py-16 px-8 md:px-16 lg:px-24">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <h2 className="text-3xl font-bold mb-4">CLOTHSY</h2>
            <p className="text-gray-400 max-w-sm mb-6">
              Premium clothing for the modern individual. Trendy, comfortable, and affordable.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-400">
                <Mail className="w-4 h-4" />
                <a href="mailto:clothsy.business.ma@gmail.com" className="text-sm hover:text-white transition-colors">
                  clothsy.business.ma@gmail.com
                </a>
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <Phone className="w-4 h-4" />
                <a href="tel:+212786193181" className="text-sm hover:text-white transition-colors">
                  +212 786 193 181
                </a>
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">Morocco</span>
              </div>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-medium mb-4">SHOP</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <button onClick={() => setView('home')} className="hover:text-white transition-colors text-sm">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => setView('products')} className="hover:text-white transition-colors text-sm">
                  Products
                </button>
              </li>
              <li>
                <button onClick={() => setView('contact')} className="hover:text-white transition-colors text-sm">
                  Contact
                </button>
              </li>
              <li>
                <button onClick={() => setView('admin')} className="hover:text-white transition-colors text-sm">
                  Admin
                </button>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="font-medium mb-4">FOLLOW</h3>
            <div className="flex gap-4">
              <a href="#" className="hover:text-gray-400 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-gray-400 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-gray-400 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            © 2025 CLOTHSY. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-gray-500">
            <button className="hover:text-white transition-colors">Privacy Policy</button>
            <button className="hover:text-white transition-colors">Terms of Service</button>
          </div>
        </div>
      </div>
    </footer>
  );
}

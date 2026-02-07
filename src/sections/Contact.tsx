import React, { useState } from 'react';
import { Mail, MapPin, Phone, Send, Check, Loader2 } from 'lucide-react';
import { dataStore } from '@/store/dataStore'; // ✅ Fixed Import

export function Contact() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // We send the contact message as a "General Inquiry" order
      // This ensures it goes to Supabase AND your Google Sheet/Email
      await dataStore.addOrder({
        customerName: formData.name,
        customerPhone: formData.phone || "No Phone",
        customerEmail: formData.email, // Passing email for the auto-reply
        customerCity: "Online Inquiry",
        customerAddress: "N/A",
        productName: "💬 Contact Message", // Special name to identify it in sheets
        productPrice: 0,
        quantity: 1,
        size: "-",
        color: "-",
        notes: formData.message // The actual message goes here
      });

      setSuccess(true);
      setFormData({ name: '', email: '', phone: '', message: '' });
      
      // Reset success message after 5 seconds
      setTimeout(() => setSuccess(false), 5000);
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <section id="contact" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-black mb-4 uppercase tracking-wider">Contact Us</h2>
          <div className="w-24 h-1 bg-black mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="bg-gray-50 p-10">
            <h3 className="text-2xl font-bold mb-8 uppercase">Get in Touch</h3>
            
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="bg-black p-3 rounded-none">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-1">Phone / WhatsApp</h4>
                  <p className="text-gray-600">+212 786-193181</p>
                  <p className="text-sm text-gray-500 mt-1">Available 9am - 8pm</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-black p-3 rounded-none">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-1">Email</h4>
                  <p className="text-gray-600">contact@clothsy.ma</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-black p-3 rounded-none">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-1">Location</h4>
                  <p className="text-gray-600">Casablanca, Morocco</p>
                  <p className="text-sm text-gray-500 mt-1">Shipping all over Morocco</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white p-6 border border-gray-200">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase">Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-gray-50 border border-gray-200 px-4 py-3 focus:outline-none focus:border-black transition-colors"
                  placeholder="Your Name"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 uppercase">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full bg-gray-50 border border-gray-200 px-4 py-3 focus:outline-none focus:border-black transition-colors"
                    placeholder="+212..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 uppercase">Email</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-gray-50 border border-gray-200 px-4 py-3 focus:outline-none focus:border-black transition-colors"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase">Message</label>
                <textarea
                  name="message"
                  required
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full bg-gray-50 border border-gray-200 px-4 py-3 focus:outline-none focus:border-black transition-colors"
                  placeholder="How can we help you?"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={loading || success}
                className={`w-full py-4 px-6 flex items-center justify-center space-x-2 transition-all duration-300 ${
                  success 
                    ? 'bg-green-600 text-white' 
                    : 'bg-black text-white hover:bg-gray-800'
                }`}
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : success ? (
                  <>
                    <Check className="w-5 h-5" />
                    <span>Message Sent!</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Send Message</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

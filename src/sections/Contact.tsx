import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { Mail, MapPin, Phone, Send, Check } from 'lucide-react';
import { dataStore, EMAILJS_CONFIG } from '@/store/dataStore';
import emailjs from '@emailjs/browser';

export function Contact() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [messageData, setMessageData] = useState({ name: '', email: '', message: '' });
  const [messageSent, setMessageSent] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.fromTo(contentRef.current,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: 'expo.out' }
    );
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      const result = dataStore.addSubscriber(email);
      if (result) {
        setSubscribed(true);
        setEmail('');
        setTimeout(() => setSubscribed(false), 3000);
      } else {
        alert('You are already subscribed!');
      }
    }
  };

  const handleMessageSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if EmailJS is configured
    if (EMAILJS_CONFIG.serviceId === 'YOUR_SERVICE_ID' || 
        EMAILJS_CONFIG.templateId === 'YOUR_TEMPLATE_ID' || 
        EMAILJS_CONFIG.publicKey === 'YOUR_PUBLIC_KEY') {
      alert('⚠️ Please configure EmailJS first!\n\nSteps:\n1. Go to https://www.emailjs.com\n2. Create free account\n3. Update EMAILJS_CONFIG in dataStore.ts');
      return;
    }

    try {
      // Send email via EmailJS
      await emailjs.send(
        EMAILJS_CONFIG.serviceId,
        EMAILJS_CONFIG.templateId,
        {
          from_name: messageData.name,
          from_email: messageData.email,
          message: messageData.message,
          to_email: EMAILJS_CONFIG.email
        },
        EMAILJS_CONFIG.publicKey
      );

      setMessageSent(true);
      setMessageData({ name: '', email: '', message: '' });
      setTimeout(() => setMessageSent(false), 3000);
    } catch (error) {
      console.error('EmailJS error:', error);
      alert('Failed to send message. Please try again or contact us directly at ' + EMAILJS_CONFIG.email);
    }
  };

  return (
    <section ref={contentRef} className="pt-32 pb-16 px-8 md:px-16 lg:px-24 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">CONTACT</h1>
        <p className="text-gray-600 mb-12 max-w-xl">Get in touch with us for any inquiries, collaborations, or just to say hello.</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Info */}
          <div>
            <div className="space-y-8 mb-12">
              <div className="flex items-start gap-4">
                <Mail className="w-5 h-5 mt-1" />
                <div>
                  <h3 className="font-medium mb-1">Email</h3>
                  <a href="mailto:clothsy.business.ma@gmail.com" className="text-gray-600 hover:text-black transition-colors">
                    clothsy.business.ma@gmail.com
                  </a>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <Phone className="w-5 h-5 mt-1" />
                <div>
                  <h3 className="font-medium mb-1">Phone</h3>
                  <a href="tel:+212786193181" className="text-gray-600 hover:text-black transition-colors">
                    +212 786 193 181
                  </a>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <MapPin className="w-5 h-5 mt-1" />
                <div>
                  <h3 className="font-medium mb-1">Location</h3>
                  <p className="text-gray-600">Morocco</p>
                </div>
              </div>
            </div>

            {/* Newsletter */}
            <div className="bg-gray-50 p-8">
              <h3 className="font-bold mb-2">SUBSCRIBE TO THE DROP</h3>
              <p className="text-sm text-gray-600 mb-4">Be the first to know about new releases and exclusive offers.</p>
              
              {subscribed ? (
                <div className="flex items-center gap-2 text-green-600">
                  <Check className="w-5 h-5" />
                  <span className="font-medium">Thanks for subscribing!</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2">
                  <input 
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="flex-1"
                  />
                  <button type="submit" className="btn-primary px-4">
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <h2 className="text-xl font-bold mb-6">SEND US A MESSAGE</h2>
            
            {messageSent ? (
              <div className="bg-green-50 border border-green-200 p-8 text-center">
                <Check className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-green-800 mb-2">Message Sent!</h3>
                <p className="text-green-700">We will get back to you soon.</p>
              </div>
            ) : (
              <form onSubmit={handleMessageSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Name</label>
                  <input 
                    type="text"
                    required
                    value={messageData.name}
                    onChange={(e) => setMessageData({...messageData, name: e.target.value})}
                    placeholder="Your name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input 
                    type="email"
                    required
                    value={messageData.email}
                    onChange={(e) => setMessageData({...messageData, email: e.target.value})}
                    placeholder="your@email.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Message</label>
                  <textarea 
                    required
                    rows={5}
                    value={messageData.message}
                    onChange={(e) => setMessageData({...messageData, message: e.target.value})}
                    placeholder="Your message..."
                  />
                </div>
                
                <button type="submit" className="btn-primary w-full">
                  SEND MESSAGE
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

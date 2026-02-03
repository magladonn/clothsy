import { useState, useEffect } from 'react';
import { Mail, Trash2, Download } from 'lucide-react';
import { dataStore } from '@/store/dataStore';
import type { Subscriber } from '@/types';

export function AdminSubscribers() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);

  useEffect(() => {
    setSubscribers(dataStore.getSubscribers());
  }, []);

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to remove this subscriber?')) {
      setSubscribers(subscribers.filter(s => s.id !== id));
    }
  };

  const handleExport = () => {
    const csv = [
      'Email,Subscribed Date',
      ...subscribers.map(s => `${s.email},${new Date(s.subscribedAt).toLocaleDateString()}`)
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'subscribers.csv';
    a.click();
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Subscribers</h1>
        <button 
          onClick={handleExport}
          className="btn-secondary flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {/* Stats */}
      <div className="stats-card mb-8">
        <div className="flex items-center gap-4">
          <div className="bg-purple-500 p-3">
            <Mail className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Total Subscribers</p>
            <p className="text-3xl font-bold">{subscribers.length}</p>
          </div>
        </div>
      </div>

      {/* Subscribers List */}
      {subscribers.length === 0 ? (
        <div className="text-center py-24 bg-gray-50">
          <Mail className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No subscribers yet</p>
          <p className="text-sm text-gray-400 mt-2">Subscribers will appear here when they sign up</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200">
          <div className="grid grid-cols-3 gap-4 p-4 border-b border-gray-200 font-medium text-sm text-gray-500">
            <div>Email</div>
            <div>Subscribed Date</div>
            <div>Actions</div>
          </div>
          {subscribers.map((subscriber) => (
            <div 
              key={subscriber.id} 
              className="grid grid-cols-3 gap-4 p-4 border-b border-gray-100 hover:bg-gray-50 items-center"
            >
              <div className="font-medium">{subscriber.email}</div>
              <div className="text-sm text-gray-500">
                {new Date(subscriber.subscribedAt).toLocaleDateString()}
              </div>
              <div>
                <button 
                  onClick={() => handleDelete(subscriber.id)}
                  className="p-2 bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

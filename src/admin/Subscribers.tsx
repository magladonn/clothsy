import { useState, useEffect } from 'react';
import { Mail, Calendar, Trash2, Download } from 'lucide-react';
import { dataStore } from '@/store/dataStore';

interface Subscriber {
  email: string;
  date: string;
}

export function AdminSubscribers() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);

  useEffect(() => {
    // Assuming dataStore has this method, if not, you'll need to add it to store
    // or simulate it: dataStore.getSubscribers()
    const subs = dataStore.getSubscribers ? dataStore.getSubscribers() : [
      { email: 'demo@example.com', date: '2025-01-15' },
      { email: 'user@test.com', date: '2025-02-01' }
    ];
    setSubscribers(subs);
  }, []);

  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Email,Date Joined\n"
      + subscribers.map(e => `${e.email},${e.date}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "subscribers.csv");
    document.body.appendChild(link);
    link.click();
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Subscribers</h1>
          <p className="text-gray-500 mt-1">Newsletter email list management</p>
        </div>
        <button onClick={handleExport} className="btn-secondary flex items-center gap-2">
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      <div className="bg-white border border-gray-200">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left py-4 px-6 font-medium text-gray-500">Email Address</th>
              <th className="text-left py-4 px-6 font-medium text-gray-500">Date Subscribed</th>
              <th className="text-right py-4 px-6 font-medium text-gray-500">Action</th>
            </tr>
          </thead>
          <tbody>
            {subscribers.map((sub, index) => (
              <tr key={index} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-50 p-2 rounded-full">
                      <Mail className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="font-medium">{sub.email}</span>
                  </div>
                </td>
                <td className="py-4 px-6 text-gray-500">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    {sub.date}
                  </div>
                </td>
                <td className="py-4 px-6 text-right">
                  <button className="text-gray-400 hover:text-red-600 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {subscribers.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No subscribers yet
          </div>
        )}
      </div>
    </div>
  );
}

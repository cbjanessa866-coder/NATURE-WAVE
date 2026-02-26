import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';

interface Submission {
  id: number;
  name: string;
  email: string;
  category: string;
  description: string;
  file_url: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

export default function AdminDashboard() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const response = await fetch('/api/submissions');
      if (!response.ok) throw new Error('Failed to fetch submissions');
      const data = await response.json();
      setSubmissions(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: number, status: string) => {
    try {
      const response = await fetch(`/api/submissions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) throw new Error('Failed to update status');
      
      // Optimistic update
      setSubmissions(submissions.map(sub => 
        sub.id === id ? { ...sub, status: status as any } : sub
      ));
    } catch (err: any) {
      alert('Update failed: ' + err.message);
    }
  };

  if (loading) return <div className="min-h-screen bg-black text-white flex items-center justify-center">Loading...</div>;
  if (error) return <div className="min-h-screen bg-black text-white flex items-center justify-center text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-neutral-950 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-bold">作品管理后台</h1>
          <a href="/" className="text-gray-400 hover:text-white transition-colors">返回首页</a>
        </header>

        <div className="grid gap-6">
          {submissions.map((sub) => (
            <motion.div 
              key={sub.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-neutral-900 border border-white/10 rounded-xl p-6 flex flex-col md:flex-row gap-6"
            >
              <div className="w-full md:w-64 h-48 bg-neutral-800 rounded-lg overflow-hidden shrink-0">
                {sub.file_url.endsWith('.pdf') ? (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">PDF Document</div>
                ) : (
                  <img src={sub.file_url} alt={sub.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                )}
              </div>
              
              <div className="flex-1">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">{sub.name}</h3>
                    <p className="text-gray-400 text-sm">{sub.email} · {sub.category}</p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider
                    ${sub.status === 'approved' ? 'bg-green-500/20 text-green-500' : 
                      sub.status === 'rejected' ? 'bg-red-500/20 text-red-500' : 
                      'bg-yellow-500/20 text-yellow-500'}`}>
                    {sub.status}
                  </div>
                </div>
                
                <p className="text-gray-300 mb-6 bg-neutral-800/50 p-4 rounded-lg text-sm leading-relaxed">
                  {sub.description || '无描述'}
                </p>

                <div className="flex gap-3">
                  <button 
                    onClick={() => updateStatus(sub.id, 'approved')}
                    className="px-4 py-2 bg-white text-black font-medium rounded-lg hover:bg-gray-200 transition-colors text-sm"
                  >
                    通过审核
                  </button>
                  <button 
                    onClick={() => updateStatus(sub.id, 'rejected')}
                    className="px-4 py-2 bg-transparent border border-white/20 text-white font-medium rounded-lg hover:bg-white/10 transition-colors text-sm"
                  >
                    拒绝
                  </button>
                  <a 
                    href={sub.file_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="px-4 py-2 text-gray-400 hover:text-white transition-colors text-sm ml-auto"
                  >
                    下载原图
                  </a>
                </div>
              </div>
            </motion.div>
          ))}

          {submissions.length === 0 && (
            <div className="text-center py-20 text-gray-500">
              暂无投稿作品
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

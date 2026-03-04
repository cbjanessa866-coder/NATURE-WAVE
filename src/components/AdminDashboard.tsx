import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import * as qiniu from 'qiniu-js';
import { Upload, Copy, Check, Lock } from 'lucide-react';

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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'submissions' | 'upload'>('submissions');

  // Upload State
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    const auth = sessionStorage.getItem('admin_auth');
    if (auth === 'true') {
      setIsAuthenticated(true);
      fetchSubmissions();
    } else {
      setLoading(false);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple hardcoded password for demo purposes
    // In a real app, this should verify against a backend API
    if (password === 'nature2026') {
      setIsAuthenticated(true);
      sessionStorage.setItem('admin_auth', 'true');
      fetchSubmissions();
    } else {
      alert('密码错误');
    }
  };

  const handleUpload = async () => {
    if (!uploadFile) return;
    setIsUploading(true);
    try {
      // 1. Get Upload Token
      const tokenRes = await fetch('/api/upload-token');
      if (!tokenRes.ok) throw new Error('Failed to get upload token');
      const { token, domain } = await tokenRes.json();

      // 2. Upload to Qiniu
      const key = `static/${Date.now()}-${uploadFile.name}`;
      const putExtra = {
        fname: uploadFile.name,
        params: {},
        mimeType: undefined
      };
      const config = {
        useCdnDomain: true,
        // region: null // Auto-detect
      };

      const observable = qiniu.upload(uploadFile, key, token, putExtra, config);

      await new Promise((resolve, reject) => {
        observable.subscribe({
          next: () => {},
          error: (err) => reject(err),
          complete: (res) => resolve(res)
        });
      });

      // 3. Set URL
      const url = domain 
        ? `${domain.replace(/\/$/, '')}/${key}`
        : `http://taws5nht0.hn-bkt.clouddn.com/${key}`; // Fallback (should not happen if env is set)
      
      setUploadedUrl(url);
      setUploadFile(null);
    } catch (err: any) {
      alert('上传失败: ' + err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(uploadedUrl);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch('/api/submissions', {
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Request failed with status ${response.status}`);
      }
      
      const data = await response.json();
      setSubmissions(data);
    } catch (err: any) {
      console.error('Fetch error:', err);
      if (err.name === 'AbortError') {
        setError('Request timed out.');
      } else {
        setError(err.message || 'Failed to load submissions');
      }
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
      
      setSubmissions(submissions.map(sub => 
        sub.id === id ? { ...sub, status: status as any } : sub
      ));
    } catch (err: any) {
      alert('Update failed: ' + err.message);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="bg-neutral-900 border border-white/10 p-8 rounded-2xl w-full max-w-md">
          <div className="flex justify-center mb-6">
            <div className="w-12 h-12 bg-neutral-800 rounded-full flex items-center justify-center">
              <Lock className="text-white" size={24} />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white text-center mb-6">管理员登录</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="请输入管理员密码"
                className="w-full bg-neutral-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-white text-black font-bold py-3 rounded-xl hover:bg-gray-200 transition-colors"
            >
              登录
            </button>
            <p className="text-center text-gray-500 text-sm mt-4">默认密码: nature2026</p>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold">后台管理</h1>
            <div className="flex bg-neutral-900 rounded-lg p-1 border border-white/10">
              <button
                onClick={() => setActiveTab('submissions')}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                  activeTab === 'submissions' ? 'bg-white text-black' : 'text-gray-400 hover:text-white'
                }`}
              >
                投稿管理
              </button>
              <button
                onClick={() => setActiveTab('upload')}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                  activeTab === 'upload' ? 'bg-white text-black' : 'text-gray-400 hover:text-white'
                }`}
              >
                静态资源上传
              </button>
            </div>
          </div>
          <div className="flex gap-4">
            <a href="/" className="text-gray-400 hover:text-white transition-colors">返回首页</a>
            <button 
              onClick={() => {
                sessionStorage.removeItem('admin_auth');
                setIsAuthenticated(false);
              }}
              className="text-red-400 hover:text-red-300 transition-colors"
            >
              退出登录
            </button>
          </div>
        </header>

        {activeTab === 'submissions' ? (
          <div className="grid gap-6">
            {loading ? (
              <div className="text-center py-20 text-gray-500">加载中...</div>
            ) : error ? (
              <div className="text-center py-20 text-red-500">{error}</div>
            ) : (
              <>
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
              </>
            )}
          </div>
        ) : (
          <div className="max-w-2xl mx-auto">
            <div className="bg-neutral-900 border border-white/10 rounded-xl p-8">
              <h2 className="text-xl font-bold mb-6">上传网站静态资源</h2>
              
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-400 mb-2">选择图片</label>
                <div className="relative border-2 border-dashed border-white/10 rounded-xl p-8 text-center hover:border-white/20 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="flex flex-col items-center pointer-events-none">
                    <Upload className="mb-4 text-gray-400" size={32} />
                    {uploadFile ? (
                      <p className="text-white font-medium">{uploadFile.name}</p>
                    ) : (
                      <p className="text-gray-400">点击或拖拽上传图片</p>
                    )}
                  </div>
                </div>
              </div>

              <button
                onClick={handleUpload}
                disabled={!uploadFile || isUploading}
                className="w-full bg-white text-black font-bold py-3 rounded-xl hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-8"
              >
                {isUploading ? '上传中...' : '开始上传'}
              </button>

              {uploadedUrl && (
                <div className="bg-neutral-800 rounded-xl p-4 border border-white/10">
                  <p className="text-sm text-gray-400 mb-2">图片链接 (可直接复制用于替换网站图片)</p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      readOnly
                      value={uploadedUrl}
                      className="flex-1 bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white font-mono"
                    />
                    <button
                      onClick={copyToClipboard}
                      className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-lg transition-colors"
                    >
                      {copySuccess ? <Check size={18} /> : <Copy size={18} />}
                    </button>
                  </div>
                  <div className="mt-4 aspect-video bg-black/50 rounded-lg overflow-hidden flex items-center justify-center">
                    <img src={uploadedUrl} alt="Preview" className="max-h-full max-w-full object-contain" referrerPolicy="no-referrer" />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

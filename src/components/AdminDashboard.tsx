import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import * as qiniu from 'qiniu-js';
import { Upload, Copy, Check, Lock, FileText, Image as ImageIcon } from 'lucide-react';

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

interface Application {
  id: number;
  name: string;
  contact: string;
  description: string;
  portfolio_urls: string[];
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'submissions' | 'applications' | 'upload'>('submissions');

  // Upload State
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    const auth = sessionStorage.getItem('admin_auth');
    if (auth === 'true') {
      setIsAuthenticated(true);
      fetchData();
    } else {
      setLoading(false);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'nature2026') {
      setIsAuthenticated(true);
      sessionStorage.setItem('admin_auth', 'true');
      fetchData();
    } else {
      alert('密码错误');
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      await Promise.all([fetchSubmissions(), fetchApplications()]);
    } catch (err: any) {
      console.error('Fetch error:', err);
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const fetchSubmissions = async () => {
    const response = await fetch('/api/submissions');
    if (!response.ok) throw new Error('Failed to fetch submissions');
    const data = await response.json();
    setSubmissions(data);
  };

  const fetchApplications = async () => {
    const response = await fetch('/api/applications');
    if (!response.ok) throw new Error('Failed to fetch applications');
    const data = await response.json();
    setApplications(data);
  };

  const updateSubmissionStatus = async (id: number, status: string) => {
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

  const updateApplicationStatus = async (id: number, status: string) => {
    try {
      const response = await fetch(`/api/applications/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) throw new Error('Failed to update status');
      
      setApplications(applications.map(app => 
        app.id === id ? { ...app, status: status as any } : app
      ));
    } catch (err: any) {
      alert('Update failed: ' + err.message);
    }
  };

  const handleUpload = async () => {
    if (!uploadFile) return;
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', uploadFile);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || '上传失败');
      }

      const { url } = await response.json();
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
                onClick={() => setActiveTab('applications')}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                  activeTab === 'applications' ? 'bg-white text-black' : 'text-gray-400 hover:text-white'
                }`}
              >
                签约申请
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

        {loading ? (
          <div className="text-center py-20 text-gray-500">加载中...</div>
        ) : error ? (
          <div className="text-center py-20 text-red-500">{error}</div>
        ) : (
          <>
            {activeTab === 'submissions' && (
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
                        <div className="w-full h-full flex items-center justify-center text-gray-400 flex-col gap-2">
                          <FileText size={32} />
                          <span>PDF Document</span>
                        </div>
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
                          onClick={() => updateSubmissionStatus(sub.id, 'approved')}
                          className="px-4 py-2 bg-white text-black font-medium rounded-lg hover:bg-gray-200 transition-colors text-sm"
                        >
                          通过审核
                        </button>
                        <button 
                          onClick={() => updateSubmissionStatus(sub.id, 'rejected')}
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
                  <div className="text-center py-20 text-gray-500">暂无投稿作品</div>
                )}
              </div>
            )}

            {activeTab === 'applications' && (
              <div className="grid gap-6">
                {applications.map((app) => (
                  <motion.div 
                    key={app.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-neutral-900 border border-white/10 rounded-xl p-6"
                  >
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h3 className="text-xl font-bold text-white mb-1">{app.name}</h3>
                        <p className="text-gray-400 text-sm">{app.contact}</p>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider
                        ${app.status === 'approved' ? 'bg-green-500/20 text-green-500' : 
                          app.status === 'rejected' ? 'bg-red-500/20 text-red-500' : 
                          'bg-yellow-500/20 text-yellow-500'}`}>
                        {app.status}
                      </div>
                    </div>

                    <p className="text-gray-300 mb-6 bg-neutral-800/50 p-4 rounded-lg text-sm leading-relaxed">
                      {app.description || '无备注'}
                    </p>

                    <div className="mb-6">
                      <h4 className="text-sm font-medium text-gray-400 mb-3">作品集 ({app.portfolio_urls.length})</h4>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {app.portfolio_urls.map((url, idx) => (
                          <a 
                            key={idx}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block aspect-square bg-neutral-800 rounded-lg overflow-hidden border border-white/5 hover:border-white/20 transition-colors relative group"
                          >
                            {url.toLowerCase().endsWith('.pdf') ? (
                              <div className="w-full h-full flex items-center justify-center text-gray-500">
                                <FileText size={24} />
                              </div>
                            ) : (
                              <img src={url} alt={`Portfolio ${idx + 1}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            )}
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <span className="text-white text-xs">查看</span>
                            </div>
                          </a>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-3 border-t border-white/10 pt-4">
                      <button 
                        onClick={() => updateApplicationStatus(app.id, 'approved')}
                        disabled={app.status === 'approved'}
                        className="px-4 py-2 bg-white text-black font-medium rounded-lg hover:bg-gray-200 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        通过签约
                      </button>
                      <button 
                        onClick={() => updateApplicationStatus(app.id, 'rejected')}
                        disabled={app.status === 'rejected'}
                        className="px-4 py-2 bg-transparent border border-white/20 text-white font-medium rounded-lg hover:bg-white/10 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        拒绝
                      </button>
                    </div>
                  </motion.div>
                ))}
                {applications.length === 0 && (
                  <div className="text-center py-20 text-gray-500">暂无签约申请</div>
                )}
              </div>
            )}

            {activeTab === 'upload' && (
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
          </>
        )}
      </div>
    </div>
  );
}

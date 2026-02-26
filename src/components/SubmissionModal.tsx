import { motion, AnimatePresence } from 'motion/react';
import { X, Upload, Send } from 'lucide-react';
import React, { useState } from 'react';
import type { FormEvent } from 'react';

interface SubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SubmissionModal({ isOpen, onClose }: SubmissionModalProps) {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    category: '风光摄影',
    description: ''
  });
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setUploadError('');

    try {
      let fileUrl = '';
      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('name', formState.name);
        formData.append('email', formState.email);
        formData.append('category', formState.category);
        formData.append('description', formState.description);

        const response = await fetch('/api/submissions', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Upload failed');
        }

        const data = await response.json();
        console.log('Submission success:', data);
      } else {
        throw new Error('请选择文件');
      }
      
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
        setFormState({
          name: '',
          email: '',
          category: '风光摄影',
          description: ''
        });
        setFile(null);
      }, 2000);
    } catch (error: any) {
      console.error('Submission error:', error);
      setUploadError(error.message || '提交失败，请重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60]"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-[70] flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="bg-neutral-900 border border-white/10 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden pointer-events-auto">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <h3 className="text-xl font-semibold text-white">我要投稿</h3>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-white transition-colors p-1"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Body */}
              <div className="p-6">
                {isSuccess ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mb-4">
                      <CheckIcon />
                    </div>
                    <h4 className="text-xl font-bold text-white mb-2">投稿成功！</h4>
                    <p className="text-gray-400">感谢您的参与，我们将尽快审核您的作品。</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">姓名</label>
                      <input
                        type="text"
                        required
                        value={formState.name}
                        onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                        className="w-full bg-neutral-800 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all"
                        placeholder="请输入您的姓名"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">电子邮箱</label>
                      <input
                        type="email"
                        required
                        value={formState.email}
                        onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                        className="w-full bg-neutral-800 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all"
                        placeholder="your@email.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">投稿类别</label>
                      <select
                        value={formState.category}
                        onChange={(e) => setFormState({ ...formState, category: e.target.value })}
                        className="w-full bg-neutral-800 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all appearance-none"
                      >
                        <option>风光摄影</option>
                        <option>城市建筑</option>
                        <option>人文纪实</option>
                        <option>观念摄影</option>
                        <option>商业广告</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">上传作品 (图片/PDF)</label>
                      <div className="relative">
                        <input
                          type="file"
                          required
                          accept="image/*,.pdf"
                          onChange={handleFileChange}
                          className="w-full bg-neutral-800 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-500 file:text-white hover:file:bg-orange-600"
                        />
                      </div>
                      {uploadError && <p className="text-red-500 text-sm mt-1">{uploadError}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">创作理念 / 作品简介</label>
                      <textarea
                        rows={3}
                        value={formState.description}
                        onChange={(e) => setFormState({ ...formState, description: e.target.value })}
                        className="w-full bg-neutral-800 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all resize-none"
                        placeholder="请简要描述您的作品..."
                      />
                    </div>

                    <div className="flex items-start gap-2 p-3 bg-neutral-800/50 rounded-xl border border-white/5">
                      <div className="mt-0.5 min-w-[16px]">
                        <input type="checkbox" required className="accent-orange-500 w-4 h-4" />
                      </div>
                      <p className="text-xs text-gray-400 leading-relaxed">
                        我声明拥有所提交作品的完整版权，并同意该作品将同时用于申请成为 <span className="text-orange-500 font-medium">NATURE WAVE 认证摄影师</span>。
                      </p>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-white text-black font-bold py-3 rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <span className="animate-pulse">提交中...</span>
                      ) : (
                        <>
                          提交作品 <Send size={18} />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function CheckIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

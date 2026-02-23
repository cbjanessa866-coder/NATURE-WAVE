import { motion, AnimatePresence } from 'motion/react';
import { X, Upload, Send, Check } from 'lucide-react';
import { useState } from 'react';
import type { FormEvent } from 'react';

interface SigningModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SigningModal({ isOpen, onClose }: SigningModalProps) {
  const [formState, setFormState] = useState({
    name: '',
    contact: '',
    images: null as FileList | null,
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
        setFormState({
          name: '',
          contact: '',
          images: null,
          description: ''
        });
      }, 3000);
    }, 1500);
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
                <h3 className="text-xl font-semibold text-white">申请签约摄影师</h3>
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
                      <Check size={32} />
                    </div>
                    <h4 className="text-xl font-bold text-white mb-2">提交成功！</h4>
                    <p className="text-gray-400 max-w-xs mx-auto">
                      我们已收到您的申请。结果将在 3-5 个工作日内通过联系方式通知您。
                    </p>
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
                        placeholder="请输入您的真实姓名"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">联系方式 (手机/微信/邮箱)</label>
                      <input
                        type="text"
                        required
                        value={formState.contact}
                        onChange={(e) => setFormState({ ...formState, contact: e.target.value })}
                        className="w-full bg-neutral-800 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all"
                        placeholder="方便我们联系您的方式"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">上传作品 (图片/PDF)</label>
                      <div className="relative group">
                        <div className={`border-2 border-dashed rounded-xl p-6 text-center transition-all ${
                          formState.images && formState.images.length > 0 
                            ? 'border-orange-500/50 bg-orange-500/5' 
                            : 'border-white/10 hover:border-white/30 hover:bg-white/5'
                        }`}>
                          <input
                            type="file"
                            multiple
                            accept="image/*,.pdf"
                            onChange={(e) => setFormState({ ...formState, images: e.target.files })}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                          />
                          <div className="flex flex-col items-center justify-center pointer-events-none">
                            <Upload className={`mb-3 ${
                              formState.images && formState.images.length > 0 ? 'text-orange-500' : 'text-gray-500'
                            }`} size={32} />
                            
                            {formState.images && formState.images.length > 0 ? (
                              <div>
                                <p className="text-white font-medium">{formState.images.length} 个文件已选择</p>
                                <p className="text-xs text-gray-500 mt-1">点击重新选择</p>
                              </div>
                            ) : (
                              <div>
                                <p className="text-gray-300 text-sm">点击或拖拽文件至此</p>
                                <p className="text-xs text-gray-500 mt-1">支持 JPG, PNG, PDF (最大 50MB)</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">作品集链接 / 备注 (可选)</label>
                      <textarea
                        rows={2}
                        value={formState.description}
                        onChange={(e) => setFormState({ ...formState, description: e.target.value })}
                        className="w-full bg-neutral-800 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all resize-none"
                        placeholder="https://... 或其他说明"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-white text-black font-bold py-3 rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <span className="animate-pulse">提交中...</span>
                      ) : (
                        <>
                          提交申请 <Send size={18} />
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

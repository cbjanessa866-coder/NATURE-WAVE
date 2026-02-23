import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Phone, Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
}

export default function ContactModal({ isOpen, onClose, title }: ContactModalProps) {
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
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
            <div className="bg-neutral-900 border border-white/10 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden pointer-events-auto">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <h3 className="text-xl font-semibold text-white">{title}</h3>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-white transition-colors p-1"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Body */}
              <div className="p-8 space-y-6">
                <div className="space-y-4">
                  {/* Email */}
                  <div className="bg-neutral-800/50 rounded-xl p-4 border border-white/5 group hover:border-white/10 transition-colors">
                    <div className="flex items-center gap-3 mb-2 text-gray-400">
                      <Mail size={18} />
                      <span className="text-sm font-medium">邮箱</span>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-white font-mono text-sm sm:text-base break-all">daliankey.photo@foxmail.com</span>
                      <button 
                        onClick={() => handleCopy('daliankey.photo@foxmail.com', 'email')}
                        className="text-gray-500 hover:text-white transition-colors flex-shrink-0"
                        title="复制邮箱"
                      >
                        {copied === 'email' ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                      </button>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="bg-neutral-800/50 rounded-xl p-4 border border-white/5 group hover:border-white/10 transition-colors">
                    <div className="flex items-center gap-3 mb-2 text-gray-400">
                      <Phone size={18} />
                      <span className="text-sm font-medium">电话</span>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-white font-mono text-sm sm:text-base">15640825505</span>
                      <button 
                        onClick={() => handleCopy('15640825505', 'phone')}
                        className="text-gray-500 hover:text-white transition-colors flex-shrink-0"
                        title="复制电话"
                      >
                        {copied === 'phone' ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                      </button>
                    </div>
                  </div>
                </div>
                
                <p className="text-center text-sm text-gray-500">
                  期待与您的合作！
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

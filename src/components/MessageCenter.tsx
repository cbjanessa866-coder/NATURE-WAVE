import { motion, AnimatePresence } from 'motion/react';
import { X, Bell, CheckCircle, Info, AlertCircle } from 'lucide-react';
import { useState } from 'react';

interface Message {
  id: string;
  type: 'info' | 'success' | 'warning';
  title: string;
  content: string;
  time: string;
  read: boolean;
}

interface MessageCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

const initialMessages: Message[] = [
  {
    id: '1',
    type: 'info',
    title: '展览即将开始',
    content: 'NATURE WAVE 2026 青年摄影展将于下周一正式开幕，请提前安排行程。',
    time: '10分钟前',
    read: false,
  },
  {
    id: '2',
    type: 'success',
    title: '投稿审核通过',
    content: '恭喜！您的作品《城市微光》已通过初审，请等待复审通知。',
    time: '2小时前',
    read: false,
  },
  {
    id: '3',
    type: 'warning',
    title: '系统维护通知',
    content: '我们将于本周日凌晨 2:00 进行系统维护，预计耗时 2 小时。',
    time: '1天前',
    read: true,
  },
  {
    id: '4',
    type: 'info',
    title: '新功能上线',
    content: '线上展厅现已支持 VR 浏览模式，欢迎体验。',
    time: '3天前',
    read: true,
  }
];

export default function MessageCenter({ isOpen, onClose }: MessageCenterProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const markAsRead = (id: string) => {
    setMessages(messages.map(msg => 
      msg.id === id ? { ...msg, read: true } : msg
    ));
  };

  const markAllAsRead = () => {
    setMessages(messages.map(msg => ({ ...msg, read: true })));
  };

  const deleteMessage = (id: string) => {
    setMessages(messages.filter(msg => msg.id !== id));
  };

  const filteredMessages = messages.filter(msg => {
    if (filter === 'unread') return !msg.read;
    return true;
  });

  const unreadCount = messages.filter(m => !m.read).length;

  const getIcon = (type: Message['type']) => {
    switch (type) {
      case 'success': return <CheckCircle className="text-green-500" size={20} />;
      case 'warning': return <AlertCircle className="text-orange-500" size={20} />;
      default: return <Info className="text-blue-500" size={20} />;
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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-neutral-900 border-l border-white/10 z-[70] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/10 flex items-center justify-between bg-neutral-900/50 backdrop-blur-md sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Bell className="text-white" size={24} />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] flex items-center justify-center text-white font-bold animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </div>
                <h2 className="text-xl font-bold text-white">消息中心</h2>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>

            {/* Controls */}
            <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-neutral-900">
              <div className="flex gap-2">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    filter === 'all' 
                      ? 'bg-white text-black' 
                      : 'bg-white/5 text-gray-400 hover:bg-white/10'
                  }`}
                >
                  全部
                </button>
                <button
                  onClick={() => setFilter('unread')}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    filter === 'unread' 
                      ? 'bg-white text-black' 
                      : 'bg-white/5 text-gray-400 hover:bg-white/10'
                  }`}
                >
                  未读
                </button>
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                >
                  全部已读
                </button>
              )}
            </div>

            {/* Message List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {filteredMessages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                  <Bell size={48} className="mb-4 opacity-20" />
                  <p>暂无消息</p>
                </div>
              ) : (
                filteredMessages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className={`p-4 rounded-xl border transition-all relative group ${
                      msg.read 
                        ? 'bg-white/5 border-transparent' 
                        : 'bg-white/10 border-blue-500/30 shadow-lg shadow-blue-900/10'
                    }`}
                    onClick={() => markAsRead(msg.id)}
                  >
                    <div className="flex gap-4">
                      <div className="mt-1 flex-shrink-0">
                        {getIcon(msg.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-1">
                          <h3 className={`text-sm font-semibold truncate pr-4 ${
                            msg.read ? 'text-gray-300' : 'text-white'
                          }`}>
                            {msg.title}
                          </h3>
                          <span className="text-xs text-gray-500 flex-shrink-0 whitespace-nowrap">
                            {msg.time}
                          </span>
                        </div>
                        <p className={`text-sm leading-relaxed mb-3 ${
                          msg.read ? 'text-gray-500' : 'text-gray-300'
                        }`}>
                          {msg.content}
                        </p>
                        
                        <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteMessage(msg.id);
                            }}
                            className="text-xs text-red-400 hover:text-red-300 px-2 py-1 hover:bg-red-500/10 rounded"
                          >
                            删除
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    {!msg.read && (
                      <div className="absolute top-4 right-4 w-2 h-2 bg-blue-500 rounded-full" />
                    )}
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

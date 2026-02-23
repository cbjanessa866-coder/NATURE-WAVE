import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, ChevronRight, Play, Bell } from 'lucide-react';

interface NavbarProps {
  onOpenSubmission: () => void;
  onOpenMessages: () => void;
}

export default function Navbar({ onOpenSubmission, onOpenMessages }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: '展览', href: '#exhibition' },
    { name: '作品', href: '#works' },
    { name: '场地', href: '#venue' },
    { name: '日程', href: '#schedule' },
    { name: '签约计划', href: '#join' },
    { name: '关于', href: '#about' },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled || isMobileMenuOpen
            ? 'bg-black/80 backdrop-blur-md border-b border-white/10'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-12">
            {/* Logo */}
            <div className="flex-shrink-0 cursor-pointer z-50">
              <img src="/logo.png" alt="NATURE WAVE" className="h-8 w-auto" />
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center">
              <div className="ml-10 flex items-baseline space-x-8">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-xs font-medium transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                ))}
              </div>
              
              <div className="ml-8 flex items-center gap-4">
                <button
                  onClick={onOpenMessages}
                  className="text-gray-300 hover:text-white transition-colors relative"
                  aria-label="消息中心"
                >
                  <Bell size={18} />
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                </button>
                
                <button
                  onClick={onOpenSubmission}
                  className="bg-white/10 hover:bg-white/20 text-white px-4 py-1.5 rounded-full text-xs font-medium transition-colors border border-white/10"
                >
                  我要投稿
                </button>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden z-50 flex items-center gap-4">
              <button
                onClick={onOpenMessages}
                className="text-gray-300 hover:text-white relative"
              >
                <Bell size={18} />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
              </button>
              <button
                onClick={onOpenSubmission}
                className="text-xs font-medium text-orange-500"
              >
                投稿
              </button>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-300 hover:text-white focus:outline-none"
              >
                {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-black pt-20 px-4 md:hidden"
          >
            <div className="flex flex-col space-y-6">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-2xl font-semibold text-white border-b border-white/10 pb-4"
                >
                  {link.name}
                </a>
              ))}
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenMessages();
                }}
                className="text-2xl font-semibold text-white border-b border-white/10 pb-4 text-left flex items-center justify-between"
              >
                消息中心
                <div className="relative">
                  <Bell size={20} />
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
                </div>
              </button>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenSubmission();
                }}
                className="text-2xl font-semibold text-orange-500 border-b border-white/10 pb-4 text-left"
              >
                我要投稿
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

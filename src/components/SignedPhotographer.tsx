import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';



interface SignedPhotographerProps {
  onOpenSigning: () => void;
}

export default function SignedPhotographer({ onOpenSigning }: SignedPhotographerProps) {
  return (
    <section id="join" className="py-32 bg-neutral-950 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-900/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-900/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-orange-500 font-medium tracking-wide uppercase text-sm"
          >
            Join the Collective
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-6xl font-bold text-white mt-4 mb-6"
          >
            成为签约摄影师
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-base md:text-xl text-gray-400 max-w-2xl mx-auto"
          >
            加入 NATURE WAVE 创作集体，与全球顶尖视觉艺术家共同探索影像的边界。
          </motion.p>
        </div>



        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <button 
            onClick={onOpenSigning}
            className="bg-white text-black px-10 py-4 rounded-full font-bold text-lg inline-flex items-center gap-2 hover:scale-105 transition-transform duration-300"
          >
            申请签约
            <ArrowRight size={20} />
          </button>
        </motion.div>
      </div>
    </section>
  );
}

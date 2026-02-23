import { motion } from 'motion/react';

export default function ScheduleSection() {
  return (
    <section id="schedule" className="py-32 bg-black relative overflow-hidden flex items-center justify-center min-h-[60vh]">
      {/* Background Ambience */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-orange-900/20 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 text-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <h2 className="text-orange-500 font-medium tracking-[0.2em] uppercase mb-8 text-sm md:text-base">
            Exhibition Schedule
          </h2>
          
          <div className="relative inline-block">
            <h3 className="text-[120px] md:text-[200px] font-bold leading-none text-transparent bg-clip-text bg-gradient-to-b from-white to-neutral-900 tracking-tighter select-none">
              2026
            </h3>
            <motion.div 
              initial={{ width: 0 }}
              whileInView={{ width: '100%' }}
              transition={{ delay: 0.5, duration: 1 }}
              className="absolute bottom-4 md:bottom-10 left-0 h-1 md:h-2 bg-orange-500"
            />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="mt-12 space-y-4"
          >
            <p className="text-2xl md:text-4xl font-light text-white">
              静候 · 佳期
              <span className="block text-sm md:text-lg text-gray-500 mt-2 font-normal tracking-widest uppercase">
                Coming Soon
              </span>
            </p>
            
            <div className="pt-8">
               <p className="text-gray-400 max-w-md mx-auto leading-relaxed">
                 我们正在精心筹备这场视觉盛宴。具体开展日期将随季节的更迭而至，敬请期待。
               </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

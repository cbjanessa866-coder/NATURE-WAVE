import { motion } from 'motion/react';
import { Camera, Globe, Award, ArrowRight } from 'lucide-react';

export default function JoinUs() {
  return (
    <section id="join-us" className="py-32 bg-neutral-950 px-4 relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black to-neutral-900 opacity-50 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-bold text-white mb-6"
          >
            成为签约摄影师
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, delay: 0.1 }}
            className="text-xl text-gray-400 max-w-2xl mx-auto"
          >
            加入 NATURE WAVE 全球创作者计划，让世界看到你的视界。
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, delay: 0.2 }}
            className="bg-white/5 backdrop-blur-sm p-8 rounded-3xl border border-white/10 hover:bg-white/10 transition-colors"
          >
            <Globe className="w-12 h-12 text-blue-500 mb-6" />
            <h3 className="text-2xl font-bold text-white mb-4">全球巡展机会</h3>
            <p className="text-gray-400 leading-relaxed">
              你的作品将有机会在 NATURE WAVE 全球合作画廊展出，从大连引庭出发，走向巴黎、纽约和东京。
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, delay: 0.3 }}
            className="bg-white/5 backdrop-blur-sm p-8 rounded-3xl border border-white/10 hover:bg-white/10 transition-colors"
          >
            <Camera className="w-12 h-12 text-orange-500 mb-6" />
            <h3 className="text-2xl font-bold text-white mb-4">顶级器材支持</h3>
            <p className="text-gray-400 leading-relaxed">
              获得索尼、佳能等顶级相机品牌的最新器材试用权，以及专业的后期制作工作室支持。
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, delay: 0.4 }}
            className="bg-white/5 backdrop-blur-sm p-8 rounded-3xl border border-white/10 hover:bg-white/10 transition-colors"
          >
            <Award className="w-12 h-12 text-purple-500 mb-6" />
            <h3 className="text-2xl font-bold text-white mb-4">商业变现</h3>
            <p className="text-gray-400 leading-relaxed">
              专属经纪人团队协助对接商业拍摄项目，版权代理与作品销售，让艺术创作实现商业价值。
            </p>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, delay: 0.5 }}
          className="bg-gradient-to-r from-neutral-900 to-neutral-800 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between border border-white/10"
        >
          <div className="mb-8 md:mb-0 md:mr-8 text-center md:text-left">
            <h3 className="text-3xl font-bold text-white mb-2">准备好加入了吗？</h3>
            <p className="text-gray-400">提交你的作品集，开启职业摄影师生涯。</p>
          </div>
          <button className="bg-white text-black px-8 py-4 rounded-full font-bold text-lg flex items-center gap-2 hover:bg-gray-200 transition-colors whitespace-nowrap">
            立即申请 <ArrowRight size={20} />
          </button>
        </motion.div>
      </div>
    </section>
  );
}

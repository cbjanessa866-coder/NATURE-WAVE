import { motion } from 'motion/react';

const judges = [
  {
    name: "Sarah Chen",
    role: "Visual Director",
    image: "https://picsum.photos/seed/judge1/300/400",
    description: "专注纪实摄影，前马格南图片社合作摄影师。"
  },
  {
    name: "David Miller",
    role: "Senior Curator",
    image: "https://picsum.photos/seed/judge2/300/400",
    description: "现代艺术博物馆资深策展人，拥有20年策展经验。"
  },
  {
    name: "Elena Rossi",
    role: "Fine Art Photographer",
    image: "https://picsum.photos/seed/judge3/300/400",
    description: "屡获殊荣的艺术摄影师，以抽象景观作品闻名。"
  },
  {
    name: "Kenji Tanaka",
    role: "Photojournalist",
    image: "https://picsum.photos/seed/judge4/300/400",
    description: "资深战地记者，曾为多家顶级刊物拍摄封面。"
  },
  {
    name: "Maria Gonzalez",
    role: "Fashion Photographer",
    image: "https://picsum.photos/seed/judge5/300/400",
    description: "VOGUE 常驻摄影师，定义当代时尚视觉语言。"
  }
];

export default function FeatureSection() {
  return (
    <section id="exhibition" className="py-32 bg-neutral-950 px-4 overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-32">
        {/* Feature 1 */}
        <div className="flex flex-col md:flex-row items-center gap-12 md:gap-24">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex-1 text-center md:text-left"
          >
            <h3 className="text-orange-500 font-semibold text-lg mb-4">极致画质</h3>
            <h2 className="text-3xl md:text-6xl font-bold text-white mb-6 leading-tight">
              细节. 色彩. <br/> 质感.
            </h2>
            <p className="text-base md:text-xl text-gray-400 leading-relaxed">
              采用博物馆级艺术微喷工艺，呈现令人惊叹的细节与色彩还原。每一幅作品都经过精心装裱，在专业灯光下诉说着光影的故事。
            </p>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex-1 w-full"
          >
            <img 
              src="https://picsum.photos/seed/gallery/800/600" 
              alt="Gallery Experience" 
              className="rounded-3xl shadow-2xl shadow-orange-900/10 w-full"
              referrerPolicy="no-referrer"
            />
          </motion.div>
        </div>

        {/* Feature 2 - Judges Scroll */}
        <div className="flex flex-col md:flex-row items-center gap-12 md:gap-16">
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex-1 text-center md:text-left md:w-1/3 shrink-0"
          >
            <h3 className="text-blue-500 font-semibold text-lg mb-4">评委席展示</h3>
            <h2 className="text-3xl md:text-6xl font-bold text-white mb-6 leading-tight">
              权威 <br/> 视角.
            </h2>
            <p className="text-base md:text-xl text-gray-400 leading-relaxed">
              由国际知名摄影大师组成的评审团，以专业的眼光审视每一幅作品。在这里，您可以近距离了解大师们的创作理念与评审标准。
            </p>
          </motion.div>
          
          <div className="flex-1 w-full md:w-2/3 relative overflow-hidden">
             <div className="absolute left-0 top-0 bottom-0 w-12 z-10 bg-gradient-to-r from-neutral-950 to-transparent pointer-events-none" />
             <div className="absolute right-0 top-0 bottom-0 w-12 z-10 bg-gradient-to-l from-neutral-950 to-transparent pointer-events-none" />
             
             <motion.div 
                className="flex gap-6 w-max"
                animate={{ x: ["0%", "-50%"] }}
                transition={{ 
                  repeat: Infinity, 
                  ease: "linear", 
                  duration: 30 
                }}
             >
                {[...judges, ...judges].map((judge, index) => (
                   <div
                      key={index}
                      className="w-72 bg-neutral-900/50 border border-white/5 rounded-2xl overflow-hidden flex-shrink-0 group hover:border-blue-500/30 transition-colors"
                   >
                      <div className="h-80 overflow-hidden relative">
                        <img 
                          src={judge.image} 
                          alt={judge.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-60" />
                      </div>
                      <div className="p-6 relative -mt-20">
                        <h4 className="text-xl font-bold text-white mb-1">{judge.name}</h4>
                        <p className="text-blue-400 text-sm font-medium mb-3">{judge.role}</p>
                        <p className="text-gray-300 text-sm leading-relaxed line-clamp-3">{judge.description}</p>
                      </div>
                   </div>
                ))}
             </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

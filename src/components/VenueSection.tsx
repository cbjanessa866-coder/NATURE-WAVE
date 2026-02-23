import { motion } from 'motion/react';
import { MapPin, Calendar, Layers, Maximize } from 'lucide-react';

export default function VenueSection() {
  return (
    <section id="venue" className="py-24 bg-neutral-900 text-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500 rounded-full blur-[128px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500 rounded-full blur-[128px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-orange-500 font-medium mb-4 tracking-wide">展览场地</h2>
            <h3 className="text-3xl md:text-5xl font-bold mb-8 leading-tight">
              引庭 | 大连文化创意园区
              <span className="block text-lg md:text-2xl text-gray-500 mt-2 font-normal">The Yard Dalian Cultural Center</span>
            </h3>
            
            <div className="space-y-6 text-gray-300 leading-relaxed text-sm md:text-lg">
              <p>
                如恩设计的“引庭”文化创意园区位于大连市区中心，毗邻多所高校和软件园区。原址由六栋拥有40余年历史的建筑组成，曾为化工研究所的办公楼、仓库及员工宿舍。
              </p>
              <p>
                “引庭”的概念源于场地隐秘而内敛的地理位置和城市肌理。作为适应性改造项目，这里集画廊、生活方式、零售空间、餐饮、影院、剧场以及由旧宿舍楼改建而成的办公空间于一体。
              </p>
              <p>
                原有老建筑群呈现出“U”型布局，如恩通过墙体、屏风和顶篷完成“U”型闭合，将原本孤立的单体建筑有机连接。庭院中心的大型岩石景观成为新旧建筑之间的过渡与联结，让历史与现代在此交融共生。
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6 mt-10">
              <div className="flex items-start gap-3">
                <MapPin className="text-orange-500 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-white">地址</h4>
                  <p className="text-sm text-gray-400">大连市黄浦路201号</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Maximize className="text-orange-500 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-white">面积</h4>
                  <p className="text-sm text-gray-400">4,631 平方米</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Layers className="text-orange-500 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-white">主要材质</h4>
                  <p className="text-sm text-gray-400">耐候钢、红砖、混凝土</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="text-orange-500 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-white">竣工时间</h4>
                  <p className="text-sm text-gray-400">2025年5月</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Image Grid */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-2 gap-4"
          >
            <div className="space-y-4 mt-8">
              <img 
                src="https://picsum.photos/seed/yard1/600/800" 
                alt="The Yard Exterior" 
                className="w-full h-64 object-cover rounded-2xl grayscale hover:grayscale-0 transition-all duration-500"
                referrerPolicy="no-referrer"
              />
              <img 
                src="https://picsum.photos/seed/yard2/600/600" 
                alt="The Yard Interior" 
                className="w-full h-48 object-cover rounded-2xl grayscale hover:grayscale-0 transition-all duration-500"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="space-y-4">
              <img 
                src="https://picsum.photos/seed/yard3/600/600" 
                alt="The Yard Detail" 
                className="w-full h-48 object-cover rounded-2xl grayscale hover:grayscale-0 transition-all duration-500"
                referrerPolicy="no-referrer"
              />
              <img 
                src="https://picsum.photos/seed/yard4/600/800" 
                alt="The Yard Landscape" 
                className="w-full h-64 object-cover rounded-2xl grayscale hover:grayscale-0 transition-all duration-500"
                referrerPolicy="no-referrer"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

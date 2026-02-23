import { motion } from 'motion/react';

const events = [
  { time: "10:00 AM", title: "开幕式 (Opening Ceremony)", location: "主展厅" },
  { time: "11:30 AM", title: "导览: 山谷回响系列", location: "A 区" },
  { time: "02:00 PM", title: "讲座: 胶片摄影的复兴", location: "多功能厅" },
  { time: "04:00 PM", title: "导览: 霓虹潮汐系列", location: "B 区" },
  { time: "07:00 PM", title: "颁奖典礼 (Awards Night)", location: "大宴会厅" },
];

export default function Schedule() {
  return (
    <section id="schedule" className="py-32 bg-neutral-900 text-white">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">活动日程</h2>
          <p className="text-gray-400">2026年10月15日 · 大连引庭艺术园区</p>
        </div>

        <div className="space-y-4">
          {events.map((event, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex flex-col md:flex-row items-center justify-between p-6 md:p-8 bg-black/40 rounded-2xl border border-white/5 hover:bg-white/5 transition-colors"
            >
              <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 text-center md:text-left">
                <span className="text-xl font-mono text-orange-500">{event.time}</span>
                <span className="text-2xl font-semibold">{event.title}</span>
              </div>
              <span className="mt-2 md:mt-0 text-gray-500 text-sm uppercase tracking-wider">{event.location}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

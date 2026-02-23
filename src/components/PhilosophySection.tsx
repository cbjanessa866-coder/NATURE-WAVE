import { motion } from 'motion/react';

export default function PhilosophySection() {
  return (
    <section className="py-32 bg-black flex items-center justify-center overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1 }}
        >
          <h2 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 tracking-tight leading-tight">
            在这里，
            <br className="md:hidden" />
            <span className="text-orange-500">被看见。</span>
          </h2>
          <p className="text-xl md:text-2xl text-gray-400 font-light tracking-widest uppercase mt-8">
            Here, be seen.
          </p>
          <div className="w-px h-24 bg-gradient-to-b from-orange-500 to-transparent mx-auto mt-16 opacity-50" />
        </motion.div>
      </div>
    </section>
  );
}

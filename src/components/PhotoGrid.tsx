import { motion } from 'motion/react';
import { EXHIBITION_PHOTOS } from '../constants';

export default function PhotoGrid() {
  // Duplicate photos to create a seamless loop
  const allPhotos = [...EXHIBITION_PHOTOS, ...EXHIBITION_PHOTOS, ...EXHIBITION_PHOTOS, ...EXHIBITION_PHOTOS];

  return (
    <section id="works" className="py-32 bg-black overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-20 text-center">
          <h2 className="text-3xl md:text-6xl font-bold text-white mb-6 tracking-tight">精选作品</h2>
          <p className="text-base md:text-xl text-gray-400 max-w-2xl mx-auto">
            从全球500多组投稿中精选。这些是定义当代摄影的新视角。
          </p>
        </div>
      </div>

      <div className="w-full">
        <motion.div 
          className="flex gap-8 w-max"
          animate={{ x: "-50%" }}
          transition={{ 
            duration: 60, 
            ease: "linear", 
            repeat: Infinity 
          }}
        >
          {allPhotos.map((photo, index) => (
            <div
              key={`${photo.id}-${index}`}
              className="group relative overflow-hidden rounded-3xl bg-neutral-900 w-[85vw] md:w-[600px] flex-shrink-0"
            >
              <div className="aspect-[4/3] w-full overflow-hidden">
                <img
                  src={photo.image}
                  alt={photo.title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent p-8 flex flex-col justify-end">
                <span className="text-orange-500 text-sm font-medium tracking-wider uppercase mb-2">
                  {photo.category}
                </span>
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">{photo.title}</h3>
                <p className="text-gray-300 mb-4">{photo.photographer}</p>
                <p className="text-gray-400 text-sm line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-4 group-hover:translate-y-0">
                  {photo.description}
                </p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

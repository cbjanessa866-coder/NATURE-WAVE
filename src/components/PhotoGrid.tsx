import { motion } from 'motion/react';

const photos = [
  {
    id: 1,
    title: "山谷回响 (Echoes of the Valley)",
    photographer: "陈莎拉",
    category: "风光摄影",
    image: "https://picsum.photos/seed/valley/800/600",
    description: "捕捉东方被遗忘山谷的静谧光影。"
  },
  {
    id: 2,
    title: "霓虹潮汐 (Neon Tide)",
    photographer: "马库斯·索恩",
    category: "城市建筑",
    image: "https://picsum.photos/seed/neon/800/1000",
    description: "当海洋发光时，城市沉睡。赛博朋克风格的城市夜景。"
  },
  {
    id: 3,
    title: "根 (Roots)",
    photographer: "埃琳娜·罗德里格斯",
    category: "人文纪实",
    image: "https://picsum.photos/seed/roots/800/600",
    description: "古老橡树下，记录家族与土地的深厚羁绊。"
  },
  {
    id: 4,
    title: "最后的故障 (The Last Glitch)",
    photographer: "佐藤健二",
    category: "观念摄影",
    image: "https://picsum.photos/seed/glitch/800/800",
    description: "数字噪点与现实影像的抽象拼贴。"
  }
];

export default function PhotoGrid() {
  // Duplicate photos to create a seamless loop
  const allPhotos = [...photos, ...photos, ...photos, ...photos];

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

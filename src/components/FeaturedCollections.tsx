import React from 'react';
import { ArrowUpRight } from 'lucide-react';

const collections = [
  {
    title: "Cosplay & Collectibles",
    description: "Ultra-detailed masks and miniatures hand-crafted for enthusiasts.",
    image: "/images/products/oni_mask.jpg",
    link: "#",
    tag: "Artisan Cosplay",
    gridClass: "lg:col-span-2"
  },
  {
    title: "Minimalist Decor",
    description: "Elegant vases and planters designed with modern geometry.",
    image: "/images/products/geometric_vase.jpg",
    link: "#",
    tag: "Interior Design",
    gridClass: "lg:col-span-1"
  },
  {
    title: "Desk Enhancements",
    description: "Modular magnetic organizers and structural headphone stands.",
    image: "/images/products/desk_organizer.jpg",
    link: "#",
    tag: "Productivity",
    gridClass: "lg:col-span-1"
  },
  {
    title: "Tabletop Gaming",
    description: "Mechanical dice towers and unique miniature organizers.",
    image: "/images/products/dice_tower.jpg",
    link: "#",
    tag: "Gaming Gear",
    gridClass: "lg:col-span-2"
  }
];

export const FeaturedCollections: React.FC = () => {
  return (
    <section className="py-16 bg-white dark:bg-zinc-950 border-y border-gray-100 dark:border-zinc-900 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-xs font-semibold text-brand-600 dark:text-brand-400 uppercase tracking-widest">Curated Lines</span>
            <h2 className="text-3xl font-display font-black text-gray-900 dark:text-white mt-2">Featured Collections</h2>
          </div>
          <p className="text-sm text-gray-500 dark:text-zinc-400 max-w-md mt-4 md:mt-0">
            Explore our thoughtfully curated collections designed to elevate your desk environment, tabletop gaming sessions, or interior living spaces.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {collections.map((col, idx) => (
            <div 
              key={idx} 
              className={`group relative overflow-hidden rounded-3xl bg-gray-50 dark:bg-zinc-900 aspect-[4/3] sm:aspect-square lg:aspect-[4/3] flex flex-col justify-end p-6 border border-gray-100 dark:border-zinc-800 transition-all duration-500 ${col.gridClass}`}
            >
              {/* Background Image */}
              <div className="absolute inset-0 z-0">
                <img 
                  src={col.image} 
                  alt={col.title}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                {/* Modern Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              </div>

              {/* Text details */}
              <div className="relative z-10 text-white">
                <span className="inline-block px-2.5 py-1 rounded-md bg-white/10 backdrop-blur-sm text-[10px] uppercase font-bold tracking-wider mb-3">
                  {col.tag}
                </span>
                <h3 className="text-xl font-display font-bold">{col.title}</h3>
                <p className="text-xs text-gray-200 mt-1 opacity-0 group-hover:opacity-100 max-h-0 group-hover:max-h-12 overflow-hidden transition-all duration-300">
                  {col.description}
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <a 
                    href={col.link} 
                    className="text-xs font-semibold underline underline-offset-4 decoration-brand-400 group-hover:text-brand-300 transition-colors"
                  >
                    View Collection
                  </a>
                  <div className="w-8 h-8 rounded-full bg-white/10 dark:bg-white/5 backdrop-blur-sm flex items-center justify-center group-hover:bg-brand-600 transition-colors duration-300">
                    <ArrowUpRight size={14} className="text-white" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

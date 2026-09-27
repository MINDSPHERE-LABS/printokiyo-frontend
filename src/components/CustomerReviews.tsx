import React, { useState } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

const reviews = [
  {
    name: "Alex Mercer",
    role: "Software Engineer",
    rating: 5,
    comment: "The Apex Cyberpunk Headphone Stand is an absolute work of art. The print quality is astonishingly smooth. There are literally no messy overhangs. The matte black finish feels so premium and goes perfectly with my workspace layout.",
    product: "Apex Cyberpunk Headphone Stand"
  },
  {
    name: "Sophia Sterling",
    role: "Interior Designer",
    rating: 5,
    comment: "I purchased two Geometric Faceted Vases for my dining table project. They look like sculpted ceramic ware but have a stunning silk shimmer that changes with the light. Complete showstoppers!",
    product: "Geometric Faceted Ceramic Vase"
  },
  {
    name: "Marcus Vance",
    role: "Tabletop RPG Enthusiast",
    rating: 5,
    comment: "This Steampunk Gear Dice Tower is heavily detailed! The antique bronze finish looks weathered and authentic. It rolls dice cleanly and sits on my shelf like a trophy when we aren't playing.",
    product: "Steampunk Gear Dice Tower"
  }
];

export const CustomerReviews: React.FC = () => {
  const [activeIdx, setActiveIdx] = useState(0);

  const prevReview = () => {
    setActiveIdx((prev) => (prev === 0 ? reviews.length - 1 : prev - 1));
  };

  const nextReview = () => {
    setActiveIdx((prev) => (prev === reviews.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="py-16 bg-gray-50/50 dark:bg-zinc-900/30 border-t border-gray-100 dark:border-zinc-900/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-xs font-semibold text-brand-600 dark:text-brand-400 uppercase tracking-widest">Reviews</span>
          <h2 className="text-3xl font-display font-black text-gray-900 dark:text-white mt-2">What Our Collectors Say</h2>
          <p className="text-sm text-gray-500 dark:text-zinc-400 mt-2">
            Read actual verified reviews from creators who upgraded their space.
          </p>
        </div>

        {/* Carousel Content */}
        <div className="relative max-w-3xl mx-auto bg-white dark:bg-zinc-900 rounded-3xl p-8 sm:p-12 border border-gray-100 dark:border-zinc-800 shadow-sm">
          <Quote className="absolute top-6 left-6 text-brand-100 dark:text-zinc-800 w-16 h-16 pointer-events-none -z-0" />
          
          <div className="relative z-10 flex flex-col items-center text-center">
            {/* Stars */}
            <div className="flex items-center gap-1 mb-6 text-yellow-400">
              {Array.from({ length: reviews[activeIdx].rating }).map((_, i) => (
                <Star key={i} size={18} fill="currentColor" />
              ))}
            </div>

            {/* Comment */}
            <p className="text-sm sm:text-base md:text-lg text-gray-700 dark:text-zinc-300 leading-relaxed font-medium italic">
              "{reviews[activeIdx].comment}"
            </p>

            {/* Reviewer Details */}
            <div className="mt-8">
              <span className="block text-sm sm:text-base font-bold text-gray-900 dark:text-white">
                {reviews[activeIdx].name}
              </span>
              <span className="block text-[10px] sm:text-xs text-gray-500 dark:text-zinc-500 uppercase tracking-widest mt-0.5">
                {reviews[activeIdx].role} — Purchaser of {reviews[activeIdx].product}
              </span>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="absolute top-1/2 -translate-y-1/2 left-2 sm:-left-6 right-2 sm:-right-6 flex justify-between pointer-events-none">
            <button 
              onClick={prevReview}
              className="pointer-events-auto p-3 rounded-full bg-white dark:bg-zinc-850 hover:bg-gray-50 dark:hover:bg-zinc-800 text-gray-700 dark:text-zinc-300 shadow-md border border-gray-100 dark:border-zinc-800 transition-all hover:scale-105"
              aria-label="Previous review"
            >
              <ChevronLeft size={16} />
            </button>
            <button 
              onClick={nextReview}
              className="pointer-events-auto p-3 rounded-full bg-white dark:bg-zinc-850 hover:bg-gray-50 dark:hover:bg-zinc-800 text-gray-700 dark:text-zinc-300 shadow-md border border-gray-100 dark:border-zinc-800 transition-all hover:scale-105"
              aria-label="Next review"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};

import React, { useState } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote, ShieldCheck } from 'lucide-react';

const reviews = [
  {
    name: "Rohan Sharma",
    location: "Bengaluru",
    role: "Verified Buyer",
    rating: 5,
    comment: "The print quality on this GTR split poster blew me away. The blacks are super deep and the matte finish has zero reflection from my monitor light bar. Everyone who visits my gaming setup asks where I got it from!",
    product: "Nissan GTR R35 Supercar Split Poster Set",
    badge: "Gaming Setup"
  },
  {
    name: "Ananya Deshmukh",
    location: "Mumbai",
    role: "Verified Buyer",
    rating: 5,
    comment: "Ordered 6 posters using the Buy 2 Get 4 Free offer! They arrived in a rock-solid protective tube in 3 days. The 300 GSM paper feels heavy and premium, not like thin magazine paper. Will definitely order the devotional set next!",
    product: "Solo Leveling & Attack on Titan Anime Posters",
    badge: "Anime Collection"
  },
  {
    name: "Vikramaditya Nair",
    location: "Delhi NCR",
    role: "Verified Buyer",
    rating: 5,
    comment: "The spiritual aura of this Mahadev artwork is unmatched. The colors are extremely vibrant and the detailing on the Trishul and moon is crystal clear. Framed it right above my study desk.",
    product: "Lord Shiva Mahadev Divine Art Print",
    badge: "Devotional Art"
  },
  {
    name: "Kavya Patel",
    location: "Pune",
    role: "Verified Buyer",
    rating: 5,
    comment: "Turned my dull bedroom wall into an aesthetic Pinterest dream! The packaging was so secure that not even a single corner was bent. Super impressed with PrintOkiyo's quality.",
    product: "Curated Room Aesthetic Wall Collage Kit",
    badge: "Room Makeover"
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

  const current = reviews[activeIdx];

  return (
    <section className="py-12 sm:py-16 bg-white text-left select-none border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8 sm:mb-10 pb-4 border-b border-gray-150">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-black tracking-widest uppercase bg-amber-500 text-black shadow-xs mb-1.5">
              <Star size={11} className="fill-black" />
              <span>4.9 / 5.0 RATED BY 2,400+ COLLECTORS</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-black text-gray-950 tracking-tight uppercase">
              Real Walls. Real Reviews.
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 font-medium mt-0.5">
              See what art enthusiasts and room makeover creators across India have to say.
            </p>
          </div>

          {/* Carousel Arrows */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={prevReview}
              className="p-2 rounded-full border border-gray-200 text-gray-700 hover:bg-gray-100 hover:text-black transition-colors cursor-pointer"
              aria-label="Previous review"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={nextReview}
              className="p-2 rounded-full border border-gray-200 text-gray-700 hover:bg-gray-100 hover:text-black transition-colors cursor-pointer"
              aria-label="Next review"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Featured Testimonial Bento Card */}
        <div className="relative rounded-2xl sm:rounded-3xl bg-zinc-950 text-white p-6 sm:p-10 md:p-12 overflow-hidden shadow-xl">
          <Quote className="absolute top-4 right-4 sm:top-6 sm:right-8 text-zinc-800 w-16 h-16 sm:w-24 sm:h-24 pointer-events-none -z-0" />

          <div className="relative z-10 max-w-3xl">
            {/* Stars & Category Tag */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-1 text-amber-400">
                {Array.from({ length: current.rating }).map((_, i) => (
                  <Star key={i} size={16} fill="currentColor" />
                ))}
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider bg-zinc-800 text-amber-300 px-2 py-0.5 rounded-full">
                {current.badge}
              </span>
            </div>

            {/* Review Comment Quote */}
            <p className="text-base sm:text-xl md:text-2xl font-display font-bold leading-relaxed text-zinc-100">
              "{current.comment}"
            </p>

            {/* Reviewer Meta */}
            <div className="mt-6 pt-5 border-t border-zinc-800/80 flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-display font-black text-white text-sm sm:text-base">
                    {current.name}
                  </span>
                  <span className="text-zinc-500 text-xs">• {current.location}</span>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-semibold mt-0.5">
                  <ShieldCheck size={13} />
                  <span>Verified Purchase: {current.product}</span>
                </div>
              </div>

              {/* Slide Counter */}
              <div className="text-xs font-bold text-zinc-500 tracking-widest">
                0{activeIdx + 1} / 0{reviews.length}
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

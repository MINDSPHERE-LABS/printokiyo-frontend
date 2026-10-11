import React, { useState, useMemo } from 'react';
import type { Product } from '../types';
import { ProductCard } from './ProductCard';
import { Footer } from './Footer';
import { 
  ArrowLeft, Layers, Flame, ArrowRight
} from 'lucide-react';

export interface SinglePosterCategoryItem {
  name: string;
  category: string;
  subtitle: string;
  badge: string;
  image: string;
  accentColor: string;
}

export const SINGLE_POSTER_CATEGORIES: SinglePosterCategoryItem[] = [
  {
    name: 'Anime Posters',
    category: 'Anime Single Poster',
    subtitle: 'Dragon Ball, JJK, Solo Leveling & Manga',
    badge: '🔥 TOP SELLER',
    image: '/categories/anime-v2.jpg?v=2',
    accentColor: '#a855f7'
  },
  {
    name: 'Car Posters',
    category: 'Supercar Single Poster',
    subtitle: 'Porsche, GT3, F1 & Exotic Hypercars',
    badge: '🏎️ SPEED',
    image: '/categories/supercars-v2.jpg?v=2',
    accentColor: '#f97316'
  },
  {
    name: 'Cricket Posters',
    category: 'Cricket Single Poster',
    subtitle: 'Virat Kohli, Rohit Sharma & Stadium Icons',
    badge: '🏏 LEGENDS',
    image: '/categories/cricket-v2.jpg?v=2',
    accentColor: '#10b981'
  },
  {
    name: 'Superhero Posters',
    category: 'Superhero Single Poster',
    subtitle: 'Spider-Man, Batman, Iron Man & Avengers',
    badge: '🦸 MARVEL & DC',
    image: '/categories/superhero-avengers-v2.jpg?v=2',
    accentColor: '#ef4444'
  },
  {
    name: 'Superbike Posters',
    category: 'Superbike Single Poster',
    subtitle: 'Kawasaki Ninja H2R, Panigale & Yamaha R1',
    badge: '🏍️ TRACK SPEED',
    image: '/categories/superbike-v2.jpg?v=2',
    accentColor: '#06b6d4'
  },
  {
    name: 'Devotional Posters',
    category: 'Devotional Single Poster',
    subtitle: 'Shri Ram, Mahadev Shiva & Sacred Sanatan',
    badge: '🕉️ SACRED',
    image: '/categories/gods-v2.jpg?v=2',
    accentColor: '#f59e0b'
  },
  {
    name: 'Gym Posters',
    category: 'Gym & Fitness Single Poster',
    subtitle: 'Bodybuilding, Discipline & Stoic Mindset',
    badge: '💪 MOTIVATION',
    image: '/categories/motivational-v2.jpg?v=2',
    accentColor: '#3b82f6'
  },
  {
    name: 'Music Posters',
    category: 'Music Single Poster',
    subtitle: 'Karan Aujla, Sidhu Moosewala & Pop Legends',
    badge: '🎵 VIBES',
    image: '/categories/movie-v2.jpg?v=2',
    accentColor: '#ec4899'
  }
];

interface SinglePostersPageProps {
  products: Product[];
  wishlist: Product[];
  onNavigateHome: () => void;
  onCategorySelect: (categoryKey: string) => void;
  onAddToCart?: (product: Product, quantity?: number) => void;
  onBuyNow?: (product: Product, quantity?: number) => void;
  onAddToWishlist: (product: Product) => void;
  onViewDetails: (product: Product) => void;
  onQuickAdd: (product: Product) => void;
  // Footer callbacks
  onAboutClick?: () => void;
  onTermsClick?: () => void;
  onShippingClick?: () => void;
  onRefundClick?: () => void;
  onCancelOrderClick?: () => void;
  onPrivacyClick?: () => void;
  onOpenSplitNewArrivals?: () => void;
  onOpenSinglePosters?: () => void;
}

export const SinglePostersPage: React.FC<SinglePostersPageProps> = ({
  products,
  wishlist,
  onNavigateHome,
  onCategorySelect,
  onAddToCart,
  onBuyNow,
  onAddToWishlist,
  onViewDetails,
  onQuickAdd,
  onAboutClick,
  onTermsClick,
  onShippingClick,
  onRefundClick,
  onCancelOrderClick,
  onPrivacyClick,
  onOpenSplitNewArrivals,
  onOpenSinglePosters
}) => {
  const [selectedSubTab, setSelectedSubTab] = useState<string>('all');

  // Match test for single poster category
  const isMatch = (p: Product, targetKey: string): boolean => {
    if (!p || !p.category) return false;
    const pCat = p.category.toLowerCase().trim();
    const pTitle = (p.title || '').toLowerCase().trim();
    const lowerKey = targetKey.toLowerCase().trim();

    // Never show Wall Sets, Collage kits, Polaroids, or Split Posters
    if (pCat.includes('wall') || pCat.includes('collage') || pCat.includes('polaroid') || pCat.includes('poloride')) {
      return false;
    }
    if (pCat.includes('split') || pTitle.includes('split')) {
      return false;
    }

    const normPCat = pCat.replace(/s\b/g, '');
    const normTarget = lowerKey.replace(/s\b/g, '');
    if (normPCat === normTarget || pCat === lowerKey) return true;

    if (lowerKey.includes('anime')) {
      return (pCat.includes('anime') || pTitle.includes('anime')) && !pCat.includes('split');
    }
    if (lowerKey.includes('car') || lowerKey.includes('supercar')) {
      return (pCat.includes('car') || pCat.includes('supercar') || pCat.includes('f1')) && !pCat.includes('split');
    }
    if (lowerKey.includes('superbike') || lowerKey.includes('bike')) {
      return (pCat.includes('bike') || pCat.includes('motorcycle')) && !pCat.includes('split');
    }
    if (lowerKey.includes('cricket')) {
      return pCat.includes('cricket') && !pCat.includes('split');
    }
    if (lowerKey.includes('superhero')) {
      return (pCat.includes('superhero') || pCat.includes('marvel') || pCat.includes('dc')) && !pCat.includes('split');
    }
    if (lowerKey.includes('devotional')) {
      return (pCat.includes('devotional') || pCat.includes('spiritual')) && !pCat.includes('split');
    }
    if (lowerKey.includes('gym')) {
      return (pCat.includes('gym') || pCat.includes('fitness')) && !pCat.includes('split');
    }
    if (lowerKey.includes('music')) {
      return (pCat.includes('music') || pCat.includes('band')) && !pCat.includes('split');
    }

    return false;
  };

  // Filter single poster products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (!p || !p.category) return false;
      const pCat = p.category.toLowerCase().trim();
      const pTitle = (p.title || '').toLowerCase().trim();
      if (pCat.includes('wall') || pCat.includes('collage') || pCat.includes('polaroid') || pCat.includes('poloride') || pCat.includes('split') || pTitle.includes('split')) {
        return false;
      }

      if (selectedSubTab === 'all') {
        return SINGLE_POSTER_CATEGORIES.some(cat => isMatch(p, cat.category)) || pCat.includes('single');
      }

      return isMatch(p, selectedSubTab);
    });
  }, [products, selectedSubTab]);

  return (
    <div className="animate-in fade-in duration-300 text-left select-none pb-12">
      {/* 1. Only Clean Back to Home Navigation Button */}
      <div className="mb-4 sm:mb-6">
        <button
          onClick={onNavigateHome}
          className="inline-flex items-center gap-2 text-xs font-bold text-gray-700 hover:text-black bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-full transition-all cursor-pointer shadow-xs active:scale-95"
        >
          <ArrowLeft size={14} className="stroke-[2.5]" />
          <span>Back to Home</span>
        </button>
      </div>

      {/* 2. Creative Minimalist Header (No Border Boxes, Pure Typography) */}
      <div className="mb-8 sm:mb-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-gray-150 pb-4">
          <div>
            <span className="text-[11px] sm:text-xs font-extrabold uppercase tracking-widest text-red-600">
              Curated Single Posters
            </span>
            <h1 className="text-2xl sm:text-4xl font-display font-black uppercase text-[#0e0d0d] tracking-tight mt-0.5">
              Explore by Category
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 font-medium mt-1 max-w-xl">
              High-definition single posters printed on heavy 300+ GSM art cardstock with premium anti-glare matte lamination.
            </p>
          </div>

          {/* Automatic Offer Pill */}
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-red-50 border border-red-200 text-red-700 text-[11px] font-bold w-fit shrink-0">
            <Flame size={14} className="text-red-500 shrink-0" />
            <span>Buy 3 Get 1 FREE Applied Automatically</span>
          </div>
        </div>
      </div>

      {/* 3. Aesthetic Portrait Category Cards (Zero Heavy Borders, Real Poster Proportions) */}
      <div className="mb-14">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
          {SINGLE_POSTER_CATEGORIES.map((cat) => (
            <div
              key={cat.category}
              onClick={() => onCategorySelect(cat.category)}
              className="group relative rounded-2xl overflow-hidden cursor-pointer aspect-[3/4] sm:aspect-[4/5] shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col justify-end p-3.5 sm:p-5"
              role="button"
              tabIndex={0}
              aria-label={`Explore ${cat.name}`}
            >
              {/* High-Resolution Artwork */}
              <img
                src={cat.image}
                alt={cat.name}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out"
              />

              {/* Cinematic Vignette Gradient Scrim (No harsh box borders) */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-transparent group-hover:via-black/55 transition-colors" />

              {/* Floating Accent Tag */}
              <div className="relative z-10 mb-auto">
                <span
                  className="inline-block text-[9px] sm:text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full text-white backdrop-blur-md shadow-xs"
                  style={{ backgroundColor: `${cat.accentColor}cc` }}
                >
                  {cat.badge}
                </span>
              </div>

              {/* Bottom Typography & Animated Action */}
              <div className="relative z-10 text-left">
                <h3 className="font-display font-black text-white text-sm sm:text-base md:text-lg uppercase tracking-tight leading-tight group-hover:text-amber-400 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-[10px] sm:text-xs text-gray-200 line-clamp-1 mt-0.5 font-medium opacity-90">
                  {cat.subtitle}
                </p>

                <div className="mt-2.5 flex items-center gap-1.5 text-[10px] sm:text-xs font-bold text-amber-300 group-hover:translate-x-1 transition-transform">
                  <span>Explore Category</span>
                  <ArrowRight size={12} className="stroke-[2.5]" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Live Posters Catalog Explorer with Category Pills */}
      <div id="catalog-explorer" className="mb-14 scroll-mt-24">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 border-b border-gray-150 pb-3">
          <div>
            <h2 className="text-lg sm:text-xl font-display font-black uppercase text-[#0e0d0d] tracking-tight">
              All Single Posters
            </h2>
            <p className="text-xs text-gray-500 font-medium">
              Browse individual posters or filter by category directly
            </p>
          </div>
          <span className="text-xs font-bold text-gray-600 bg-gray-100 px-3 py-1 rounded-full w-fit">
            {filteredProducts.length} Posters
          </span>
        </div>

        {/* Clean Pill Sub-Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 no-scrollbar text-xs whitespace-nowrap">
          <button
            onClick={() => setSelectedSubTab('all')}
            className={`px-4 py-2 rounded-full font-bold transition-all cursor-pointer ${
              selectedSubTab === 'all'
                ? 'bg-black text-white shadow-sm'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Single Posters
          </button>

          {SINGLE_POSTER_CATEGORIES.map((cat) => {
            const isActive = selectedSubTab === cat.category;
            return (
              <button
                key={cat.category}
                onClick={() => setSelectedSubTab(cat.category)}
                className={`px-4 py-2 rounded-full font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-black text-white shadow-sm'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>

        {/* Live Product Cards Grid */}
        {filteredProducts.length === 0 ? (
          <div className="w-full py-14 px-4 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200 flex flex-col items-center justify-center gap-2">
            <Layers className="w-9 h-9 text-gray-400" strokeWidth={1.5} />
            <p className="text-sm font-bold text-gray-800">
              No posters found in this category yet
            </p>
            <p className="text-xs text-gray-500 max-w-sm">
              New poster designs are added frequently! Select another category or browse all single posters above.
            </p>
            <button
              onClick={() => setSelectedSubTab('all')}
              className="mt-2 text-xs font-bold text-red-600 hover:underline cursor-pointer"
            >
              View All Single Posters →
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5 md:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id || product._id || product.slug}
                product={product}
                onAddToCart={onAddToCart}
                onBuyNow={onBuyNow}
                onAddToWishlist={onAddToWishlist}
                onViewDetails={onViewDetails}
                onQuickAdd={onQuickAdd}
                isWishlisted={wishlist.some(
                  (p) => (p.id || p._id) === (product.id || product._id)
                )}
                showQuickAdd={true}
              />
            ))}
          </div>
        )}
      </div>

      {/* 5. Brand Footer */}
      <div className="-mx-4 sm:-mx-6 lg:-mx-8 mt-12 border-t border-gray-150">
        <Footer
          onAboutClick={onAboutClick}
          onTermsClick={onTermsClick}
          onShippingClick={onShippingClick}
          onRefundClick={onRefundClick}
          onCancelOrderClick={onCancelOrderClick}
          onPrivacyClick={onPrivacyClick}
          onOpenSplitNewArrivals={onOpenSplitNewArrivals}
          onOpenSinglePosters={onOpenSinglePosters}
          onCategoryClick={onCategorySelect}
        />
      </div>
    </div>
  );
};

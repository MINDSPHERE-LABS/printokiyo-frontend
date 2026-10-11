import React, { useState, useMemo } from 'react';
import type { Product } from '../types';
import { ProductCard } from './ProductCard';
import { Footer } from './Footer';
import { 
  ChevronRight, Layers, Sparkles, ShieldCheck, 
  Truck, Flame
} from 'lucide-react';

export interface SinglePosterCategoryItem {
  name: string;
  category: string;
  subtitle: string;
  badge: string;
  image: string;
  glowColor: string;
}

export const SINGLE_POSTER_CATEGORIES: SinglePosterCategoryItem[] = [
  {
    name: 'Car Posters',
    category: 'Supercar Single Poster',
    subtitle: 'Porsche GT3, Supercars, F1 & Racing Exotics',
    badge: '🏎️ EXOTICS',
    image: '/categories/supercars-v2.jpg?v=2',
    glowColor: '#f97316'
  },
  {
    name: 'Anime Posters',
    category: 'Anime Single Poster',
    subtitle: 'Dragon Ball, JJK, Demon Slayer & Otaku Legends',
    badge: '🔥 TOP SELLER',
    image: '/categories/anime-v2.jpg?v=2',
    glowColor: '#a855f7'
  },
  {
    name: 'Cricket Posters',
    category: 'Cricket Single Poster',
    subtitle: 'Virat Kohli, Rohit Sharma & Stadium Icons',
    badge: '🏆 CHAMPIONS',
    image: '/categories/cricket-v2.jpg?v=2',
    glowColor: '#10b981'
  },
  {
    name: 'Superhero Posters',
    category: 'Superhero Single Poster',
    subtitle: 'Spider-Man, Batman, Iron Man & Avengers',
    badge: '💥 MARVEL & DC',
    image: '/categories/superhero-avengers-v2.jpg?v=2',
    glowColor: '#ef4444'
  },
  {
    name: 'Superbike Posters',
    category: 'Superbike Single Poster',
    subtitle: 'Kawasaki Ninja H2R, Panigale & Yamaha R1',
    badge: '🏍️ TRACK SPEED',
    image: '/categories/superbike-v2.jpg?v=2',
    glowColor: '#06b6d4'
  },
  {
    name: 'Devotional Posters',
    category: 'Devotional Single Poster',
    subtitle: 'Shri Ram, Mahadev Shiva & Sacred Sanatan Art',
    badge: '🕉️ SACRED',
    image: '/categories/gods-v2.jpg?v=2',
    glowColor: '#f59e0b'
  },
  {
    name: 'Gym & Fitness Posters',
    category: 'Gym & Fitness Single Poster',
    subtitle: 'Bodybuilding, Hustle, Discipline & Stoic Mindset',
    badge: '💪 MOTIVATION',
    image: '/categories/motivational-v2.jpg?v=2',
    glowColor: '#3b82f6'
  },
  {
    name: 'Music Posters',
    category: 'Music Single Poster',
    subtitle: 'Karan Aujla, Sidhu Moosewala & Pop Legends',
    badge: '🎵 VIBES',
    image: '/categories/movie-v2.jpg?v=2',
    glowColor: '#ec4899'
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

  // Helper to test if a product matches a specific category or is single poster
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
        // Matches any single poster category or has 'single' in category name
        return SINGLE_POSTER_CATEGORIES.some(cat => isMatch(p, cat.category)) || pCat.includes('single');
      }

      return isMatch(p, selectedSubTab);
    });
  }, [products, selectedSubTab]);

  return (
    <div className="animate-in fade-in duration-300 text-left select-none pb-12">
      {/* 1. Top Navigation & Breadcrumbs */}
      <div className="flex items-center justify-between gap-3 mb-4 sm:mb-6">
        <button
          onClick={onNavigateHome}
          className="inline-flex items-center gap-2 text-xs font-bold text-gray-700 hover:text-gray-950 bg-gray-100 hover:bg-gray-200 px-3.5 py-1.5 rounded-full transition-all cursor-pointer shadow-xs"
        >
          <span>←</span>
          <span>Back to Home</span>
        </button>

        <nav className="flex items-center gap-1.5 text-[11px] sm:text-xs font-medium text-gray-500">
          <button 
            onClick={onNavigateHome}
            className="hover:text-gray-900 transition-colors cursor-pointer"
          >
            Home
          </button>
          <ChevronRight size={12} className="text-gray-400" />
          <span className="text-gray-900 font-bold">Single Posters</span>
          <ChevronRight size={12} className="text-gray-400" />
          <span className="text-red-600 font-extrabold uppercase">All Categories</span>
        </nav>
      </div>

      {/* 2. Page Hero Header */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-zinc-950 via-zinc-900 to-black p-5 sm:p-8 md:p-10 mb-8 border border-zinc-800 text-white shadow-xl">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/20 border border-red-500/30 text-red-400 text-[10px] sm:text-xs font-black uppercase tracking-wider mb-3">
            <Sparkles size={13} className="text-red-400" />
            <span>High-Definition Aesthetic Collection</span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-display font-black uppercase tracking-tight text-white mb-2 sm:mb-3">
            ALL SINGLE POSTER CATEGORIES
          </h1>

          <p className="text-xs sm:text-sm text-gray-300 font-normal leading-relaxed max-w-2xl mb-5">
            Discover our complete lineup of museum-grade single posters. Printed on thick 300+ GSM art cardstock with premium anti-glare matte lamination. Tap any category card below to browse curated posters or explore the full catalog.
          </p>

          {/* Quick Value Props Chips */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[10px] sm:text-xs font-bold text-gray-200">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/10 backdrop-blur-xs border border-white/10">
              <Flame size={13} className="text-amber-400" />
              <span>Buy 3 Get 1 FREE Automatically</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/10 backdrop-blur-xs border border-white/10">
              <Layers size={13} className="text-blue-400" />
              <span>300+ GSM Thick Cardstock</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/10 backdrop-blur-xs border border-white/10">
              <ShieldCheck size={13} className="text-green-400" />
              <span>Anti-Glare Matte Finish</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/10 backdrop-blur-xs border border-white/10">
              <Truck size={13} className="text-purple-400" />
              <span>Fast Express COD Delivery</span>
            </span>
          </div>
        </div>

        {/* Decorative Ambient Background Elements */}
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* 3. The 8 Single Poster Category Showcase Cards (2-Col Mobile / 4-Col Desktop Grid) */}
      <div className="mb-14">
        <div className="flex items-center justify-between mb-4 border-b border-gray-200 pb-2">
          <h2 className="text-lg sm:text-xl font-display font-black uppercase text-[#0e0d0d] tracking-tight">
            SELECT A SINGLE POSTER CATEGORY
          </h2>
          <span className="text-[11px] sm:text-xs font-bold text-gray-500">
            8 Distinct Categories
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
          {SINGLE_POSTER_CATEGORIES.map((cat) => (
            <div
              key={cat.category}
              onClick={() => onCategorySelect(cat.category)}
              className="collage-bento-card group relative flex flex-col justify-end p-3 sm:p-4 md:p-5 rounded-2xl overflow-hidden border border-gray-800/80 hover:border-white/40 cursor-pointer aspect-[4/3] sm:aspect-[16/11] md:aspect-[16/11] shadow-md transition-all duration-300"
              style={{ '--card-glow': cat.glowColor } as React.CSSProperties}
              role="button"
              tabIndex={0}
              aria-label={`Explore ${cat.name}`}
            >
              {/* Background Artwork */}
              <img
                src={cat.image}
                alt={cat.name}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out"
              />

              {/* Multi-tier Gradient for Crisp Text Legibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/15 group-hover:via-black/70 transition-colors" />

              {/* Category Badge */}
              <div className="relative z-10 mb-auto">
                <span
                  className="inline-block text-[9px] sm:text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full text-white backdrop-blur-md shadow-xs border border-white/10"
                  style={{ backgroundColor: `${cat.glowColor}d9` }}
                >
                  {cat.badge}
                </span>
              </div>

              {/* Title & Subtitle */}
              <div className="relative z-10 pt-1 sm:pt-2">
                <h3 className="font-display font-black text-white text-xs sm:text-sm md:text-base leading-tight drop-shadow-sm group-hover:text-amber-400 transition-colors uppercase">
                  {cat.name}
                </h3>
                <p className="text-[9px] sm:text-xs text-gray-300 font-medium line-clamp-1 mt-0.5 opacity-90">
                  {cat.subtitle}
                </p>

                {/* Animated Bottom Interactive Bar */}
                <div className="mt-2 pt-1.5 border-t border-white/15 flex items-center justify-between text-white/90">
                  <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-wider text-gray-300 group-hover:text-amber-300 transition-colors">
                    EXPLORE CATEGORY
                  </span>
                  <div className="cta-anim-arrow flex items-center">
                    <svg
                      width="20px"
                      height="10px"
                      viewBox="0 0 66 43"
                      version="1.1"
                      xmlns="http://www.w3.org/2000/svg"
                      className="transition-transform group-hover:translate-x-1 duration-300 fill-current text-white group-hover:text-amber-300"
                    >
                      <g stroke="none" strokeWidth="1" fillRule="evenodd">
                        <path d="M40.7,0.7 C41.6,-0.2 43.1,-0.2 44,0.7 L64.3,21 L44,41.3 C43.1,42.2 41.6,42.2 40.7,41.3 C39.8,40.4 39.8,38.9 40.7,38 L57,21.7 L2,21.7 C0.9,21.7 0,20.8 0,19.7 C0,18.6 0.9,17.7 2,17.7 L57,17.7 L40.7,1.4 C39.8,0.5 39.8,-0.2 40.7,0.7 Z" />
                      </g>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. In-Page Live Posters Catalog Browser with Category Tabs */}
      <div id="catalog-explorer" className="mb-14 scroll-mt-24">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 border-b border-gray-200 pb-2">
          <div>
            <h2 className="text-lg sm:text-xl font-display font-black uppercase text-[#0e0d0d] tracking-tight">
              BROWSE SINGLE POSTERS CATALOG
            </h2>
            <p className="text-[11px] sm:text-xs text-gray-500 font-medium">
              Filter by category or explore all single posters in one place
            </p>
          </div>
          <span className="text-[11px] sm:text-xs font-bold text-gray-600 bg-gray-100 px-2.5 py-1 rounded-full w-fit">
            {filteredProducts.length} Posters Found
          </span>
        </div>

        {/* Category Sub-Tabs in Red Pill Format */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-6 no-scrollbar text-xs whitespace-nowrap">
          <button
            onClick={() => setSelectedSubTab('all')}
            className={`px-3.5 py-1.5 rounded-full font-bold transition-all cursor-pointer ${
              selectedSubTab === 'all'
                ? 'bg-red-600 text-white shadow-xs'
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
                className={`px-3.5 py-1.5 rounded-full font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-red-600 text-white shadow-xs'
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
      <div className="-mx-4 sm:-mx-6 lg:-mx-8 mt-12 border-t border-gray-100">
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

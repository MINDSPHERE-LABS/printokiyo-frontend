import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Search, X, TrendingUp, Sparkles } from 'lucide-react';
import type { Product } from '../types';
import { getImageUrl } from '../utils/image';
import { getEffectivePrice } from '../utils/price';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onSelectProduct: (product: Product) => void;
}

const TRENDING_KEYWORDS = [
  "Supercars", "Anime GTR", "Solo Leveling", "Mahadev", 
  "Iron Man", "Gym Motivation", "Virat Kohli", "Porsche"
];

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  products,
  onSelectProduct
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus input on open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    } else {
      document.body.style.overflow = '';
      setQuery('');
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Filter products matching query
  const searchResults = useMemo(() => {
    const cleanQuery = query.trim().toLowerCase();
    if (!cleanQuery) return [];

    return products.filter((p) => {
      const titleMatch = p.title?.toLowerCase().includes(cleanQuery);
      const descMatch = p.description?.toLowerCase().includes(cleanQuery);
      const catMatch = p.category?.toLowerCase().includes(cleanQuery);
      const tagsMatch = Array.isArray(p.tags) && p.tags.some(t => t.toLowerCase().includes(cleanQuery));
      return titleMatch || descMatch || catMatch || tagsMatch;
    }).slice(0, 12);
  }, [query, products]);

  // Top recommendations when query is empty
  const recommendedPosters = useMemo(() => {
    return products.filter(p => p.featured || p.new_arrival).slice(0, 4);
  }, [products]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto select-none animate-in fade-in duration-200">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity" 
      />

      {/* Modal Dialog */}
      <div className="relative min-h-screen sm:min-h-0 sm:max-w-3xl sm:mx-auto sm:my-10 p-4 sm:p-0 z-10 flex flex-col justify-start">
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden border border-gray-150 flex flex-col max-h-[85vh]">
          
          {/* 1. Search Header Bar */}
          <div className="p-4 sm:p-5 border-b border-gray-150 flex items-center gap-3 bg-white">
            <Search size={22} className="text-gray-400 shrink-0" />
            
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search anime, supercars, devotionals, collage sets..."
              className="flex-1 bg-transparent text-sm sm:text-base font-semibold text-gray-900 placeholder:text-gray-400 focus:outline-none"
            />

            {query ? (
              <button
                onClick={() => setQuery('')}
                className="p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                title="Clear query"
              >
                <X size={16} />
              </button>
            ) : null}

            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 text-xs font-bold transition-colors cursor-pointer"
            >
              ESC
            </button>
          </div>

          {/* 2. Trending Search Chips */}
          <div className="px-4 sm:px-5 py-3 bg-zinc-50/80 border-b border-gray-100 flex items-center gap-2 overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-1 text-[11px] font-black uppercase text-gray-400 shrink-0 tracking-wider">
              <TrendingUp size={12} />
              <span>Trending:</span>
            </div>
            {TRENDING_KEYWORDS.map((kw) => (
              <button
                key={kw}
                onClick={() => setQuery(kw)}
                className="px-2.5 py-1 rounded-full bg-white border border-gray-200 text-[11px] font-bold text-gray-700 hover:border-black hover:text-black transition-all whitespace-nowrap cursor-pointer shadow-2xs"
              >
                {kw}
              </button>
            ))}
          </div>

          {/* 3. Search Results Body */}
          <div className="p-4 sm:p-6 overflow-y-auto flex-1">
            {query.trim().length > 0 ? (
              searchResults.length === 0 ? (
                /* No Results State */
                <div className="py-12 text-center flex flex-col items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mb-3">
                    <Search size={22} />
                  </div>
                  <h4 className="text-sm font-bold text-gray-900 uppercase tracking-tight">
                    No posters found for "{query}"
                  </h4>
                  <p className="text-xs text-gray-500 mt-1 max-w-xs">
                    Try checking your spelling or browse our popular categories like Anime or Supercars.
                  </p>
                </div>
              ) : (
                /* Results Grid */
                <div>
                  <div className="flex items-center justify-between mb-3 text-xs font-black uppercase text-gray-400 tracking-wider">
                    <span>Matching Posters ({searchResults.length})</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
                    {searchResults.map((product) => {
                      const price = getEffectivePrice(product);
                      return (
                        <div
                          key={product.id || product._id || product.slug}
                          onClick={() => {
                            onSelectProduct(product);
                            onClose();
                          }}
                          className="group rounded-xl border border-gray-150 p-2 hover:border-black hover:shadow-md transition-all cursor-pointer bg-white flex flex-col justify-between"
                        >
                          <div className="aspect-[3/4] bg-gray-50 rounded-lg overflow-hidden mb-2 relative">
                            <img
                              src={getImageUrl(product.thumbnail)}
                              alt={product.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            {product.new_arrival && (
                              <span className="absolute top-1 left-1 bg-emerald-600 text-white text-[8px] font-black uppercase px-1.5 py-0.2 rounded">
                                New
                              </span>
                            )}
                          </div>

                          <div>
                            <h5 className="text-xs font-bold text-gray-900 line-clamp-1 group-hover:text-black">
                              {product.title}
                            </h5>
                            <span className="text-xs font-black text-gray-950 mt-0.5 block">
                              ₹{price.toFixed(0)}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )
            ) : (
              /* Empty Query State — Show Featured Recommendations */
              <div>
                <div className="flex items-center gap-1.5 text-xs font-black uppercase text-gray-400 tracking-wider mb-3">
                  <Sparkles size={13} className="text-amber-500" />
                  <span>Popular Right Now</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                  {recommendedPosters.map((product) => {
                    const price = getEffectivePrice(product);
                    return (
                      <div
                        key={product.id || product._id || product.slug}
                        onClick={() => {
                          onSelectProduct(product);
                          onClose();
                        }}
                        className="group rounded-xl border border-gray-150 p-2 hover:border-black hover:shadow-md transition-all cursor-pointer bg-white"
                      >
                        <div className="aspect-[3/4] bg-gray-50 rounded-lg overflow-hidden mb-2">
                          <img
                            src={getImageUrl(product.thumbnail)}
                            alt={product.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <h5 className="text-xs font-bold text-gray-900 line-clamp-1">
                          {product.title}
                        </h5>
                        <span className="text-xs font-black text-gray-950 mt-0.5 block">
                          ₹{price.toFixed(0)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

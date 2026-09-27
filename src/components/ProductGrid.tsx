import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProductCard } from './ProductCard';
import type { Product } from '../types';

interface ProductGridProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  onBuyNow: (product: Product) => void;
  onAddToWishlist: (product: Product) => void;
  onViewDetails?: (product: Product) => void;
  wishlistIds: string[];
}

type TabType = 'all' | 'featured' | 'best_seller' | 'new_arrival';

export const ProductGrid: React.FC<ProductGridProps> = ({ 
  products, 
  onAddToCart, 
  onBuyNow,
  onAddToWishlist,
  onViewDetails,
  wishlistIds
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('all');

  const tabs: { key: TabType; label: string }[] = [
    { key: 'all', label: 'All Creations' },
    { key: 'featured', label: 'Curated Picks' },
    { key: 'best_seller', label: 'Best Sellers' },
    { key: 'new_arrival', label: 'New Arrivals' }
  ];

  // Filtering products locally for fast client responsiveness
  const filteredProducts = products.filter(p => {
    if (activeTab === 'all') return true;
    if (activeTab === 'featured') return p.featured;
    if (activeTab === 'best_seller') return p.best_seller;
    if (activeTab === 'new_arrival') return p.new_arrival;
    return true;
  });

  return (
    <section id="shop" className="py-16 bg-[#faf9f6] dark:bg-[#0b0c10] transition-colors scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Tab Controls */}
        <div className="flex flex-col items-center justify-between gap-6 mb-12">
          <div className="flex bg-gray-100 dark:bg-zinc-900 p-1.5 rounded-2xl border border-gray-200/50 dark:border-zinc-800">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`relative px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 ${
                  activeTab === tab.key
                    ? 'bg-white dark:bg-zinc-800 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-500 hover:text-gray-900 dark:text-zinc-400 dark:hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-zinc-900 rounded-3xl border border-gray-100 dark:border-zinc-800">
            <p className="text-gray-500 dark:text-zinc-400 font-medium">No products found matching this filter.</p>
          </div>
        ) : (
          <motion.div 
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8"
          >
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  key={product.id || product.slug}
                  className="h-full"
                >
                  <ProductCard
                    product={product}
                    onAddToCart={onAddToCart}
                    onBuyNow={onBuyNow}
                    onAddToWishlist={onAddToWishlist}
                    onViewDetails={onViewDetails}
                    isWishlisted={wishlistIds.includes(product.id)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

      </div>
    </section>
  );
};

import React from 'react';
import type { Product } from '../types';
import { Heart } from 'lucide-react';
import { getImageUrl } from '../utils/image';
import { getEffectivePrice } from '../utils/price';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onBuyNow?: (product: Product) => void;
  onAddToWishlist: (product: Product) => void;
  onViewDetails?: (product: Product) => void;
  isWishlisted: boolean;
  showQuickAdd?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  onAddToCart,
  onAddToWishlist,
  onViewDetails,
  isWishlisted,
  showQuickAdd = true
}) => {
  const effectivePrice = getEffectivePrice(product);

  return (
    <div 
      onClick={() => onViewDetails?.(product)}
      className="group bg-white cursor-pointer flex flex-col h-full select-none text-left"
    >
      {/* Product Image Container - 3:4 Aspect Ratio (+30% taller height) */}
      <div className="relative aspect-[3/4] overflow-hidden bg-[#f8f9fa] border border-gray-100 p-1.5 w-full flex items-center justify-center">
        {/* Subtle "New" Badge on Top-Left */}
        {product.new_arrival && (
          <span className="absolute top-2.5 left-2.5 z-10 bg-[#5c8b7c] text-white text-[8px] sm:text-[9px] font-semibold px-2 py-0.5 tracking-wider select-none uppercase">
            New
          </span>
        )}

        {/* Float Wishlist Heart Button on Top-Right */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAddToWishlist(product);
          }}
          className="absolute top-2.5 right-2.5 z-10 p-1.5 rounded-full bg-white/90 text-gray-500 hover:text-red-500 hover:bg-white transition-all shadow-xs"
        >
          <Heart 
            size={14} 
            fill={isWishlisted ? "currentColor" : "none"} 
            className={isWishlisted ? "text-red-500" : "text-gray-400"} 
          />
        </button>

        {/* Poster Image */}
        <img 
          src={getImageUrl(product.thumbnail)} 
          alt={product.title} 
          loading="lazy"
          decoding="async"
          onError={(e) => {
            const target = e.currentTarget;
            target.onerror = null;
            target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300"><rect width="300" height="300" fill="%23f8fafc"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="14" fill="%2364748b">Poster Image</text></svg>';
          }}
          className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-103"
        />
      </div>

      {/* QUICK ADD Black Button matching reference image media_1790514554594.png */}
      {showQuickAdd && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            if (onAddToCart) {
              onAddToCart(product);
            } else if (onViewDetails) {
              onViewDetails(product);
            }
          }}
          className="w-full py-2 bg-black text-white text-[10px] sm:text-xs font-black uppercase tracking-wider hover:bg-gray-800 transition-colors my-1.5 cursor-pointer rounded-none"
        >
          QUICK ADD
        </button>
      )}

      {/* Info Details Section matching reference screenshot */}
      <div className="flex flex-col gap-0.5 px-0.5 mt-1">
        {/* MORE SIZES AVAILABLE */}
        <span className="text-[9px] sm:text-[10px] uppercase tracking-wider text-gray-400 font-medium">
          MORE SIZES AVAILABLE
        </span>

        {/* Product Title */}
        <h3 className="text-xs sm:text-sm font-normal text-gray-800 line-clamp-1 group-hover:text-black transition-colors">
          {product.title}
        </h3>

        {/* Price Line: "Rs. 89.00" */}
        <div className="text-xs sm:text-sm font-bold text-gray-900 mt-0.5">
          <span>Rs. {effectivePrice.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

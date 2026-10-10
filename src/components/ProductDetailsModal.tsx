import React, { useState, useEffect } from 'react';
import type { Product } from '../types';
import { X, ShoppingBag, Heart, Star, ChevronLeft, ChevronRight, CreditCard, Flame } from 'lucide-react';
import { getImageUrl } from '../utils/image';

interface ProductDetailsModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
  onAddToWishlist: (product: Product) => void;
  onBuyNow: (product: Product) => void;
  isWishlisted: boolean;
}

export const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({
  product,
  isOpen,
  onClose,
  onAddToCart,
  onAddToWishlist,
  onBuyNow,
  isWishlisted
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const basePrice = product.price_a5 ?? (product.discount_price ?? product.price ?? 89);

  const availableSizes: { name: string; price: number }[] = React.useMemo(() => {
    const list: { name: string; price: number }[] = [];

    // 1. Custom Sizes (Gated by product.allow_size_variants)
    const isCustomSizeEnabled = product.allow_size_variants !== false;
    if (isCustomSizeEnabled) {
      if (product.custom_size_1 && typeof product.custom_size_1 === 'string' && product.custom_size_1.trim()) {
        const p = product.custom_price_1 ?? (product.price_a5 ?? basePrice);
        list.push({ name: product.custom_size_1.trim(), price: p });
      }
      if (product.custom_size_2 && typeof product.custom_size_2 === 'string' && product.custom_size_2.trim()) {
        const p = product.custom_price_2 ?? (product.price_a4 ?? Math.round(basePrice * 1.6));
        list.push({ name: product.custom_size_2.trim(), price: p });
      }
      if (product.custom_size_3 && typeof product.custom_size_3 === 'string' && product.custom_size_3.trim()) {
        const p = product.custom_price_3 ?? (product.price_a3 ?? Math.round(basePrice * 2.8));
        list.push({ name: product.custom_size_3.trim(), price: p });
      }

      if (list.length === 0 && product.size_variants && Array.isArray(product.size_variants) && product.size_variants.length > 0) {
        list.push(...product.size_variants);
      }
    }

    // 2. Standard Sizes (A5, A4, A3 - Independent of allow_size_variants)
    const isA5Enabled = product.enable_a5 === true || (product.enable_a5 !== false && product.enable_a5 != null && (product as any).enable_a5 !== 'false');
    const isA4Enabled = product.enable_a4 === true || (product.enable_a4 !== false && product.enable_a4 != null && (product as any).enable_a4 !== 'false');
    const isA3Enabled = product.enable_a3 === true || (product.enable_a3 !== false && product.enable_a3 != null && (product as any).enable_a3 !== 'false');

    if (isA5Enabled) {
      list.push({ name: 'A5', price: product.price_a5 ?? basePrice });
    }
    if (isA4Enabled) {
      list.push({ name: 'A4', price: product.price_a4 ?? Math.round(basePrice * 1.6) });
    }
    if (isA3Enabled) {
      list.push({ name: 'A3', price: product.price_a3 ?? Math.round(basePrice * 2.8) });
    }

    return list;
  }, [product, basePrice]);

  const [selectedSize, setSelectedSize] = useState<{ name: string; price: number } | null>(
    availableSizes.length > 0 ? availableSizes[0] : null
  );
  const [customPhoto, setCustomPhoto] = useState<string | null>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  // Reset custom state when product changes
  useEffect(() => {
    setActiveImageIndex(0);
    setCustomPhoto(null);
    setPhotoError(null);
    if (availableSizes.length > 0) {
      setSelectedSize(availableSizes[0]);
    } else {
      setSelectedSize(null);
    }
  }, [product, availableSizes]);

  if (!isOpen) return null;

  const effectivePrice = selectedSize ? selectedSize.price : basePrice;
  const hasDiscount = product.discount_price !== null && product.discount_price !== undefined;
  
  // Ensure gallery has at least the thumbnail
  const gallery = product.gallery && product.gallery.length > 0 ? product.gallery : [product.thumbnail];

  const handlePhotoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingPhoto(true);
    setPhotoError(null);

    const reader = new FileReader();
    reader.onload = () => {
      setCustomPhoto(reader.result as string);
      setIsUploadingPhoto(false);
    };
    reader.onerror = () => {
      setPhotoError('Failed to read image file. Please try another photo.');
      setIsUploadingPhoto(false);
    };
    reader.readAsDataURL(file);
  };

  const getCustomizedProduct = (): Product => {
    return {
      ...product,
      price: effectivePrice,
      discount_price: null,
      selected_size: selectedSize ? selectedSize.name : undefined,
      custom_photo: customPhoto || undefined
    };
  };

  const validateAndExecute = (action: (p: Product) => void) => {
    if (product.has_custom_options && product.allow_photo_upload && !customPhoto) {
      setPhotoError('⚠️ Please upload your photo before proceeding.');
      return;
    }
    setPhotoError(null);
    action(getCustomizedProduct());
    onClose();
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImageIndex((prev) => (prev === 0 ? gallery.length - 1 : prev - 1));
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImageIndex((prev) => (prev === gallery.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 select-none">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
      />

      {/* Modal Container - Crisp pure white minimalist theme */}
      <div className="relative bg-white dark:bg-zinc-900 w-full max-w-4xl h-[95vh] md:h-auto max-h-[90vh] rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row z-10 animate-in zoom-in-95 slide-in-from-bottom-10 duration-400">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-30 p-2 rounded-full bg-white/90 dark:bg-zinc-800/90 text-gray-500 hover:text-gray-900 dark:hover:text-white shadow-sm border border-gray-100 dark:border-zinc-750 transition-colors"
        >
          <X size={16} />
        </button>

        {/* Left Side: Product Image Slider (Aspect 3:4 portrait style matching e-commerce screenshot) */}
        <div className="md:w-1/2 bg-white dark:bg-zinc-950 p-6 flex flex-col items-center justify-center relative aspect-[3/4] md:aspect-auto h-[45vh] md:h-auto min-h-[300px]">
          {/* Main Slider Display */}
          <div className="w-full h-full flex items-center justify-center relative overflow-hidden">
            <img 
              src={getImageUrl(gallery[activeImageIndex])} 
              alt={product.title} 
              className="max-w-[90%] max-h-[85%] object-contain transition-all duration-500"
            />

            {/* Slider Navigation Arrows (only show if multiple images exist) */}
            {gallery.length > 1 && (
              <>
                <button 
                  onClick={handlePrevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 dark:bg-zinc-800/80 text-gray-700 dark:text-zinc-300 hover:bg-white dark:hover:bg-zinc-700 shadow-md transition-colors"
                >
                  <ChevronLeft size={16} />
                </button>
                <button 
                  onClick={handleNextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 dark:bg-zinc-800/80 text-gray-700 dark:text-zinc-300 hover:bg-white dark:hover:bg-zinc-700 shadow-md transition-colors"
                >
                  <ChevronRight size={16} />
                </button>
              </>
            )}
          </div>

          {/* Slider Thumbnail Indicator Strip */}
          {gallery.length > 1 && (
            <div className="absolute bottom-4 flex gap-1.5 justify-center max-w-[90%] overflow-x-auto py-1">
              {gallery.map((img, idx) => (
                <div 
                  key={idx} 
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-10 h-10 rounded-lg border-2 bg-white dark:bg-zinc-900 p-0.5 cursor-pointer transition-all ${
                    activeImageIndex === idx ? 'border-brand-600 scale-105' : 'border-gray-250 dark:border-zinc-800 hover:border-gray-400'
                  }`}
                >
                  <img src={getImageUrl(img)} alt="Thumb" className="w-full h-full object-contain" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Product Details */}
        <div className="md:w-1/2 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto bg-white dark:bg-zinc-900">
          <div>
            {/* Stock status indicator */}
            <div className="flex items-center gap-3 mb-2">
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                product.stock > 0 ? 'bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400' : 'bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400'
              }`}>
                {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
              </span>
            </div>

            {/* Title */}
            <h2 className="text-xl sm:text-2xl font-display font-black text-gray-900 dark:text-white mb-2 leading-tight">
              {product.title}
            </h2>

            {/* Ratings (Muted styling) */}
            <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 dark:text-zinc-400 mb-4">
              <div className="flex text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={12} fill={i < Math.floor(product.rating || 5.0) ? "currentColor" : "none"} />
                ))}
              </div>
              <span>{(product.rating || 5.0).toFixed(1)}</span>
              <span className="text-gray-400 font-normal">({product.review_count || 10} reviews)</span>
            </div>

            {/* Pricing */}
            <div className="mb-4">
              {selectedSize ? (
                <div className="flex items-center gap-2">
                  <span className="text-xl sm:text-2xl font-display font-black text-brand-600 dark:text-brand-400">
                    ₹{effectivePrice.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[10px] font-bold text-gray-500 bg-gray-100 dark:bg-zinc-800 px-2 py-0.5 rounded-full">
                    ({selectedSize.name})
                  </span>
                </div>
              ) : hasDiscount ? (
                <div className="flex items-center gap-2.5">
                  <span className="text-base line-through text-gray-400">₹{product.price.toLocaleString('en-IN')}</span>
                  <span className="text-xl sm:text-2xl font-display font-black text-brand-600 dark:text-brand-400">
                    ₹{product.discount_price?.toLocaleString('en-IN')}
                  </span>
                </div>
              ) : (
                <span className="text-xl sm:text-2xl font-display font-black text-gray-900 dark:text-white">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
              )}
            </div>

            {/* Sizes Selection: Render whenever availableSizes has items */}
            {availableSizes.length > 0 && (
              <div className="mb-4">
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-zinc-400 block mb-2">
                  Select Size *
                </label>
                <div className="flex items-center gap-2 flex-wrap">
                  {availableSizes.map((s, idx) => {
                    const isSelected = selectedSize?.name === s.name;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedSize(s)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#041E42] text-white border-[#041E42] shadow-sm scale-[1.02]'
                            : 'bg-white dark:bg-zinc-800 text-gray-800 dark:text-zinc-200 border-gray-250 dark:border-zinc-700 hover:border-gray-400'
                        }`}
                      >
                        {s.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 🔥 BEST VALUE PACKS OFFER SECTION */}
            {product.show_best_value_packs !== false && (
              <div className="mb-4 p-2.5 sm:p-3 bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-amber-500/10 border border-amber-200/90 rounded-xl flex flex-col gap-2 shadow-2xs select-none">
                <div className="flex items-center justify-between border-b border-amber-200/60 pb-1.5">
                  <div className="flex items-center gap-1.5">
                    <Flame size={14} className="text-amber-600 fill-amber-500/30" />
                    <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-gray-950">
                      BEST VALUE PACKS
                    </span>
                  </div>
                  <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-wider bg-amber-600 text-white px-2 py-0.5 rounded-full">
                    AUTO DISCOUNT
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-1.5">
                  {/* Pack 1 */}
                  <div className="p-1.5 sm:p-2 bg-white border border-amber-200/90 rounded-lg flex flex-col justify-between gap-0.5 text-left">
                    <span className="text-[8px] font-bold text-gray-400 uppercase">Pack 1</span>
                    <span className="text-[9.5px] sm:text-[11px] font-black text-gray-900 leading-tight">
                      {product.best_value_pack_1_title || `Buy ${product.best_value_pack_1_buy ?? 1} → Get ${product.best_value_pack_1_get ?? 2} FREE`}
                    </span>
                    <span className="text-[8px] font-bold text-amber-700">
                      {product.best_value_pack_1_subtitle || `🛒 Add ${(product.best_value_pack_1_buy ?? 1) + (product.best_value_pack_1_get ?? 2)} posters`}
                    </span>
                  </div>

                  {/* Pack 2 */}
                  <div className="p-1.5 sm:p-2 bg-white border border-amber-200/90 rounded-lg flex flex-col justify-between gap-0.5 text-left">
                    <span className="text-[8px] font-bold text-gray-400 uppercase">Pack 2</span>
                    <span className="text-[9.5px] sm:text-[11px] font-black text-gray-900 leading-tight">
                      {product.best_value_pack_2_title || `Buy ${product.best_value_pack_2_buy ?? 2} → Get ${product.best_value_pack_2_get ?? 4} FREE`}
                    </span>
                    <span className="text-[8px] font-bold text-amber-700">
                      {product.best_value_pack_2_subtitle || `🛒 Add ${(product.best_value_pack_2_buy ?? 2) + (product.best_value_pack_2_get ?? 4)} posters`}
                    </span>
                  </div>

                  {/* Pack 3 */}
                  <div className="p-1.5 sm:p-2 bg-gradient-to-br from-amber-600 to-orange-600 text-white border border-amber-500 rounded-lg flex flex-col justify-between gap-0.5 text-left">
                    <span className="text-[7px] sm:text-[8px] font-black uppercase tracking-wider bg-yellow-300 text-gray-950 px-1 py-0.2 rounded-full self-start">
                      ⭐ BEST VALUE
                    </span>
                    <span className="text-[9.5px] sm:text-[11px] font-black text-white leading-tight">
                      {product.best_value_pack_3_title || `Buy ${product.best_value_pack_3_buy ?? 3} → Get ${product.best_value_pack_3_get ?? 9} FREE`}
                    </span>
                    <span className="text-[8px] font-bold text-yellow-200">
                      {product.best_value_pack_3_subtitle || `🛒 Add ${(product.best_value_pack_3_buy ?? 3) + (product.best_value_pack_3_get ?? 9)} posters`}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* --- CUSTOMIZABLE OPTIONS SECTION (Only rendered if product.has_custom_options is true) --- */}
            {Boolean(product.has_custom_options) && (
              <div className="mb-5 p-4 bg-slate-50 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700 rounded-2xl flex flex-col gap-4">
                <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-1.5 border-b border-slate-200 dark:border-zinc-700 pb-2">
                  <span>🎨 Customize Your Product</span>
                </h4>

                {/* 1. Size Selection */}
                {availableSizes.length > 0 && (
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold uppercase text-slate-600 dark:text-slate-400">
                      Select Size *
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {availableSizes.map((v, idx) => {
                        const isSelected = selectedSize?.name === v.name;
                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setSelectedSize(v)}
                            className={`px-3 py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer flex items-center gap-1.5 ${
                              isSelected
                                ? 'bg-[#041E42] text-white border-[#041E42] shadow-xs'
                                : 'bg-white dark:bg-zinc-800 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-zinc-700 hover:border-slate-300'
                            }`}
                          >
                            <span>{v.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 2. Photo Upload for Lithophane */}
                {Boolean(product.allow_photo_upload) && (
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold uppercase text-slate-600 dark:text-slate-400 flex items-center justify-between">
                      <span>Upload Your Photo (For 3D Lithophane Printing) *</span>
                      <span className="text-[9px] font-semibold text-blue-700 bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 rounded-full border border-blue-100 dark:border-blue-900">REQUIRED</span>
                    </label>

                    {customPhoto ? (
                      <div className="relative w-full aspect-video max-h-36 bg-slate-900 rounded-xl overflow-hidden border border-slate-300 flex items-center justify-center group">
                        <img src={customPhoto} alt="Customer Uploaded Preview" className="max-h-full object-contain" />
                        <button
                          type="button"
                          onClick={() => setCustomPhoto(null)}
                          className="absolute top-2 right-2 p-1.5 rounded-full bg-red-600 text-white text-[10px] font-bold shadow-md hover:bg-red-700 transition-colors"
                        >
                          Remove Photo
                        </button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-slate-300 dark:border-zinc-700 hover:border-slate-400 bg-white dark:bg-zinc-900 rounded-xl cursor-pointer transition-colors text-center">
                        <span className="text-xl mb-1">📸</span>
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Click to Select & Upload Photo</span>
                        <span className="text-[9px] font-medium text-slate-500 dark:text-slate-400 mt-0.5">Supports JPG, PNG, WEBP high-resolution photos</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoFileChange}
                          className="hidden"
                        />
                      </label>
                    )}

                    {isUploadingPhoto && (
                      <span className="text-[9.5px] font-bold text-blue-600 animate-pulse">Processing image preview...</span>
                    )}

                    {photoError && (
                      <span className="text-[9.5px] font-bold text-red-600 bg-red-50 p-2 rounded-lg border border-red-100">
                        {photoError}
                      </span>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col gap-2.5 border-b border-gray-100 dark:border-zinc-800 pb-6 mb-6">
              <div className="flex items-center gap-2.5">
                {/* Add to Cart */}
                <button 
                  onClick={() => validateAndExecute(onAddToCart)}
                  disabled={product.stock <= 0}
                  className={`flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 border text-xs font-semibold rounded-xl transition-colors ${
                    product.stock > 0 
                      ? 'border-gray-250 dark:border-zinc-700 text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800' 
                      : 'border-gray-200 dark:border-zinc-800 text-gray-400 dark:text-zinc-650 bg-gray-50 dark:bg-zinc-950 cursor-not-allowed'
                  }`}
                >
                  <ShoppingBag size={14} />
                  <span>{product.stock > 0 ? 'Add To Cart' : 'Out of Stock'}</span>
                </button>
                
                {/* Wishlist */}
                <button 
                  onClick={() => onAddToWishlist(getCustomizedProduct())}
                  className={`p-3 rounded-xl border border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors ${
                    isWishlisted ? 'text-red-500 border-red-200 dark:border-red-900/50 bg-red-50/50 dark:bg-red-950/20' : 'text-gray-500'
                  }`}
                >
                  <Heart size={14} fill={isWishlisted ? "currentColor" : "none"} />
                </button>
              </div>

              {/* Buy Now Button (Direct checkout) */}
              <button 
                onClick={() => validateAndExecute(onBuyNow)}
                disabled={product.stock <= 0}
                className={`w-full inline-flex items-center justify-center gap-2 px-5 py-3 border border-transparent text-xs font-bold rounded-xl text-white shadow-sm transition-colors ${
                  product.stock > 0 
                    ? 'bg-[#041E42] hover:bg-[#082a56] dark:bg-zinc-100 dark:text-gray-955 dark:hover:bg-zinc-200' 
                    : 'bg-gray-350 dark:bg-zinc-800 dark:text-zinc-550 cursor-not-allowed'
                }`}
              >
                <CreditCard size={14} />
                <span>{product.stock > 0 ? 'Buy Product Now' : 'Out of Stock'}</span>
              </button>
            </div>

            {/* 1. Short Description (Below all buttons, show only if exists and non-empty) */}
            {Boolean(product.short_description?.trim()) && (
              <div className="mb-6 p-3.5 bg-gray-50/90 dark:bg-zinc-800/80 rounded-2xl border border-gray-100 dark:border-zinc-750 text-xs font-semibold text-gray-700 dark:text-zinc-300 leading-relaxed">
                {product.short_description.trim()}
              </div>
            )}

            {/* 2. Full Description (Show only if exists and non-empty) */}
            {Boolean(product.description?.trim()) && (
              <div className="mb-6">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-white mb-2 border-b border-gray-100 dark:border-zinc-800 pb-1.5">
                  Full Description
                </h3>
                <div className="text-xs text-gray-650 dark:text-zinc-400 leading-relaxed whitespace-pre-line space-y-2 font-medium">
                  {product.description.trim()}
                </div>
              </div>
            )}

            {/* 3. Features & Specifications (Show only if any specification exists) */}
            {Boolean(
              (product.material && product.material.trim()) ||
              (product.print_quality && product.print_quality.trim()) ||
              (product.dimensions && product.dimensions.trim()) ||
              (product.production_time && product.production_time.trim()) ||
              (product.SKU && product.SKU.trim()) ||
              (product.weight && product.weight > 0)
            ) && (
              <div className="mb-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-white mb-2.5 border-b border-gray-100 dark:border-zinc-800 pb-1.5">
                  Features & Specifications
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {Boolean(product.material?.trim()) && (
                    <div className="p-2.5 rounded-xl bg-gray-50 dark:bg-zinc-800/60 border border-gray-100/80 dark:border-zinc-750 flex flex-col gap-0.5">
                      <span className="text-[10px] font-semibold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">Material</span>
                      <span className="font-semibold text-gray-800 dark:text-zinc-200">{product.material}</span>
                    </div>
                  )}

                  {Boolean(product.print_quality?.trim()) && (
                    <div className="p-2.5 rounded-xl bg-gray-50 dark:bg-zinc-800/60 border border-gray-100/80 dark:border-zinc-750 flex flex-col gap-0.5">
                      <span className="text-[10px] font-semibold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">Print Quality</span>
                      <span className="font-semibold text-gray-800 dark:text-zinc-200">{product.print_quality}</span>
                    </div>
                  )}

                  {Boolean(product.dimensions?.trim()) && (
                    <div className="p-2.5 rounded-xl bg-gray-50 dark:bg-zinc-800/60 border border-gray-100/80 dark:border-zinc-750 flex flex-col gap-0.5">
                      <span className="text-[10px] font-semibold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">Dimensions</span>
                      <span className="font-semibold text-gray-800 dark:text-zinc-200">{product.dimensions}</span>
                    </div>
                  )}

                  {Boolean(product.production_time?.trim()) && (
                    <div className="p-2.5 rounded-xl bg-gray-50 dark:bg-zinc-800/60 border border-gray-100/80 dark:border-zinc-750 flex flex-col gap-0.5">
                      <span className="text-[10px] font-semibold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">Production Lead Time</span>
                      <span className="font-semibold text-gray-800 dark:text-zinc-200">{product.production_time}</span>
                    </div>
                  )}

                  {Boolean(product.SKU?.trim()) && (
                    <div className="p-2.5 rounded-xl bg-gray-50 dark:bg-zinc-800/60 border border-gray-100/80 dark:border-zinc-750 flex flex-col gap-0.5">
                      <span className="text-[10px] font-semibold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">SKU Code</span>
                      <span className="font-semibold text-gray-800 dark:text-zinc-200">{product.SKU}</span>
                    </div>
                  )}

                  {Boolean(product.weight && product.weight > 0) && (
                    <div className="p-2.5 rounded-xl bg-gray-50 dark:bg-zinc-800/60 border border-gray-100/80 dark:border-zinc-750 flex flex-col gap-0.5">
                      <span className="text-[10px] font-semibold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">Weight</span>
                      <span className="font-semibold text-gray-800 dark:text-zinc-200">{product.weight}g</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

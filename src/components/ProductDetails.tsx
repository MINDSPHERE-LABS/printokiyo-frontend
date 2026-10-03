import React, { useState, useEffect, useRef } from 'react';
import type { Product } from '../types';
import { 
  ShoppingBag, ChevronLeft, ChevronRight, CreditCard, 
  Plus, Minus, Maximize2, X, ZoomIn, ZoomOut
} from 'lucide-react';
import { getImageUrl } from '../utils/image';
import { ProductCard } from './ProductCard';

interface ProductDetailsProps {
  product: Product;
  allProducts?: Product[];
  onAddToCart: (product: Product, quantity?: number) => void;
  onAddToWishlist: (product: Product) => void;
  onBuyNow: (product: Product, quantity?: number) => void;
  onViewDetails?: (product: Product) => void;
  onQuickAdd?: (product: Product) => void;
  isWishlisted?: boolean;
}

export const ProductDetails: React.FC<ProductDetailsProps> = ({
  product,
  allProducts = [],
  onAddToCart,
  onAddToWishlist,
  onBuyNow,
  onViewDetails,
  onQuickAdd
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
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

  const REQUIRED_PHOTOS = 5;
  const [customPhotos, setCustomPhotos] = useState<(string | null)[]>(Array(REQUIRED_PHOTOS).fill(null));
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [openAccordion, setOpenAccordion] = useState<number | null>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  // Reset state when active product changes
  useEffect(() => {
    setActiveImageIndex(0);
    setQuantity(1);
    setCustomPhotos(Array(REQUIRED_PHOTOS).fill(null));
    setPhotoError(null);
    setOpenAccordion(null);

    if (availableSizes.length > 0) {
      setSelectedSize(availableSizes[0]);
    } else {
      setSelectedSize(null);
    }
  }, [product, availableSizes]);

  const unitPrice = selectedSize ? selectedSize.price : basePrice;
  const totalPrice = unitPrice * quantity;
  const hasDiscount = product.discount_price !== null && product.discount_price !== undefined;

  // ── Offer-aware button price ──────────────────────────────────────────────
  // Apply the same Buy-X-Get-Y-Free formula as the cart, directly on quantity
  // so the "Add to Cart" button always shows the correct amount the user pays.
  const offerAdjustedPrice = React.useMemo(() => {
    if (!product.show_best_value_packs) return totalPrice;

    const p1Buy = product.best_value_pack_1_buy ?? 1;
    const p1Get = product.best_value_pack_1_get ?? 2;
    const p2Buy = product.best_value_pack_2_buy ?? 2;
    const p2Get = product.best_value_pack_2_get ?? 4;
    const p3Buy = product.best_value_pack_3_buy ?? 3;
    const p3Get = product.best_value_pack_3_get ?? 9;

    // Sort packs largest-first (same order as calculateCartItems)
    const packs = [
      { buy: p1Buy, get: p1Get, total: p1Buy + p1Get },
      { buy: p2Buy, get: p2Get, total: p2Buy + p2Get },
      { buy: p3Buy, get: p3Get, total: p3Buy + p3Get },
    ]
      .filter(p => p.buy > 0 && p.get > 0)
      .sort((a, b) => b.total - a.total);

    let remaining = quantity;
    let paidCount = 0;

    // 1. Full packs
    for (const pack of packs) {
      while (remaining >= pack.total) {
        paidCount  += pack.buy;    // pay for "buy" items
        remaining  -= pack.total;  // consumed a full pack group
      }
    }

    // 2. Leftover items (didn't fill a complete pack group) are always paid at regular price
    paidCount += remaining;

    return paidCount * unitPrice;
  }, [quantity, unitPrice, product, totalPrice]);

  // Gallery array
  const gallery = product.gallery && product.gallery.length > 0 ? product.gallery : [product.thumbnail];

  // Fullscreen / Maximize Modal State
  const [isMaximized, setIsMaximized] = useState(false);
  const [isZoomedIn, setIsZoomedIn] = useState(false);

  // Reset zoom whenever image changes
  useEffect(() => {
    setIsZoomedIn(false);
  }, [activeImageIndex]);

  // Handle escape key, arrow keys, and background scroll locking for maximize lightbox
  useEffect(() => {
    if (!isMaximized) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMaximized(false);
        setIsZoomedIn(false);
      } else if (e.key === 'ArrowLeft') {
        setActiveImageIndex((prev) => (prev === 0 ? gallery.length - 1 : prev - 1));
      } else if (e.key === 'ArrowRight') {
        setActiveImageIndex((prev) => (prev === gallery.length - 1 ? 0 : prev + 1));
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMaximized, gallery.length]);

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImageIndex((prev) => (prev === 0 ? gallery.length - 1 : prev - 1));
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImageIndex((prev) => (prev === gallery.length - 1 ? 0 : prev + 1));
  };

  const handlePhotoFileChange = (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoError(null);
    const reader = new FileReader();
    reader.onload = () => {
      setCustomPhotos(prev => {
        const next = [...prev];
        next[index] = reader.result as string;
        return next;
      });
    };
    reader.onerror = () => {
      setPhotoError('Failed to read image. Please try another photo.');
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = (index: number) => {
    setCustomPhotos(prev => {
      const next = [...prev];
      next[index] = null;
      return next;
    });
  };

  const uploadedCount = customPhotos.filter(Boolean).length;

  const getCustomizedProduct = (): Product => {
    // Serialize all uploaded photos as JSON array string
    const photosJson = JSON.stringify(customPhotos.filter(Boolean));
    return {
      ...product,
      price: unitPrice,
      discount_price: null,
      selected_size: selectedSize ? selectedSize.name : undefined,
      custom_photo: photosJson || undefined
    };
  };

  const validateAndExecute = (action: (p: Product, qty?: number) => void) => {
    if (product.has_custom_options && product.allow_photo_upload && uploadedCount < REQUIRED_PHOTOS) {
      setPhotoError(`⚠️ Please upload all ${REQUIRED_PHOTOS} photos before proceeding. (${uploadedCount}/${REQUIRED_PHOTOS} added)`);
      return;
    }
    setPhotoError(null);
    const itemToAdd = getCustomizedProduct();
    action(itemToAdd, quantity);
  };

  // Pack quantities & text
  const pack1Buy = product.best_value_pack_1_buy ?? 1;
  const pack1Get = product.best_value_pack_1_get ?? 2;
  const pack2Buy = product.best_value_pack_2_buy ?? 2;
  const pack2Get = product.best_value_pack_2_get ?? 4;
  const pack3Buy = product.best_value_pack_3_buy ?? 3;
  const pack3Get = product.best_value_pack_3_get ?? 9;

  // Sample up to 10 random products across all categories for Related Products
  const relatedProducts = React.useMemo(() => {
    const pId = product.id || product._id;
    const filtered = allProducts.filter(p => (p.id || p._id) !== pId);
    // Shuffle array
    const shuffled = [...filtered].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 10);
  }, [allProducts, product]);

  const scrollSlider = (direction: 'left' | 'right') => {
    if (sliderRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      sliderRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const accordions = [
    {
      title: 'How To Apply Offers',
      content: (
        <div className="space-y-2 text-xs text-gray-650 leading-relaxed font-medium">
          <p><strong className="text-gray-900">🔥 Pack 1: Buy {pack1Buy} → Get {pack1Get} FREE</strong> — Add {pack1Buy + pack1Get} posters to cart</p>
          <p><strong className="text-gray-900">🔥 Pack 2: Buy {pack2Buy} → Get {pack2Get} FREE</strong> — Add {pack2Buy + pack2Get} posters to cart</p>
          <p><strong className="text-gray-900">⭐ Pack 3: Buy {pack3Buy} → Get {pack3Get} FREE (BEST VALUE)</strong> — Add {pack3Buy + pack3Get} posters to cart</p>
          <p className="text-[#041E42] font-bold pt-1">🛒 Just add the required number of posters to cart — discount applies automatically.</p>
        </div>
      )
    },
    {
      title: 'Product Details',
      content: (
        <div className="space-y-2 text-xs text-gray-650 leading-relaxed font-medium">
          <p>• <strong className="text-gray-900">Paper Quality:</strong> Premium 300 GSM Ultra-White Matte Fine Art Cardstock.</p>
          <p>• <strong className="text-gray-900">Print Engine:</strong> High-Definition 12-Color Archival Pigment Printing (Fade resistant for 50+ years).</p>
          <p>• <strong className="text-gray-900">Finish:</strong> Anti-reflective smooth velvet matte coating.</p>
          <p>• <strong className="text-gray-900">Packaging:</strong> Shipped inside heavy-duty crush-proof protective packaging tubes.</p>
        </div>
      )
    },
    {
      title: 'Size Chart',
      content: (
        <div className="space-y-2 text-xs text-gray-650 leading-relaxed font-medium">
          <p>• <strong className="text-gray-900">A5 Size:</strong> 14.8 x 21 cm (5.8 x 8.3 inches) — Perfect for desk displays and compact collage frames.</p>
          <p>• <strong className="text-gray-900">A4 Size:</strong> 21 x 29.7 cm (8.3 x 11.7 inches) — Standard wall print size for bedrooms and setups.</p>
          <p>• <strong className="text-gray-900">A3 Size:</strong> 29.7 x 42 cm (11.7 x 16.5 inches) — Large high-impact center wall art poster.</p>
        </div>
      )
    },
    {
      title: 'Shipping Policy',
      content: (
        <div className="space-y-2 text-xs text-gray-650 leading-relaxed font-medium">
          <p>• <strong className="text-gray-900">Dispatch:</strong> Orders are queued, printed, and dispatched within 24-48 business hours.</p>
          <p>• <strong className="text-gray-900">Delivery:</strong> 3-5 business days across India via express courier partners.</p>
          <p>• <strong className="text-gray-900">Free Delivery:</strong> Complimentary shipping on orders above ₹999.</p>
          <p>• <strong className="text-gray-900">Replacement Guarantee:</strong> Easy replacement within 5 business days for any transit damage.</p>
        </div>
      )
    }
  ];

  return (
    <div className="w-full bg-white text-gray-955 pb-12 flex flex-col gap-10 animate-in fade-in duration-300">
      
      {/* 1. Main Product Section */}
      <div className="flex flex-col md:flex-row gap-6 md:gap-10">
        
        {/* Left: Product Image Display with Thumbnail Previews Below */}
        <div className="md:w-1/2 flex flex-col gap-3">
          {/* Main Large Display Box */}
          <div 
            onClick={() => setIsMaximized(true)}
            className="relative aspect-[3/4] w-full bg-transparent border-0 rounded-none overflow-hidden flex items-center justify-center group cursor-zoom-in"
            title="Click to maximize image"
          >
            <img 
              src={getImageUrl(gallery[activeImageIndex])} 
              alt={product.title} 
              className="w-full h-full object-contain transition-all duration-300 rounded-none group-hover:scale-[1.02]"
            />

            {/* Maximize Button (Bottom-Left Corner, Icon-only) */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsMaximized(true);
              }}
              className="absolute bottom-2.5 left-2.5 sm:bottom-3 sm:left-3 p-2 bg-white/90 hover:bg-black text-gray-800 hover:text-white border border-gray-200/80 shadow-xs rounded-none transition-all flex items-center justify-center opacity-80 group-hover:opacity-100 cursor-pointer z-10 backdrop-blur-xs"
              title="Maximize image"
              aria-label="Maximize image"
            >
              <Maximize2 size={16} strokeWidth={2.2} />
            </button>

            {/* Slider Arrows if gallery > 1 */}
            {gallery.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrevImage}
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-white/90 text-gray-700 hover:text-black hover:bg-white transition-all shadow-md rounded-none border border-gray-200 cursor-pointer z-10"
                  title="Previous image"
                >
                  <ChevronLeft size={18} strokeWidth={2.5} />
                </button>
                <button
                  type="button"
                  onClick={handleNextImage}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-white/90 text-gray-700 hover:text-black hover:bg-white transition-all shadow-md rounded-none border border-gray-200 cursor-pointer z-10"
                  title="Next image"
                >
                  <ChevronRight size={18} strokeWidth={2.5} />
                </button>
              </>
            )}
          </div>

          {/* Image Previews Strip BELOW Main Image */}
          {gallery.length > 1 && (
            <div className="flex items-center gap-2.5 overflow-x-auto pb-1 no-scrollbar">
              {gallery.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-16 h-20 rounded-none border-2 overflow-hidden bg-transparent p-0.5 shrink-0 transition-all cursor-pointer ${
                    activeImageIndex === idx ? 'border-[#041E42] shadow-sm' : 'border-gray-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={getImageUrl(img)} alt="" className="w-full h-full object-contain rounded-none" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Options & Details */}
        <div className="md:w-1/2 flex flex-col text-left justify-between">
          <div>
            {/* Title */}
            <h1 className="text-xl sm:text-2xl md:text-3xl font-display font-black text-gray-950 mb-3 leading-tight">
              {product.title}
            </h1>

            {/* Sizes Selection: Render whenever availableSizes has items */}
            {availableSizes.length > 0 && (
              <div className="mb-4">
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block mb-2">
                  Select Size *
                </label>
                <div className="flex items-center gap-2.5 flex-wrap">
                  {availableSizes.map((s, idx) => {
                    const isSelected = selectedSize?.name === s.name;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedSize(s)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
                          isSelected
                            ? 'bg-[#041E42] text-white border-[#041E42] shadow-sm scale-[1.02]'
                            : 'bg-white text-gray-800 border-gray-250 hover:border-gray-400 hover:bg-gray-50'
                        }`}
                      >
                        <span>{s.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Pricing Section (Below Sizes) */}
            <div className="mb-4 flex items-baseline gap-2 select-none">
              <span className="text-2xl sm:text-3xl font-display font-black text-gray-950">
                ₹{unitPrice.toLocaleString('en-IN')}
              </span>
              {hasDiscount && (
                <span className="text-sm line-through text-gray-400 font-normal">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
              )}
            </div>

            {/* 🔥 BEST VALUE PACKS OFFER SECTION - Sleek & Compact Mobile Grid */}
            {product.show_best_value_packs !== false && (
              <div className="mb-4 p-2.5 sm:p-3.5 bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-amber-500/10 border border-amber-200/90 rounded-xl flex flex-col gap-2 shadow-2xs select-none">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-amber-200/60 pb-1.5">
                  <div className="flex items-center gap-1">
                    <span className="text-xs sm:text-sm">🔥</span>
                    <span className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-gray-950">
                      BEST VALUE PACKS
                    </span>
                  </div>
                  <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-wider bg-amber-600 text-white px-2 py-0.5 rounded-full">
                    AUTO DISCOUNT
                  </span>
                </div>

                {/* 3 Pack Cards in 1 Single Compact Row */}
                <div className="grid grid-cols-3 gap-1.5 sm:gap-2.5">
                  {/* Pack 1 */}
                  <button
                    type="button"
                    onClick={() => setQuantity(pack1Buy + pack1Get)}
                    className={`p-2 sm:p-2.5 rounded-lg flex flex-col justify-between gap-1 shadow-2xs text-left cursor-pointer transition-all hover:scale-[1.02] active:scale-95 ${
                      quantity === pack1Buy + pack1Get
                        ? 'bg-amber-50 border-2 border-amber-600 ring-2 ring-amber-300'
                        : 'bg-white border border-amber-200/90 hover:border-amber-400'
                    }`}
                  >
                    <div className="flex flex-col">
                      <div className="flex items-center justify-between">
                        <span className="text-[8.5px] sm:text-[9.5px] font-bold text-gray-400 uppercase">Pack 1</span>
                        {quantity === pack1Buy + pack1Get && (
                          <span className="text-[7.5px] font-black uppercase text-amber-700 bg-amber-200/80 px-1 py-0.2 rounded">SELECTED</span>
                        )}
                      </div>
                      <span className="text-[10px] sm:text-xs font-black text-gray-900 leading-tight">
                        {product.best_value_pack_1_title || `Buy ${pack1Buy} → Get ${pack1Get} FREE`}
                      </span>
                    </div>
                    <div className="border-t border-gray-100 pt-1 flex flex-col">
                      <span className="text-[8.5px] sm:text-[9.5px] font-bold text-amber-700">
                        {product.best_value_pack_1_subtitle || `🛒 Add ${pack1Buy + pack1Get} posters`}
                      </span>
                    </div>
                  </button>

                  {/* Pack 2 */}
                  <button
                    type="button"
                    onClick={() => setQuantity(pack2Buy + pack2Get)}
                    className={`p-2 sm:p-2.5 rounded-lg flex flex-col justify-between gap-1 shadow-2xs text-left cursor-pointer transition-all hover:scale-[1.02] active:scale-95 ${
                      quantity === pack2Buy + pack2Get
                        ? 'bg-amber-50 border-2 border-amber-600 ring-2 ring-amber-300'
                        : 'bg-white border border-amber-200/90 hover:border-amber-400'
                    }`}
                  >
                    <div className="flex flex-col">
                      <div className="flex items-center justify-between">
                        <span className="text-[8.5px] sm:text-[9.5px] font-bold text-gray-400 uppercase">Pack 2</span>
                        {quantity === pack2Buy + pack2Get && (
                          <span className="text-[7.5px] font-black uppercase text-amber-700 bg-amber-200/80 px-1 py-0.2 rounded">SELECTED</span>
                        )}
                      </div>
                      <span className="text-[10px] sm:text-xs font-black text-gray-900 leading-tight">
                        {product.best_value_pack_2_title || `Buy ${pack2Buy} → Get ${pack2Get} FREE`}
                      </span>
                    </div>
                    <div className="border-t border-gray-100 pt-1 flex flex-col">
                      <span className="text-[8.5px] sm:text-[9.5px] font-bold text-amber-700">
                        {product.best_value_pack_2_subtitle || `🛒 Add ${pack2Buy + pack2Get} posters`}
                      </span>
                    </div>
                  </button>

                  {/* Pack 3 - BEST VALUE */}
                  <button
                    type="button"
                    onClick={() => setQuantity(pack3Buy + pack3Get)}
                    className={`p-2 sm:p-2.5 rounded-lg flex flex-col justify-between gap-1 shadow-xs relative overflow-hidden text-left cursor-pointer transition-all hover:scale-[1.02] active:scale-95 ${
                      quantity === pack3Buy + pack3Get
                        ? 'bg-gradient-to-br from-amber-600 to-orange-600 text-white border-2 border-yellow-300 ring-2 ring-orange-300'
                        : 'bg-gradient-to-br from-amber-600 to-orange-600 text-white border border-amber-500 hover:brightness-105'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[7.5px] sm:text-[8.5px] font-black uppercase tracking-wider bg-yellow-300 text-gray-950 px-1.5 py-0.2 rounded-full self-start">
                        ⭐ BEST VALUE
                      </span>
                      {quantity === pack3Buy + pack3Get && (
                        <span className="text-[7.5px] font-black uppercase text-gray-900 bg-yellow-300 px-1 py-0.2 rounded">SELECTED</span>
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] sm:text-xs font-black text-white leading-tight">
                        {product.best_value_pack_3_title || `Buy ${pack3Buy} → Get ${pack3Get} FREE`}
                      </span>
                    </div>
                    <div className="border-t border-white/20 pt-1 flex flex-col">
                      <span className="text-[8.5px] sm:text-[9.5px] font-bold text-yellow-200">
                        {product.best_value_pack_3_subtitle || `🛒 Add ${pack3Buy + pack3Get} posters`}
                      </span>
                    </div>
                  </button>
                </div>

                {/* Footer Note */}
                <div className="text-[8.5px] sm:text-[9.5px] font-semibold text-gray-700 bg-amber-100/50 px-2 py-0.5 rounded-md text-center">
                  🛒 Add required posters to cart — discount applies automatically.
                </div>
              </div>
            )}

            {/* Custom Photo Upload Section — 5 Photos Required */}
            {Boolean(product.has_custom_options && product.allow_photo_upload) && (
              <div className="mb-5 rounded-2xl overflow-hidden border border-blue-100 bg-gradient-to-b from-blue-50/60 to-white">
                {/* Header */}
                <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-blue-100">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[11px] font-black uppercase tracking-wide text-slate-800 flex items-center gap-1.5">
                      📸 Upload Your 5 Photos
                    </span>
                    <span className="text-[9.5px] text-slate-500 font-medium">All 5 photos are required to place your order</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {/* Progress pill */}
                    <span className={`text-[9px] font-black px-2.5 py-1 rounded-full border ${
                      uploadedCount === REQUIRED_PHOTOS
                        ? 'bg-green-100 text-green-700 border-green-200'
                        : 'bg-blue-100 text-blue-700 border-blue-200'
                    }`}>
                      {uploadedCount === REQUIRED_PHOTOS ? '✅ All set!' : `${uploadedCount} / ${REQUIRED_PHOTOS}`}
                    </span>
                  </div>
                </div>

                {/* 5-Square Grid */}
                <div className="grid grid-cols-5 gap-2 p-3">
                  {customPhotos.map((photo, idx) => (
                    <div key={idx} className="relative flex flex-col items-center gap-1">
                      {photo ? (
                        /* Filled slot — preview */
                        <div className="relative w-full aspect-square rounded-none overflow-hidden border-2 border-green-400 shadow-sm group">
                          <img
                            src={photo}
                            alt={`Photo ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                          {/* Overlay on hover */}
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1 flex-col">
                            {/* Re-upload */}
                            <label className="cursor-pointer bg-white/90 text-slate-800 text-[8px] font-bold px-2 py-0.5 rounded-none hover:bg-white transition">
                              Change
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handlePhotoFileChange(idx)}
                                className="hidden"
                              />
                            </label>
                            {/* Remove */}
                            <button
                              type="button"
                              onClick={() => handleRemovePhoto(idx)}
                              className="bg-red-500 text-white text-[8px] font-bold px-2 py-0.5 rounded-none hover:bg-red-600 transition"
                            >
                              Remove
                            </button>
                          </div>
                          {/* Green check badge */}
                          <div className="absolute top-1 right-1 w-4 h-4 bg-green-500 rounded-none flex items-center justify-center shadow">
                            <span className="text-white text-[8px] font-black">✓</span>
                          </div>
                        </div>
                      ) : (
                        /* Empty slot */
                        <label className={`w-full aspect-square flex flex-col items-center justify-center border-2 border-dashed rounded-none cursor-pointer transition-all select-none
                          ${photoError ? 'border-red-400 bg-red-50 hover:border-red-500' : 'border-slate-300 bg-white hover:border-blue-400 hover:bg-blue-50/50'}
                        `}>
                          <span className="text-xl leading-none mb-1">+</span>
                          <span className="text-[8px] font-bold text-slate-500 leading-none">Photo {idx + 1}</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handlePhotoFileChange(idx)}
                            className="hidden"
                          />
                        </label>
                      )}
                    </div>
                  ))}
                </div>

                {/* Progress bar */}
                <div className="px-3 pb-3">
                  <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${uploadedCount === REQUIRED_PHOTOS ? 'bg-green-500' : 'bg-blue-500'}`}
                      style={{ width: `${(uploadedCount / REQUIRED_PHOTOS) * 100}%` }}
                    />
                  </div>
                  {photoError && (
                    <p className="mt-2 text-[9.5px] font-bold text-red-600 flex items-center gap-1">
                      {photoError}
                    </p>
                  )}
                  {uploadedCount === REQUIRED_PHOTOS && (
                    <p className="mt-1.5 text-[9.5px] font-bold text-green-700 flex items-center gap-1">
                      ✅ All 5 photos uploaded — you're good to go!
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="mb-5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block mb-2">
                Quantity
              </label>
              <div className="inline-flex items-center border border-gray-250 rounded-xl bg-white p-1">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  <Minus size={14} />
                </button>
                <span className="w-10 text-center text-xs font-bold text-gray-900 select-none">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            {/* Main Action Buttons */}
            <div className="flex flex-col gap-3 mb-6">
              {/* ADD TO CART - Price Button */}
              <button
                type="button"
                onClick={() => validateAndExecute(onAddToCart)}
                disabled={product.stock <= 0}
                className={`w-full py-3.5 px-6 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-between border cursor-pointer ${
                  product.stock > 0 
                    ? 'border-gray-900 text-gray-955 bg-white hover:bg-gray-50 shadow-xs' 
                    : 'border-gray-200 text-gray-400 bg-gray-50 cursor-not-allowed'
                }`}
              >
                <div className="flex items-center gap-2">
                  <ShoppingBag size={16} />
                  <span>Add To Cart</span>
                </div>
                <div className="flex flex-col items-end leading-tight">
                  {offerAdjustedPrice < totalPrice && (
                    <span className="text-[9px] font-semibold text-slate-400 line-through">
                      ₹{totalPrice.toLocaleString('en-IN')}
                    </span>
                  )}
                  <span className={`font-extrabold ${offerAdjustedPrice < totalPrice ? 'text-green-600' : ''}`}>
                    ₹{offerAdjustedPrice.toLocaleString('en-IN')}
                  </span>
                </div>
              </button>

              {/* BUY NOW Button */}
              <button
                type="button"
                onClick={() => validateAndExecute(onBuyNow)}
                disabled={product.stock <= 0}
                className={`w-full py-3.5 px-6 rounded-xl text-xs font-black uppercase tracking-wider text-white shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  product.stock > 0 ? 'bg-[#041E42] hover:bg-[#082a56]' : 'bg-gray-300 cursor-not-allowed'
                }`}
              >
                <CreditCard size={16} />
                <span>Buy Now</span>
              </button>
            </div>

            {/* Accordion Dropdowns matching uploaded image media_1790507088508.png */}
            <div className="border-t border-gray-200 divide-y divide-gray-200 mb-6">
              {accordions.map((item, idx) => {
                const isOpen = openAccordion === idx;
                return (
                  <div key={idx} className="py-3">
                    <button
                      type="button"
                      onClick={() => setOpenAccordion(isOpen ? null : idx)}
                      className="w-full flex items-center justify-between text-left text-xs sm:text-sm font-semibold text-gray-900 hover:text-black transition-colors cursor-pointer"
                    >
                      <span>{item.title}</span>
                      <span className="text-base font-bold text-gray-700 ml-2">
                        {isOpen ? '−' : '+'}
                      </span>
                    </button>
                    {isOpen && (
                      <div className="pt-3 pb-1 animate-in fade-in duration-200">
                        {item.content}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Related Products Horizontal Carousel (10 Random Products across all categories) */}
      {relatedProducts.length > 0 && (
        <div className="border-t border-gray-100 pt-8 mt-4 text-left">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg sm:text-xl font-display font-black text-gray-955 uppercase tracking-tight">
              Related Posters & Art Prints
            </h3>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => scrollSlider('left')}
                className="p-2 rounded-full border border-gray-200 text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
                aria-label="Previous related products"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => scrollSlider('right')}
                className="p-2 rounded-full border border-gray-200 text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
                aria-label="Next related products"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          <div 
            ref={sliderRef}
            className="flex items-stretch gap-4 overflow-x-auto pb-4 no-scrollbar scroll-smooth"
          >
            {relatedProducts.map((relProd) => (
              <div 
                key={relProd.id || relProd._id || relProd.slug} 
                className="w-56 sm:w-72 shrink-0"
              >
                <ProductCard
                  product={relProd}
                  onAddToCart={onAddToCart}
                  onBuyNow={onBuyNow}
                  onAddToWishlist={onAddToWishlist}
                  onViewDetails={onViewDetails}
                  onQuickAdd={onQuickAdd}
                  isWishlisted={false}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Customer Community Showcase Collage (Masonry Layout with Dynamic Variable Aspect Ratios) */}
      <div className="border-t border-gray-100 pt-10 mt-6 text-left select-none">
        <div className="mb-6 flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#041E42] bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">
              COMMUNITY SANCTUARIES
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-display font-black text-gray-950 uppercase tracking-tight">
            Where Our Art Finds Its Home
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 font-medium">
            Real rooms, gaming setups, and creative spaces brought to life by the PrintOkiyo family.
          </p>
        </div>

        {/* Dynamic Masonry Collage Grid - Variable image sizes with seamless interlocking columns */}
        <div className="columns-2 sm:columns-3 md:columns-4 gap-3.5 space-y-3.5">
          {[
            { src: '/customers-review-images/mock-up-2.webp', aspect: 'aspect-[4/5]', caption: 'Gaming Setup Sanctuary ♥' },
            { src: '/customers-review-images/spiderman_Master_A3_19844x7016.png', aspect: 'aspect-[16/9]', caption: 'Panoramic Wall Display ♥' },
            { src: '/customers-review-images/59_jpg.webp', aspect: 'aspect-[3/4]', caption: 'Bedroom Wall Centerpiece ♥' },
            { src: '/customers-review-images/poster_A3_L_01.png', aspect: 'aspect-[4/3]', caption: 'A3 Split Print Display ♥' },
            { src: '/customers-review-images/spiderman_Panel_01.png', aspect: 'aspect-[3/4]', caption: 'Comic Art Frame ♥' },
            { src: '/customers-review-images/download.jpg', aspect: 'aspect-[1/1]', caption: 'Cozy Workspace Vibe ♥' },
            { src: '/customers-review-images/ironman_master_4961x10524.png', aspect: 'aspect-[9/16]', caption: 'Vertical Wall Poster ♥' },
            { src: '/customers-review-images/spiderman_Panel_02.png', aspect: 'aspect-[4/5]', caption: 'Superhero Collection ♥' },
            { src: '/customers-review-images/spiderman_Panel_03.png', aspect: 'aspect-[3/4]', caption: 'Framed Art Piece ♥' }
          ].map((item, idx) => (
            <div 
              key={idx} 
              className={`relative ${item.aspect} w-full overflow-hidden bg-gray-100 rounded-none group border border-gray-200/70 shadow-2xs hover:shadow-lg transition-all duration-300 break-inside-avoid mb-3.5`}
            >
              <img 
                src={item.src} 
                alt="Community space print" 
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-104"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                <span className="text-[10px] font-bold text-white bg-black/50 px-2.5 py-1 rounded-full backdrop-blur-xs flex items-center gap-1">
                  <span>{item.caption}</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Fullscreen Maximize Lightbox Modal */}
      {isMaximized && (
        <div 
          className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-sm flex flex-col justify-between p-3 sm:p-6 animate-in fade-in duration-200 select-none"
          onClick={() => {
            setIsMaximized(false);
            setIsZoomedIn(false);
          }}
        >
          {/* Top Bar: Title & Action Controls */}
          <div 
            className="flex items-center justify-between text-white w-full z-20 shrink-0"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2.5 sm:gap-3">
              <span className="text-xs sm:text-sm font-display font-black uppercase tracking-wider text-gray-200 line-clamp-1 max-w-[200px] sm:max-w-md">
                {product.title}
              </span>
              {gallery.length > 1 && (
                <span className="text-[10px] sm:text-xs font-mono bg-white/10 px-2 py-0.5 border border-white/20 text-gray-300 rounded-none">
                  {activeImageIndex + 1} / {gallery.length}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {/* Zoom In / Out Toggle Button */}
              <button
                type="button"
                onClick={() => setIsZoomedIn(!isZoomedIn)}
                className="px-2.5 py-1.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-none transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-bold"
                title={isZoomedIn ? "Reset Zoom" : "Zoom In"}
              >
                {isZoomedIn ? <ZoomOut size={15} /> : <ZoomIn size={15} />}
                <span className="hidden sm:inline">{isZoomedIn ? "100%" : "Zoom"}</span>
              </button>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => {
                  setIsMaximized(false);
                  setIsZoomedIn(false);
                }}
                className="px-3 py-1.5 bg-white text-black hover:bg-amber-400 rounded-none transition-colors cursor-pointer flex items-center gap-1 font-black text-xs"
                title="Close (Esc)"
              >
                <X size={16} strokeWidth={2.5} />
                <span className="hidden sm:inline">ESC</span>
              </button>
            </div>
          </div>

          {/* Center Image Viewport */}
          <div 
            className="relative flex-1 flex items-center justify-center overflow-auto my-2 p-2"
            onClick={() => {
              setIsMaximized(false);
              setIsZoomedIn(false);
            }}
          >
            <div 
              className={`relative transition-transform duration-300 ${isZoomedIn ? 'scale-150 cursor-zoom-out' : 'cursor-zoom-in'}`}
              onClick={(e) => {
                e.stopPropagation();
                setIsZoomedIn(!isZoomedIn);
              }}
              title={isZoomedIn ? "Click to zoom out" : "Click to zoom in"}
            >
              <img 
                src={getImageUrl(gallery[activeImageIndex])} 
                alt={product.title} 
                className="max-h-[75vh] sm:max-h-[80vh] max-w-[92vw] object-contain rounded-none shadow-2xl bg-[#0e1015]"
              />
            </div>

            {/* Lightbox Prev Button */}
            {gallery.length > 1 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrevImage(e);
                }}
                className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 p-3 bg-black/70 hover:bg-black text-white border border-white/20 rounded-none transition-all cursor-pointer shadow-xl z-20"
                title="Previous Image (←)"
              >
                <ChevronLeft size={22} strokeWidth={2.5} />
              </button>
            )}

            {/* Lightbox Next Button */}
            {gallery.length > 1 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleNextImage(e);
                }}
                className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 p-3 bg-black/70 hover:bg-black text-white border border-white/20 rounded-none transition-all cursor-pointer shadow-xl z-20"
                title="Next Image (→)"
              >
                <ChevronRight size={22} strokeWidth={2.5} />
              </button>
            )}
          </div>

          {/* Bottom Thumbnails Strip (if > 1) */}
          {gallery.length > 1 && (
            <div 
              className="flex items-center justify-center gap-2 overflow-x-auto py-1 z-20 shrink-0"
              onClick={(e) => e.stopPropagation()}
            >
              {gallery.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setActiveImageIndex(idx);
                    setIsZoomedIn(false);
                  }}
                  className={`w-12 h-16 rounded-none border-2 overflow-hidden bg-black/50 p-0.5 shrink-0 transition-all cursor-pointer ${
                    activeImageIndex === idx ? 'border-amber-400 scale-105 shadow-md' : 'border-white/30 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={getImageUrl(img)} alt="" className="w-full h-full object-contain rounded-none" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

import React, { useState, useEffect, useRef } from 'react';
import type { Product } from '../types';
import { 
  ShoppingBag, ChevronLeft, ChevronRight, CreditCard, 
  Plus, Minus
} from 'lucide-react';
import { getImageUrl } from '../utils/image';
import { ProductCard } from './ProductCard';

interface ProductDetailsProps {
  product: Product;
  allProducts?: Product[];
  onAddToCart: (product: Product) => void;
  onAddToWishlist: (product: Product) => void;
  onBuyNow: (product: Product) => void;
  onViewDetails?: (product: Product) => void;
  isWishlisted?: boolean;
}

export const ProductDetails: React.FC<ProductDetailsProps> = ({
  product,
  allProducts = [],
  onAddToCart,
  onAddToWishlist,
  onBuyNow,
  onViewDetails
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [openAccordion, setOpenAccordion] = useState<number | null>(null);

  // Compute available sizes: A5, A4, A3
  const basePrice = product.discount_price ?? product.price ?? 89;
  
  const availableSizes = (product.has_custom_options && product.allow_size_variants && product.size_variants && product.size_variants.length > 0)
    ? product.size_variants
    : [
        { name: 'A5', price: product.price_a5 ?? basePrice },
        { name: 'A4', price: product.price_a4 ?? Math.round(basePrice * 1.6) },
        { name: 'A3', price: product.price_a3 ?? Math.round(basePrice * 2.8) }
      ];

  const [selectedSize, setSelectedSize] = useState<{ name: string; price: number }>(availableSizes[0]);

  const [customPhoto, setCustomPhoto] = useState<string | null>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  // Reset state when active product changes
  useEffect(() => {
    setActiveImageIndex(0);
    setQuantity(1);
    setCustomPhoto(null);
    setPhotoError(null);
    setOpenAccordion(null);

    const sizes = (product.has_custom_options && product.allow_size_variants && product.size_variants && product.size_variants.length > 0)
      ? product.size_variants
      : [
          { name: 'A5', price: product.price_a5 ?? (product.discount_price ?? product.price ?? 89) },
          { name: 'A4', price: product.price_a4 ?? Math.round((product.discount_price ?? product.price ?? 89) * 1.6) },
          { name: 'A3', price: product.price_a3 ?? Math.round((product.discount_price ?? product.price ?? 89) * 2.8) }
        ];
    setSelectedSize(sizes[0]);
  }, [product]);

  const unitPrice = selectedSize.price;
  const totalPrice = unitPrice * quantity;
  const hasDiscount = product.discount_price !== null && product.discount_price !== undefined;

  // Gallery array
  const gallery = product.gallery && product.gallery.length > 0 ? product.gallery : [product.thumbnail];

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImageIndex((prev) => (prev === 0 ? gallery.length - 1 : prev - 1));
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImageIndex((prev) => (prev === gallery.length - 1 ? 0 : prev + 1));
  };

  const handlePhotoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoError(null);

    const reader = new FileReader();
    reader.onload = () => {
      setCustomPhoto(reader.result as string);
    };
    reader.onerror = () => {
      setPhotoError('Failed to read image file. Please try another photo.');
    };
    reader.readAsDataURL(file);
  };

  const getCustomizedProduct = (): Product => {
    return {
      ...product,
      price: selectedSize.price,
      discount_price: null,
      selected_size: selectedSize.name,
      custom_photo: customPhoto || undefined
    };
  };

  const validateAndExecute = (action: (p: Product) => void) => {
    if (product.has_custom_options && product.allow_photo_upload && !customPhoto) {
      setPhotoError('⚠️ Please upload your photo before proceeding.');
      return;
    }
    setPhotoError(null);
    const itemToAdd = getCustomizedProduct();
    for (let i = 0; i < quantity; i++) {
      action(itemToAdd);
    }
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
          <div className="relative aspect-square w-full bg-gray-50 border border-gray-150 rounded-2xl overflow-hidden flex items-center justify-center group shadow-2xs">
            <img 
              src={getImageUrl(gallery[activeImageIndex])} 
              alt={product.title} 
              className="w-full h-full object-cover transition-all duration-300"
            />

            {/* Slider Arrows if gallery > 1 */}
            {gallery.length > 1 && (
              <>
                <button
                  onClick={handlePrevImage}
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 text-gray-700 hover:text-black hover:bg-white transition-all shadow-md"
                >
                  <ChevronLeft size={18} strokeWidth={2.5} />
                </button>
                <button
                  onClick={handleNextImage}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 text-gray-700 hover:text-black hover:bg-white transition-all shadow-md"
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
                  className={`w-16 h-16 rounded-xl border-2 overflow-hidden bg-gray-50 p-0.5 shrink-0 transition-all cursor-pointer ${
                    activeImageIndex === idx ? 'border-[#041E42] shadow-sm scale-102' : 'border-gray-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={getImageUrl(img)} alt="" className="w-full h-full object-cover rounded-lg" />
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

            {/* Sizes Selection: A5, A4, A3 */}
            <div className="mb-4">
              <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block mb-2">
                Select Size *
              </label>
              <div className="flex items-center gap-2.5 flex-wrap">
                {availableSizes.map((s, idx) => {
                  const isSelected = selectedSize.name === s.name;
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
                      <span className="opacity-80 text-[11px]">₹{s.price}</span>
                    </button>
                  );
                })}
              </div>
            </div>

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
                  <div className="p-2 sm:p-2.5 bg-white border border-amber-200/90 rounded-lg flex flex-col justify-between gap-1 shadow-2xs text-left">
                    <div className="flex flex-col">
                      <span className="text-[8.5px] sm:text-[9.5px] font-bold text-gray-400 uppercase">Pack 1</span>
                      <span className="text-[10px] sm:text-xs font-black text-gray-900 leading-tight">
                        {product.best_value_pack_1_title || `Buy ${pack1Buy} → Get ${pack1Get} FREE`}
                      </span>
                    </div>
                    <div className="border-t border-gray-100 pt-1 flex flex-col">
                      <span className="text-[8.5px] sm:text-[9.5px] font-bold text-amber-700">
                        {product.best_value_pack_1_subtitle || `🛒 Add ${pack1Buy + pack1Get} posters`}
                      </span>
                    </div>
                  </div>

                  {/* Pack 2 */}
                  <div className="p-2 sm:p-2.5 bg-white border border-amber-200/90 rounded-lg flex flex-col justify-between gap-1 shadow-2xs text-left">
                    <div className="flex flex-col">
                      <span className="text-[8.5px] sm:text-[9.5px] font-bold text-gray-400 uppercase">Pack 2</span>
                      <span className="text-[10px] sm:text-xs font-black text-gray-900 leading-tight">
                        {product.best_value_pack_2_title || `Buy ${pack2Buy} → Get ${pack2Get} FREE`}
                      </span>
                    </div>
                    <div className="border-t border-gray-100 pt-1 flex flex-col">
                      <span className="text-[8.5px] sm:text-[9.5px] font-bold text-amber-700">
                        {product.best_value_pack_2_subtitle || `🛒 Add ${pack2Buy + pack2Get} posters`}
                      </span>
                    </div>
                  </div>

                  {/* Pack 3 - BEST VALUE */}
                  <div className="p-2 sm:p-2.5 bg-gradient-to-br from-amber-600 to-orange-600 text-white border border-amber-500 rounded-lg flex flex-col justify-between gap-1 shadow-xs relative overflow-hidden text-left">
                    <span className="text-[7.5px] sm:text-[8.5px] font-black uppercase tracking-wider bg-yellow-300 text-gray-950 px-1.5 py-0.2 rounded-full self-start">
                      ⭐ BEST VALUE
                    </span>
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
                  </div>
                </div>

                {/* Footer Note */}
                <div className="text-[8.5px] sm:text-[9.5px] font-semibold text-gray-700 bg-amber-100/50 px-2 py-0.5 rounded-md text-center">
                  🛒 Add required posters to cart — discount applies automatically.
                </div>
              </div>
            )}

            {/* Custom Photo Upload Section (if enabled) */}
            {Boolean(product.has_custom_options && product.allow_photo_upload) && (
              <div className="mb-5 p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col gap-3">
                <label className="text-[10px] font-bold uppercase text-slate-700 flex items-center justify-between">
                  <span>Upload Custom Image *</span>
                  <span className="text-[9px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">REQUIRED</span>
                </label>
                {customPhoto ? (
                  <div className="relative w-full aspect-video max-h-36 bg-slate-900 rounded-xl overflow-hidden border border-slate-300 flex items-center justify-center">
                    <img src={customPhoto} alt="Preview" className="max-h-full object-contain" />
                    <button
                      type="button"
                      onClick={() => setCustomPhoto(null)}
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-red-600 text-white text-[10px] font-bold shadow-md hover:bg-red-700"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-slate-300 hover:border-slate-400 bg-white rounded-xl cursor-pointer text-center">
                    <span className="text-lg mb-1">📸</span>
                    <span className="text-xs font-bold text-slate-800">Click to Select Photo</span>
                    <input type="file" accept="image/*" onChange={handlePhotoFileChange} className="hidden" />
                  </label>
                )}
                {photoError && <span className="text-[10px] font-bold text-red-600">{photoError}</span>}
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
                <span className="font-extrabold">₹{totalPrice.toLocaleString('en-IN')}</span>
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
              className={`relative ${item.aspect} w-full overflow-hidden bg-gray-100 rounded-2xl group border border-gray-200/70 shadow-2xs hover:shadow-lg transition-all duration-300 break-inside-avoid mb-3.5`}
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
    </div>
  );
};

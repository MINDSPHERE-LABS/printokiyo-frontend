import React, { useState, useMemo } from 'react';
import { X } from 'lucide-react';
import type { Product } from '../types';
import { calculateCartItems } from '../utils/cartOffers';

interface QuickAddModalProps {
  product: Product;
  onClose: () => void;
  onAddToCart: (items: { product: Product; sizeName: string; sizePrice: number; qty: number }[]) => void;
  onViewDetails?: (product: Product) => void;
}

export const QuickAddModal: React.FC<QuickAddModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onViewDetails
}) => {
  const basePrice = product.price_a5 ?? (product.discount_price ?? product.price ?? 89);

  // Extract all available sizes (custom sizes + enabled standard sizes)
  const availableSizes: { name: string; price: number }[] = useMemo(() => {
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

    // Fallback if no sizes configured
    if (list.length === 0) {
      list.push({ name: 'Standard', price: basePrice });
    }

    return list;
  }, [product, basePrice]);

  // Minimum variant price for the "From Rs. X.00" label
  const minPrice = useMemo(() => {
    if (availableSizes.length === 0) return basePrice;
    return Math.min(...availableSizes.map(s => s.price));
  }, [availableSizes, basePrice]);

  // Stepper quantities for each size row
  const [quantities, setQuantities] = useState<number[]>(() => 
    new Array(availableSizes.length).fill(0)
  );

  const updateQty = (idx: number, delta: number) => {
    setQuantities(prev => {
      const next = [...prev];
      next[idx] = Math.max(0, (next[idx] || 0) + delta);
      return next;
    });
  };

  const totalItems = useMemo(() => {
    return quantities.reduce((sum, q) => sum + q, 0);
  }, [quantities]);

  // Reconstruct selected items array for calculateCartItems
  const selectedItemsList: Product[] = useMemo(() => {
    const list: Product[] = [];
    availableSizes.forEach((size, idx) => {
      const q = quantities[idx] || 0;
      for (let i = 0; i < q; i++) {
        list.push({
          ...product,
          price: size.price,
          discount_price: null,
          selected_size: size.name
        });
      }
    });
    return list;
  }, [availableSizes, quantities, product]);

  // Run official offer calculation
  const calculatedItems = useMemo(() => {
    return calculateCartItems(selectedItemsList);
  }, [selectedItemsList]);

  // Undiscounted subtotal
  const originalSubtotal = useMemo(() => {
    return selectedItemsList.reduce((sum, it) => sum + (it.price ?? 0), 0);
  }, [selectedItemsList]);

  // Final subtotal after best value pack offers
  const finalSubtotal = useMemo(() => {
    return calculatedItems.reduce((sum, it) => sum + it.final_price, 0);
  }, [calculatedItems]);

  const hasOfferDiscount = product.show_best_value_packs !== false && finalSubtotal < originalSubtotal;
  const savings = Math.max(0, originalSubtotal - finalSubtotal);
  const appliedOfferTitle = calculatedItems.find(it => it.offer_applied)?.offer_applied || 'Offer Applied';

  // Per-size breakdown mapping
  const sizeBreakdown = useMemo(() => {
    const map = new Map<string, { originalTotal: number; finalTotal: number; freeCount: number }>();
    availableSizes.forEach(size => {
      map.set(size.name, { originalTotal: 0, finalTotal: 0, freeCount: 0 });
    });

    calculatedItems.forEach(item => {
      const key = item.selected_size || 'Standard';
      const cur = map.get(key);
      if (cur) {
        cur.originalTotal += item.original_unit_price;
        cur.finalTotal += item.final_price;
        if (item.is_free) {
          cur.freeCount += 1;
        }
      }
    });

    return map;
  }, [availableSizes, calculatedItems]);

  const isPhotoRequired = Boolean(product.has_custom_options && product.allow_photo_upload);

  const handleSubmit = () => {
    if (isPhotoRequired) {
      if (onViewDetails) {
        onViewDetails(product);
      }
      onClose();
      return;
    }

    const itemsToAdd = availableSizes
      .map((size, idx) => ({
        product,
        sizeName: size.name,
        sizePrice: size.price,
        qty: quantities[idx] || 0
      }))
      .filter(item => item.qty > 0);

    if (itemsToAdd.length === 0) return;

    onAddToCart(itemsToAdd);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none">
      {/* Dark backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      />

      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-[390px] bg-white rounded-none shadow-2xl p-5 z-10 animate-in fade-in zoom-in-95 duration-200 text-left">
        {/* Top-Right Close Button (FrameKro style black square) */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-0 right-0 bg-black text-white p-2 hover:bg-gray-800 transition-colors cursor-pointer"
          aria-label="Close quick add"
        >
          <X size={16} />
        </button>

        {/* Product Thumbnail & Price Header */}
        <div className="flex items-center gap-3.5 pr-8">
          <div className="w-16 h-16 shrink-0 bg-gray-50 border border-gray-200 flex items-center justify-center p-1 overflow-hidden">
            <img 
              src={product.thumbnail} 
              alt={product.title} 
              className="w-full h-full object-contain"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-gray-500 font-medium">From</span>
            <span className="text-base font-bold text-gray-900 leading-tight">
              Rs. {minPrice.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Applied Offer Banner — Only shows which offer is actually applied */}
        {hasOfferDiscount && (
          <div className="mt-3 bg-emerald-50 border border-emerald-200 px-3 py-1.5 flex items-center justify-between text-emerald-900 animate-in fade-in duration-150">
            <span className="text-[11px] font-black flex items-center gap-1.5">
              <span>🎉</span>
              <span>{appliedOfferTitle} Applied</span>
            </span>
            <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded">
              Saved Rs. {savings.toFixed(2)}
            </span>
          </div>
        )}

        {/* Column Headers */}
        <div className="flex items-center justify-between text-[10.5px] font-bold text-gray-500 uppercase tracking-wider mt-4 pb-2 border-b border-gray-200">
          <span>VARIANT</span>
          <span>VARIANT TOTAL</span>
        </div>

        {/* Variants List */}
        {isPhotoRequired ? (
          <div className="py-6 text-center flex flex-col items-center gap-2">
            <span className="text-2xl">📸</span>
            <p className="text-xs text-gray-600 font-medium px-4">
              This poster requires custom photo uploads. Please customize on the product page.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 max-h-[48vh] overflow-y-auto no-scrollbar my-1">
            {availableSizes.map((size, idx) => {
              const qty = quantities[idx] || 0;
              const stats = sizeBreakdown.get(size.name) || { originalTotal: 0, finalTotal: 0, freeCount: 0 };
              const isRowDiscounted = stats.finalTotal < stats.originalTotal;

              return (
                <div key={idx} className="flex items-center justify-between py-3">
                  {/* Left: Size info & Stepper */}
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-bold text-gray-900 leading-tight">
                      {size.name}
                    </span>
                    <span className="text-[11px] text-gray-500 leading-none mb-1">
                      Rs. {size.price.toFixed(2)}/ea
                    </span>

                    {/* Stepper [ - 0 + ] */}
                    <div className="inline-flex items-center border border-gray-300 rounded-none bg-white">
                      <button
                        type="button"
                        onClick={() => updateQty(idx, -1)}
                        disabled={qty === 0}
                        className="w-7 h-7 flex items-center justify-center text-gray-600 hover:text-black hover:bg-gray-100 disabled:opacity-30 cursor-pointer text-sm font-bold"
                        aria-label={`Decrease ${size.name} quantity`}
                      >
                        −
                      </button>
                      <span className="w-8 text-center text-xs font-bold text-gray-900">
                        {qty}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQty(idx, 1)}
                        className="w-7 h-7 flex items-center justify-center text-gray-600 hover:text-black hover:bg-gray-100 cursor-pointer text-sm font-bold"
                        aria-label={`Increase ${size.name} quantity`}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Right: Row Total with Offer Breakdown */}
                  <div className="flex flex-col items-end leading-tight">
                    {isRowDiscounted ? (
                      <>
                        <span className="text-[10.5px] text-gray-400 line-through">
                          Rs. {stats.originalTotal.toFixed(2)}
                        </span>
                        <span className="text-xs font-bold text-green-600">
                          Rs. {stats.finalTotal.toFixed(2)}
                        </span>
                        {stats.freeCount > 0 && (
                          <span className="text-[8.5px] font-black uppercase text-emerald-700 bg-emerald-50 border border-emerald-200 px-1 py-0.2 rounded mt-0.5">
                            {stats.freeCount} FREE
                          </span>
                        )}
                      </>
                    ) : (
                      <span className="text-xs font-bold text-gray-900">
                        Rs. {stats.originalTotal.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Footer Summary & Action */}
        <div className="border-t border-gray-200 pt-3.5 mt-2 flex flex-col items-center gap-2.5">
          <div className="flex flex-col items-center text-center">
            <span className="text-xs text-gray-600 font-medium">
              <strong className="text-gray-950 font-bold">{totalItems}</strong> Total items
            </span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              {hasOfferDiscount && (
                <span className="text-xs sm:text-sm text-gray-400 line-through font-semibold">
                  Rs. {originalSubtotal.toFixed(2)}
                </span>
              )}
              <span className={`text-base sm:text-lg font-black ${hasOfferDiscount ? 'text-green-600' : 'text-gray-950'}`}>
                Rs. {finalSubtotal.toFixed(2)}
              </span>
              <span className="text-xs text-gray-500 font-medium">
                Product subtotal
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={!isPhotoRequired && totalItems === 0}
            className={`w-full py-2.5 text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer rounded-none ${
              isPhotoRequired || totalItems > 0
                ? 'bg-black text-white hover:bg-gray-800 shadow-xs'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {isPhotoRequired ? (
              <span>CUSTOMIZE POSTER</span>
            ) : totalItems > 0 ? (
              <div className="flex items-center gap-1.5">
                <span>ADD TO CART</span>
                <span>•</span>
                {hasOfferDiscount && (
                  <span className="text-[10px] text-gray-400 line-through">
                    Rs. {originalSubtotal.toFixed(2)}
                  </span>
                )}
                <span className={hasOfferDiscount ? 'text-green-400 font-bold' : ''}>
                  Rs. {finalSubtotal.toFixed(2)}
                </span>
              </div>
            ) : (
              <span>ADD TO CART</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

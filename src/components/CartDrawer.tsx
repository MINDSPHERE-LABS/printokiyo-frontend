import React, { useMemo } from 'react';
import { 
  X, ShoppingBag, Trash2, Plus, Minus, ArrowRight, ShieldCheck, 
  Truck, Flame, CheckCircle2 
} from 'lucide-react';
import type { Product, StoreSettings } from '../types';
import { getImageUrl } from '../utils/image';
import { calculateCartItems, groupCalculatedCartItems, type GroupedCartItem } from '../utils/cartOffers';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: Product[];
  onRemoveItem: (index: number) => void;
  onIncreaseGroup?: (group: GroupedCartItem) => void;
  onDecreaseGroup?: (group: GroupedCartItem) => void;
  onRemoveGroup?: (group: GroupedCartItem) => void;
  onProceedToCheckout: () => void;
  storeSettings?: StoreSettings;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  onRemoveItem,
  onIncreaseGroup,
  onDecreaseGroup,
  onRemoveGroup,
  onProceedToCheckout,
  storeSettings
}) => {
  // Lock background scroll when drawer is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle escape key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const calculatedItems = useMemo(() => calculateCartItems(cart), [cart]);
  const groupedItems = useMemo(() => groupCalculatedCartItems(calculatedItems), [calculatedItems]);

  const subtotal = useMemo(() => {
    return calculatedItems.reduce((acc, item) => acc + item.final_price, 0);
  }, [calculatedItems]);

  const originalTotal = useMemo(() => {
    return calculatedItems.reduce((acc, item) => acc + (item.original_unit_price || item.price || 0), 0);
  }, [calculatedItems]);

  const totalDiscount = originalTotal - subtotal;
  const freeItemsCount = calculatedItems.filter(item => item.is_free).length;

  const threshold = storeSettings?.delivery_charge_threshold ?? 999;
  const progressPercent = Math.min(100, Math.round((subtotal / threshold) * 100));
  const amountForFreeDelivery = Math.max(0, threshold - subtotal);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden select-none animate-in fade-in duration-200">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity cursor-pointer"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300 border-l border-gray-150">
          
          {/* 1. Header */}
          <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between bg-white z-10">
            <div className="flex items-center gap-2">
              <ShoppingBag size={20} className="text-gray-950" />
              <h2 className="text-base sm:text-lg font-display font-black text-gray-950 uppercase tracking-tight">
                Your Bag
              </h2>
              <span className="text-xs font-black bg-zinc-950 text-white px-2 py-0.5 rounded-full">
                {cart.length}
              </span>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-gray-500 hover:text-black hover:bg-gray-100 transition-colors cursor-pointer"
              aria-label="Close cart drawer"
            >
              <X size={20} />
            </button>
          </div>

          {/* 2. Free Delivery Meter */}
          <div className="px-4 sm:px-5 py-3 bg-zinc-50 border-b border-gray-100">
            <div className="flex items-center justify-between text-xs mb-1.5 font-bold">
              {subtotal >= threshold ? (
                <span className="text-emerald-700 flex items-center gap-1.5 font-black uppercase tracking-wider text-[11px]">
                  <CheckCircle2 size={14} className="text-emerald-600" />
                  🎉 You unlocked FREE Delivery across India!
                </span>
              ) : (
                <span className="text-gray-700 text-[11px] font-semibold">
                  Add <strong className="text-gray-950 font-black">₹{amountForFreeDelivery}</strong> more for <span className="text-emerald-600 uppercase font-black">FREE Delivery</span>
                </span>
              )}
              <span className="text-gray-400 font-bold text-[10px]">{progressPercent}%</span>
            </div>
            <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 rounded-full ${
                  subtotal >= threshold ? 'bg-emerald-500' : 'bg-gradient-to-r from-amber-400 to-amber-600'
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* 3. Applied Offers Banner (if any free items) */}
          {freeItemsCount > 0 && (
            <div className="px-4 sm:px-5 py-2 bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-amber-500/15 border-b border-amber-200/80 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 font-black text-amber-900 uppercase tracking-wider text-[10px]">
                <Flame size={13} className="text-amber-600 fill-amber-500/30" />
                <span>PACK OFFER APPLIED: {freeItemsCount} FREE {freeItemsCount === 1 ? 'POSTER' : 'POSTERS'}</span>
              </div>
              <span className="text-emerald-700 font-black text-[11px]">
                -₹{totalDiscount.toFixed(0)}
              </span>
            </div>
          )}

          {/* 4. Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 divide-y divide-gray-100">
            {groupedItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mb-4">
                  <ShoppingBag size={28} />
                </div>
                <h3 className="text-base font-display font-black text-gray-950 uppercase tracking-tight">
                  Your bag is empty
                </h3>
                <p className="text-xs text-gray-500 mt-1 max-w-xs">
                  Discover trending anime, supercars, devotionals, and aesthetic wall sets.
                </p>
                <button
                  onClick={onClose}
                  className="mt-6 px-6 py-2.5 rounded-full bg-zinc-950 text-white font-black text-xs uppercase tracking-wider hover:bg-zinc-800 transition-colors shadow-xs cursor-pointer"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              groupedItems.map((group, groupIdx) => {
                const item = group.sample_item;
                const unitPrice = group.original_unit_price || item.original_unit_price || item.price || 89;
                const isGroupFree = group.is_free;

                return (
                  <div key={group.group_id || groupIdx} className="pt-3.5 first:pt-0 flex gap-3 sm:gap-4 items-start">
                    {/* Thumbnail */}
                    <div className="w-16 h-20 sm:w-20 sm:h-24 shrink-0 rounded-lg bg-gray-100 overflow-hidden relative border border-gray-150">
                      <img 
                        src={getImageUrl(group.thumbnail || item.thumbnail)} 
                        alt={group.title || item.title} 
                        className="w-full h-full object-cover" 
                      />
                      {isGroupFree && (
                        <span className="absolute bottom-1 left-1 bg-emerald-600 text-white text-[8px] font-black uppercase px-1 py-0.2 rounded shadow-xs">
                          FREE
                        </span>
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs sm:text-sm font-bold text-gray-900 line-clamp-1">
                          {group.title || item.title}
                        </h4>
                        
                        {/* Remove Group Button */}
                        <button
                          onClick={() => {
                            if (onRemoveGroup) {
                              onRemoveGroup(group);
                            } else {
                              const targetIdx = group.cart_indices[group.cart_indices.length - 1];
                              onRemoveItem(targetIdx);
                            }
                          }}
                          className="text-gray-400 hover:text-red-500 p-1 transition-colors cursor-pointer"
                          title="Remove item"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>

                      {/* Variant Size Badge */}
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[10px] uppercase font-bold text-gray-500">
                          Size: <span className="text-gray-900 font-black">{group.selected_size || item.selected_size || 'A5'}</span>
                        </span>
                        {group.offer_applied && (
                          <span className="text-[9px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.2 rounded">
                            {group.offer_applied}
                          </span>
                        )}
                      </div>

                      {/* Pricing & Quantity modifier */}
                      <div className="flex items-center justify-between mt-3">
                        {/* Quantity Counter */}
                        <div className="flex items-center border border-gray-250 rounded-lg overflow-hidden bg-white">
                          <button
                            onClick={() => {
                              if (onDecreaseGroup) {
                                onDecreaseGroup(group);
                              } else {
                                const targetIdx = group.cart_indices[group.cart_indices.length - 1];
                                onRemoveItem(targetIdx);
                              }
                            }}
                            className="px-2 py-1 text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
                            aria-label="Decrease quantity"
                          >
                            <Minus size={11} />
                          </button>
                          <span className="px-2 text-xs font-black text-gray-900 min-w-5 text-center">
                            {group.quantity}
                          </span>
                          <button
                            onClick={() => {
                              if (onIncreaseGroup) {
                                onIncreaseGroup(group);
                              }
                            }}
                            disabled={!onIncreaseGroup}
                            className="px-2 py-1 text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer disabled:opacity-40"
                            aria-label="Increase quantity"
                          >
                            <Plus size={11} />
                          </button>
                        </div>

                        {/* Price Display */}
                        <div className="text-right">
                          <div className="text-xs sm:text-sm font-black text-gray-950">
                            {isGroupFree ? (
                              <span className="text-emerald-600 uppercase font-black">FREE</span>
                            ) : (
                              <span>₹{group.total_final_price.toLocaleString('en-IN')}</span>
                            )}
                          </div>
                          {isGroupFree && (
                            <span className="text-[10px] text-gray-400 line-through block">
                              ₹{(unitPrice * group.quantity).toLocaleString('en-IN')}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* 5. Footer Summary & Checkout Button */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-gray-150 bg-white space-y-3 z-10 shadow-lg">
              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-gray-600 font-medium">
                  <span>Subtotal</span>
                  <span className="text-gray-950 font-bold">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                {totalDiscount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Pack Offer Savings</span>
                    <span>-₹{totalDiscount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600 font-medium">
                  <span>Delivery</span>
                  <span className={subtotal >= threshold ? "text-emerald-600 font-black uppercase" : "text-gray-950 font-bold"}>
                    {subtotal >= threshold ? "FREE" : "₹70"}
                  </span>
                </div>
              </div>

              {/* Total Row */}
              <div className="pt-2 border-t border-gray-100 flex items-baseline justify-between">
                <div>
                  <span className="text-xs text-gray-500 font-bold block uppercase tracking-wider">Estimated Total</span>
                  <span className="text-[10px] text-gray-400">Taxes & shipping calculated at checkout</span>
                </div>
                <div className="text-right">
                  <span className="text-xl sm:text-2xl font-display font-black text-gray-950">
                    ₹{(subtotal >= threshold ? subtotal : subtotal + 70).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Checkout CTA */}
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onProceedToCheckout();
                }}
                className="w-full py-3.5 rounded-xl bg-zinc-950 hover:bg-black text-white font-display font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-md hover:shadow-xl transition-all cursor-pointer group"
              >
                <span>PROCEED TO CHECKOUT</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>

              {/* Trust Badges */}
              <div className="flex items-center justify-center gap-3 pt-1 text-[10px] text-gray-500 font-medium select-none">
                <span className="flex items-center gap-1">
                  <ShieldCheck size={12} className="text-emerald-600" /> Razorpay Secured
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Truck size={12} className="text-zinc-600" /> Pan-India Express
                </span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

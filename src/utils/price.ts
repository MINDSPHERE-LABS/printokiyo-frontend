import type { Product } from '../types';

export const getEffectivePrice = (item: Product | { price: number; discount_price?: number | null; price_a5?: number | null; selected_size?: string }): number => {
  if (!item) return 0;
  if ('selected_size' in item && item.selected_size && typeof item.price === 'number' && item.price > 0) {
    return item.price;
  }
  if (
    'price_a5' in item &&
    item.price_a5 !== undefined &&
    item.price_a5 !== null &&
    typeof item.price_a5 === 'number' &&
    item.price_a5 > 0
  ) {
    return item.price_a5;
  }
  if (
    item.discount_price !== undefined &&
    item.discount_price !== null &&
    typeof item.discount_price === 'number' &&
    item.discount_price > 0 &&
    item.discount_price < item.price
  ) {
    return item.discount_price;
  }
  return item?.price || 0;
};

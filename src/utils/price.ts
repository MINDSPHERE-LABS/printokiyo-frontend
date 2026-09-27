import type { Product } from '../types';

export const getEffectivePrice = (item: Product | { price: number; discount_price?: number | null }): number => {
  if (
    item &&
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

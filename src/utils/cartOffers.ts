import type { Product } from '../types';
import { getEffectivePrice } from './price';

export interface CartItemCalculated extends Product {
  cart_index: number;
  original_unit_price: number;
  final_price: number;
  is_free: boolean;
  offer_applied?: string;
}

export function calculateCartItems(cart: Product[]): CartItemCalculated[] {
  if (!cart || cart.length === 0) return [];

  // Map each item with initial properties
  const items: CartItemCalculated[] = cart.map((item, index) => {
    const unitPrice = getEffectivePrice(item);
    return {
      ...item,
      cart_index: index,
      original_unit_price: unitPrice,
      final_price: unitPrice,
      is_free: false,
      offer_applied: undefined
    };
  });

  // Check offer rules from first product in cart or custom configs
  const firstProd = cart[0];
  const buy1 = firstProd?.best_value_pack_1_buy ?? 1;
  const get1 = firstProd?.best_value_pack_1_get ?? 2;
  const pack1Total = buy1 + get1; // default 3

  const buy2 = firstProd?.best_value_pack_2_buy ?? 2;
  const get2 = firstProd?.best_value_pack_2_get ?? 4;
  const pack2Total = buy2 + get2; // default 6

  const buy3 = firstProd?.best_value_pack_3_buy ?? 3;
  const get3 = firstProd?.best_value_pack_3_get ?? 9;
  const pack3Total = buy3 + get3; // default 12

  // Sort item indices by original_unit_price descending so highest value items are paid first
  const sortedIndices = [...items.keys()].sort(
    (a, b) => items[b].original_unit_price - items[a].original_unit_price
  );

  let tempN = sortedIndices.length;
  let paidCount = 0;
  let freeCount = 0;

  // Match pack 3 (largest pack)
  if (pack3Total > 0 && buy3 > 0 && get3 > 0) {
    while (tempN >= pack3Total) {
      paidCount += buy3;
      freeCount += get3;
      tempN -= pack3Total;
    }
  }

  // Match pack 2
  if (pack2Total > 0 && buy2 > 0 && get2 > 0) {
    while (tempN >= pack2Total) {
      paidCount += buy2;
      freeCount += get2;
      tempN -= pack2Total;
    }
  }

  // Match pack 1
  if (pack1Total > 0 && buy1 > 0 && get1 > 0) {
    while (tempN >= pack1Total) {
      paidCount += buy1;
      freeCount += get1;
      tempN -= pack1Total;
    }
  }

  paidCount += tempN; // Remainder items under pack 1 threshold are paid

  // Top `paidCount` items are paid, remaining `freeCount` items are FREE
  for (let i = 0; i < sortedIndices.length; i++) {
    const itemIdx = sortedIndices[i];
    if (i < paidCount) {
      items[itemIdx].final_price = items[itemIdx].original_unit_price;
      items[itemIdx].is_free = false;
    } else {
      items[itemIdx].final_price = 0;
      items[itemIdx].is_free = true;
      items[itemIdx].offer_applied = `Buy ${buy1} Get ${get1} FREE`;
    }
  }

  return items;
}

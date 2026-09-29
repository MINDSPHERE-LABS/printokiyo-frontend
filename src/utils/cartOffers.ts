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

  // Filter items eligible for Best Value Packs offer (show_best_value_packs !== false)
  const eligibleIndices = items
    .map((item, idx) => (item.show_best_value_packs !== false ? idx : -1))
    .filter((idx) => idx !== -1);

  if (eligibleIndices.length === 0) {
    return items;
  }

  // Read offer settings from first eligible product
  const firstEligible = items[eligibleIndices[0]];

  const pack1Buy = firstEligible.best_value_pack_1_buy ?? 1;
  const pack1Get = firstEligible.best_value_pack_1_get ?? 2;
  const pack1Title = firstEligible.best_value_pack_1_title || `Buy ${pack1Buy} → Get ${pack1Get} FREE`;

  const pack2Buy = firstEligible.best_value_pack_2_buy ?? 2;
  const pack2Get = firstEligible.best_value_pack_2_get ?? 4;
  const pack2Title = firstEligible.best_value_pack_2_title || `Buy ${pack2Buy} → Get ${pack2Get} FREE`;

  const pack3Buy = firstEligible.best_value_pack_3_buy ?? 3;
  const pack3Get = firstEligible.best_value_pack_3_get ?? 9;
  const pack3Title = firstEligible.best_value_pack_3_title || `Buy ${pack3Buy} → Get ${pack3Get} FREE`;

  // Filter and sort available packs by total pack size descending (largest pack first)
  const packs = [
    { buy: pack1Buy, get: pack1Get, total: pack1Buy + pack1Get, title: pack1Title },
    { buy: pack2Buy, get: pack2Get, total: pack2Buy + pack2Get, title: pack2Title },
    { buy: pack3Buy, get: pack3Get, total: pack3Buy + pack3Get, title: pack3Title }
  ]
  .filter(p => p.buy > 0 && p.get > 0 && p.total > 0)
  .sort((a, b) => b.total - a.total);

  // Sort eligible item indices by original_unit_price descending (highest value paid first)
  const sortedEligible = [...eligibleIndices].sort(
    (a, b) => items[b].original_unit_price - items[a].original_unit_price
  );

  let remainingCount = sortedEligible.length;
  let currentOffset = 0; // Pointer in sortedEligible array

  // 1. Apply full pack combinations first (largest total first)
  for (const pack of packs) {
    while (remainingCount >= pack.total) {
      // The first `pack.buy` items in this pack set are PAID
      for (let p = 0; p < pack.buy; p++) {
        const paidItemIdx = sortedEligible[currentOffset + p];
        items[paidItemIdx].final_price = items[paidItemIdx].original_unit_price;
        items[paidItemIdx].is_free = false;
      }
      currentOffset += pack.buy;

      // The next `pack.get` items in this pack set are FREE (final_price = 0)
      for (let g = 0; g < pack.get; g++) {
        const freeItemIdx = sortedEligible[currentOffset + g];
        items[freeItemIdx].final_price = 0;
        items[freeItemIdx].is_free = true;
        items[freeItemIdx].offer_applied = pack.title;
      }
      currentOffset += pack.get;

      remainingCount -= pack.total;
    }
  }

  // 2. Any leftover items that didn't complete a full pack remain paid at regular price
  for (let r = 0; r < remainingCount; r++) {
    const paidItemIdx = sortedEligible[currentOffset + r];
    items[paidItemIdx].final_price = items[paidItemIdx].original_unit_price;
    items[paidItemIdx].is_free = false;
  }

  return items;
}

export interface GroupedCartItem {
  group_id: string;
  sample_item: CartItemCalculated;
  title: string;
  thumbnail: string;
  selected_size?: string;
  custom_photo?: string;
  is_free: boolean;
  offer_applied?: string;
  original_unit_price: number;
  unit_final_price: number;
  total_final_price: number;
  quantity: number;
  cart_indices: number[];
}

export function groupCalculatedCartItems(calculatedCart: CartItemCalculated[]): GroupedCartItem[] {
  if (!calculatedCart || calculatedCart.length === 0) return [];

  const groupsMap = new Map<string, GroupedCartItem>();

  for (const item of calculatedCart) {
    const prodId = item.id || (item as any)._id || item.slug || item.title;
    const size = item.selected_size || 'default';
    const isFreeKey = item.is_free ? `free_${item.offer_applied || 'offer'}` : 'paid';
    const customPhotoKey = item.custom_photo ? item.custom_photo.slice(-20) : 'none';

    const groupKey = `${prodId}_${size}_${isFreeKey}_${customPhotoKey}_${item.original_unit_price}`;

    if (groupsMap.has(groupKey)) {
      const existing = groupsMap.get(groupKey)!;
      existing.quantity += 1;
      existing.total_final_price += item.final_price;
      existing.cart_indices.push(item.cart_index);
    } else {
      groupsMap.set(groupKey, {
        group_id: groupKey,
        sample_item: item,
        title: item.title,
        thumbnail: item.thumbnail,
        selected_size: item.selected_size,
        custom_photo: item.custom_photo,
        is_free: item.is_free,
        offer_applied: item.offer_applied,
        original_unit_price: item.original_unit_price,
        unit_final_price: item.final_price,
        total_final_price: item.final_price,
        quantity: 1,
        cart_indices: [item.cart_index]
      });
    }
  }

  return Array.from(groupsMap.values());
}


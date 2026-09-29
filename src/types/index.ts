export interface Product {
  id: string;
  _id?: string; // in case returned as mongo object directly
  title: string;
  slug: string;
  short_description: string;
  description: string;
  price: number;
  discount_price?: number | null;
  category: string;
  subcategory?: string | null;
  tags: string[];
  thumbnail: string;
  gallery: string[];
  videos: string[];
  available_colors: string[];
  available_sizes: string[];
  material: string;
  print_quality: string;
  production_time: string;
  stock: number;
  SKU: string;
  weight: number;
  dimensions: string;
  shipping_weight: number;
  rating: number;
  review_count: number;
  sales: number;
  views: number;
  featured: boolean;
  new_arrival: boolean;
  best_seller: boolean;
  published: boolean;
  pinned_to_top?: boolean;
  has_custom_options?: boolean;
  allow_photo_upload?: boolean;
  allow_size_variants?: boolean;
  enable_a5?: boolean;
  enable_a4?: boolean;
  enable_a3?: boolean;
  custom_size_1?: string | null;
  custom_price_1?: number | null;
  custom_size_2?: string | null;
  custom_price_2?: number | null;
  custom_size_3?: string | null;
  custom_price_3?: number | null;
  size_variants?: { name: string; price: number }[];
  allow_quantity?: boolean;
  disable_cod?: boolean;
  show_best_value_packs?: boolean;
  price_a5?: number | null;
  price_a4?: number | null;
  price_a3?: number | null;
  best_value_pack_1_buy?: number | null;
  best_value_pack_1_get?: number | null;
  best_value_pack_1_title?: string;
  best_value_pack_1_subtitle?: string;
  best_value_pack_2_buy?: number | null;
  best_value_pack_2_get?: number | null;
  best_value_pack_2_title?: string;
  best_value_pack_2_subtitle?: string;
  best_value_pack_3_buy?: number | null;
  best_value_pack_3_get?: number | null;
  best_value_pack_3_title?: string;
  best_value_pack_3_subtitle?: string;
  custom_photo?: string;
  selected_size?: string;
  created_at: string;
  updated_at: string;
}

export interface StoreSettings {
  delivery_charge_threshold: number;
  delivery_charge: number;
  cod_enabled: boolean;
  cod_fee?: number;
}


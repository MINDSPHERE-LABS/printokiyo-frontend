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
  size_variants?: { name: string; price: number }[];
  allow_quantity?: boolean;
  disable_cod?: boolean;
  show_best_value_packs?: boolean;
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


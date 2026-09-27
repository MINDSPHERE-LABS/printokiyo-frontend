import axios from 'axios';
import type { Product } from '../types';
import { getApiBase } from './config';

const api = axios.create({
  timeout: 30000,
});

api.interceptors.request.use(async (config) => {
  config.baseURL = await getApiBase();
  return config;
});


export interface FetchProductsParams {
  category?: string;
  tag?: string;
  featured?: boolean;
  new_arrival?: boolean;
  best_seller?: boolean;
  search?: string;
  limit?: number;
  skip?: number;
}

export const fetchProducts = async (params: FetchProductsParams = {}, retries = 2): Promise<Product[]> => {
  try {
    const response = await api.get<Product[]>('/products', { params });
    return response.data;
  } catch (error) {
    if (retries > 0) {
      await new Promise(r => setTimeout(r, 1000));
      return fetchProducts(params, retries - 1);
    }
    console.error("FastAPI backend connection failed.", error);
    throw error;
  }
};

export const fetchProductBySlug = async (slug: string): Promise<Product> => {
  try {
    const response = await api.get<Product>(`/products/slug/${slug}`);
    return response.data;
  } catch (error) {
    console.error(`FastAPI backend connection failed for slug: ${slug}`, error);
    throw error;
  }
};

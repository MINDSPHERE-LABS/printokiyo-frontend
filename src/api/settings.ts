import axios from 'axios';
import type { StoreSettings } from '../types';
import { getApiBase } from './config';

const api = axios.create({
  timeout: 30000,
});

api.interceptors.request.use(async (config) => {
  config.baseURL = await getApiBase();
  return config;
});


export const fetchStoreSettings = async (): Promise<StoreSettings> => {
  try {
    const response = await api.get<StoreSettings>('/settings');
    return response.data;
  } catch (error) {
    console.error("FastAPI backend connection failed for settings.", error);
    throw error;
  }
};


import { getApiBase } from './config';

async function API_BASE() {
  return await getApiBase();
}

export class APIError extends Error {
  status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.status = status;
    this.name = 'APIError';
  }
}

// Helper to configure authorization headers
function getHeaders(token: string | null) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export interface AuthResponse {
  token: string;
  user: UserProfile;
}

// Authentication Handlers
export async function registerUser(data: any): Promise<AuthResponse> {
  const apiBase = await API_BASE();
  const res = await fetch(`${apiBase}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || 'Registration failed');
  }
  return res.json();
}

export async function loginUser(data: any): Promise<AuthResponse> {
  const apiBase = await API_BASE();
  const res = await fetch(`${apiBase}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || 'Login failed');
  }
  return res.json();
}

export async function devLoginUser(phone: string): Promise<AuthResponse> {
  const apiBase = await API_BASE();
  const res = await fetch(`${apiBase}/auth/dev-login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone })
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || 'Development login failed');
  }
  return res.json();
}

export async function sendOTP(phone: string): Promise<{ success: boolean; message: string; phone: string }> {
  const apiBase = await API_BASE();
  const res = await fetch(`${apiBase}/auth/send-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone })
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || 'Failed to send WhatsApp OTP code');
  }
  return res.json();
}

export async function verifyOTP(phone: string, otp: string): Promise<AuthResponse> {
  const apiBase = await API_BASE();
  const res = await fetch(`${apiBase}/auth/verify-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone, otp })
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || 'OTP verification failed');
  }
  return res.json();
}

export async function getMe(token: string): Promise<UserProfile> {
  const apiBase = await API_BASE();
  const res = await fetch(`${apiBase}/auth/me`, {
    headers: getHeaders(token)
  });
  if (!res.ok) {
    throw new APIError('Session invalid', res.status);
  }
  const data = await res.json();
  if (data.authenticated && data.user) {
    return data.user;
  }
  return data;
}

export async function logoutUser(token: string): Promise<void> {
  const apiBase = await API_BASE();
  await fetch(`${apiBase}/auth/logout`, {
    method: 'POST',
    headers: getHeaders(token)
  });
}

export async function updateUserProfile(token: string, data: { name?: string; email?: string }): Promise<UserProfile> {
  const apiBase = await API_BASE();
  const res = await fetch(`${apiBase}/auth/me`, {
    method: 'PUT',
    headers: getHeaders(token),
    body: JSON.stringify(data)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Failed to update profile');
  }
  return res.json();
}

// Cart Handlers
export interface CartItem {
  product_id: string;
  quantity: number;
}

export async function fetchUserCart(token: string): Promise<CartItem[]> {
  const apiBase = await API_BASE();
  const res = await fetch(`${apiBase}/cart`, {
    headers: getHeaders(token)
  });
  if (!res.ok) throw new APIError('Failed to fetch user cart', res.status);
  return res.json();
}

export async function syncUserCart(token: string, items: CartItem[]): Promise<CartItem[]> {
  const apiBase = await API_BASE();
  const res = await fetch(`${apiBase}/cart`, {
    method: 'POST',
    headers: getHeaders(token),
    body: JSON.stringify(items)
  });
  if (!res.ok) throw new Error('Failed to sync user cart');
  return res.json();
}

export async function mergeGuestCart(token: string, guestItems: CartItem[]): Promise<CartItem[]> {
  const apiBase = await API_BASE();
  const res = await fetch(`${apiBase}/cart/merge`, {
    method: 'POST',
    headers: getHeaders(token),
    body: JSON.stringify({ items: guestItems })
  });
  if (!res.ok) throw new Error('Failed to merge guest cart');
  return res.json();
}

// Wishlist Handlers
export async function fetchUserWishlist(token: string): Promise<string[]> {
  const apiBase = await API_BASE();
  const res = await fetch(`${apiBase}/wishlist`, {
    headers: getHeaders(token)
  });
  if (!res.ok) throw new APIError('Failed to fetch user wishlist', res.status);
  return res.json();
}

export async function addToUserWishlist(token: string, productId: string): Promise<string[]> {
  const apiBase = await API_BASE();
  const res = await fetch(`${apiBase}/wishlist`, {
    method: 'POST',
    headers: getHeaders(token),
    body: JSON.stringify({ product_id: productId })
  });
  if (!res.ok) throw new Error('Failed to add item to wishlist');
  return res.json();
}

export async function removeFromUserWishlist(token: string, productId: string): Promise<string[]> {
  const apiBase = await API_BASE();
  const res = await fetch(`${apiBase}/wishlist/${productId}`, {
    method: 'DELETE',
    headers: getHeaders(token)
  });
  if (!res.ok) throw new Error('Failed to remove item from wishlist');
  return res.json();
}

// Checkout Validation
export async function validateCheckoutSession(token: string): Promise<boolean> {
  try {
    const apiBase = await API_BASE();
    const res = await fetch(`${apiBase}/checkout/validate`, {
      headers: getHeaders(token)
    });
    return res.ok;
  } catch {
    return false;
  }
}

// Order Handlers
export interface OrderPayload {
  order_id: string;
  name: string;
  email?: string;
  phone: string;
  address: string;
  payment_method: string;
  items: Array<{
    product_id?: string;
    sku?: string;
    SKU?: string;
    title: string;
    price: number;
    thumbnail?: string;
    custom_photo?: string;
    selected_size?: string;
  }>;
  grand_total: number;
  status?: string;
  payment_status?: string;
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  short_url?: string;
  payment_url?: string;
  failure_reason?: string;
}

export async function createOrder(token: string, orderData: OrderPayload): Promise<any> {
  const apiBase = await API_BASE();
  const res = await fetch(`${apiBase}/orders`, {
    method: 'POST',
    headers: getHeaders(token),
    body: JSON.stringify(orderData)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Failed to submit order');
  }
  return res.json();
}

export async function fetchUserOrders(token: string): Promise<any[]> {
  const apiBase = await API_BASE();
  const res = await fetch(`${apiBase}/orders`, {
    headers: getHeaders(token)
  });
  if (!res.ok) {
    throw new APIError('Failed to fetch user orders', res.status);
  }
  return res.json();
}


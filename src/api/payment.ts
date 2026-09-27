import { getApiBase } from './config';

async function API_BASE() {
  return await getApiBase();
}

function getHeaders(token: string | null) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

export interface RazorpayOrderResponse {
  success: boolean;
  mock?: boolean;
  razorpay_order_id: string;
  amount: number;
  currency: string;
  key_id: string;
  error?: string;
}

export async function createRazorpayOrder(token: string, amount: number, receipt?: string): Promise<RazorpayOrderResponse> {
  const apiBase = await API_BASE();
  const res = await fetch(`${apiBase}/payment/create-order`, {
    method: 'POST',
    headers: getHeaders(token),
    body: JSON.stringify({ amount, receipt })
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Failed to create Razorpay payment order');
  }

  return res.json();
}

export async function verifyRazorpayPayment(
  token: string,
  details: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }
): Promise<{ success: boolean; message: string }> {
  const apiBase = await API_BASE();
  const res = await fetch(`${apiBase}/payment/verify`, {
    method: 'POST',
    headers: getHeaders(token),
    body: JSON.stringify(details)
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Razorpay payment signature verification failed');
  }

  return res.json();
}

export async function fetchPaymentConfig(): Promise<{ key_id: string; is_configured: boolean }> {
  try {
    const apiBase = await API_BASE();
    const res = await fetch(`${apiBase}/payment/config`);
    if (!res.ok) throw new Error();
    return res.json();
  } catch {
    return { key_id: 'rzp_test_MWM12345', is_configured: false };
  }
}

export interface RazorpayLinkResponse {
  success: boolean;
  mock?: boolean;
  payment_link_id?: string;
  short_url: string;
  status?: string;
  error?: string;
}

export async function createRazorpayPaymentLink(
  token: string,
  details: {
    amount: number;
    receipt: string;
    name: string;
    email: string;
    phone: string;
    callback_url: string;
    address?: string;
    items?: any[];
  }
): Promise<RazorpayLinkResponse> {
  const apiBase = await API_BASE();
  const res = await fetch(`${apiBase}/payment/create-link`, {
    method: 'POST',
    headers: getHeaders(token),
    body: JSON.stringify(details)
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Failed to create Razorpay hosted payment link');
  }

  return res.json();
}

export async function verifyRazorpayPaymentLink(
  token: string,
  details: {
    razorpay_payment_id: string;
    razorpay_payment_link_id: string;
    razorpay_payment_link_reference_id: string;
    razorpay_payment_link_status: string;
    razorpay_signature: string;
  }
): Promise<{ success: boolean; message: string }> {
  const apiBase = await API_BASE();
  const res = await fetch(`${apiBase}/payment/verify-link`, {
    method: 'POST',
    headers: getHeaders(token),
    body: JSON.stringify(details)
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Razorpay payment link verification failed');
  }

  return res.json();
}


export function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window !== 'undefined' && window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}


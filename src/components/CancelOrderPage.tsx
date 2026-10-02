import React, { useState } from 'react';
import { 
  Home, ChevronRight, XCircle, Clock, AlertTriangle, 
  Mail, CheckCircle2, ArrowRight, Send, Package
} from 'lucide-react';

interface CancelOrderPageProps {
  onNavigateHome: () => void;
  onExploreProducts?: () => void;
  onNavigateOrders?: () => void;
}

export const CancelOrderPage: React.FC<CancelOrderPageProps> = ({
  onNavigateHome,
  onExploreProducts,
  onNavigateOrders
}) => {
  const [orderIdInput, setOrderIdInput] = useState('');
  const [reasonInput, setReasonInput] = useState('');

  const generateMailtoUrl = () => {
    const subject = encodeURIComponent(`Order Cancellation Request - ${orderIdInput.trim() || '[Order ID]'}`);
    const body = encodeURIComponent(
      `Hello PrintOkiyo Support,\n\nI would like to request a cancellation for my order.\n\nOrder ID: ${orderIdInput.trim() || 'N/A'}\nReason for Cancellation: ${reasonInput.trim() || 'N/A'}\n\nPlease confirm the cancellation status.\n\nThank you,\nPrintOkiyo Customer`
    );
    return `mailto:printokiyo@gmail.com?subject=${subject}&body=${body}`;
  };

  return (
    <div className="min-h-screen bg-[#fafafa] text-gray-900 select-none flex flex-col">
      {/* 1. Hero Banner with Dark Aesthetic Theme */}
      <section className="relative overflow-hidden bg-zinc-950 text-white py-14 sm:py-20 px-4 text-center">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-35 scale-105"
          style={{ backgroundImage: `url('/hero-banner.webp')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/80 to-zinc-950" />

        <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center">
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-300 mb-4">
            <button 
              onClick={onNavigateHome}
              className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer text-gray-300"
            >
              <Home size={14} className="text-[#e2b04c]" />
              <span>Home</span>
            </button>
            <ChevronRight size={14} className="text-gray-400" />
            <span className="text-white font-bold">Cancel Order</span>
          </nav>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-950/80 border border-rose-700/60 text-rose-300 text-[11px] font-bold uppercase tracking-wider mb-3">
            <XCircle size={14} />
            <span>Order Assistance</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-wider text-white mb-3">
            CANCEL ORDER
          </h1>
          <p className="text-xs sm:text-sm text-gray-300 max-w-lg leading-relaxed">
            Need to cancel a recent order? Review our cutoff timeline and send your request directly to our team.
          </p>
        </div>
      </section>

      {/* 2. Key Notice Strip */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <div className="flex items-center gap-2.5 text-xs sm:text-sm font-bold text-gray-800">
              <Clock size={18} className="text-amber-600 shrink-0" />
              <span>Cancellations must be requested within <strong>1 day of dispatch</strong>.</span>
            </div>
            <a 
              href="mailto:printokiyo@gmail.com"
              className="text-xs font-black text-[#041e42] hover:underline flex items-center gap-1.5"
            >
              <Mail size={14} />
              <span>printokiyo@gmail.com</span>
            </a>
          </div>
        </div>
      </div>

      {/* 3. Main Content Container */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <div className="flex flex-col gap-8 text-left">

          {/* Primary Cancellation Instructions Card */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200/90 shadow-xs">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-[#041e42] text-white flex items-center justify-center shrink-0 shadow-md">
                <Mail size={24} />
              </div>
              <div>
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-900 text-[10px] font-black uppercase tracking-wider mb-1">
                  Email Support
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-gray-950">
                  How to Request an Order Cancellation
                </h2>
                <p className="text-sm sm:text-base font-semibold text-gray-800 mt-2 leading-relaxed">
                  If you wish to cancel your order, you can contact us via email at{' '}
                  <a 
                    href="mailto:printokiyo@gmail.com" 
                    className="text-[#041e42] underline decoration-2 font-black hover:text-[#002f6c]"
                  >
                    printokiyo@gmail.com
                  </a>
                  . Please include your <strong className="text-black font-black">Order ID</strong> in the message.
                </p>
              </div>
            </div>

            {/* Quick Email Launcher Helper */}
            <div className="mt-6 p-5 sm:p-6 bg-gray-50 rounded-2xl border border-gray-200">
              <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-gray-900 mb-3 flex items-center gap-2">
                <Send size={15} className="text-[#041e42]" />
                <span>Quick Email Composer</span>
              </h3>
              <p className="text-xs text-gray-600 mb-4">
                Enter your Order ID below to pre-populate an official cancellation request to send to <strong>printokiyo@gmail.com</strong>:
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <input 
                  type="text"
                  placeholder="Enter Order ID (e.g. MWM-104928)"
                  value={orderIdInput}
                  onChange={(e) => setOrderIdInput(e.target.value)}
                  className="flex-1 bg-white border border-gray-300 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#041e42]"
                />
                <input 
                  type="text"
                  placeholder="Reason (optional)"
                  value={reasonInput}
                  onChange={(e) => setReasonInput(e.target.value)}
                  className="flex-1 bg-white border border-gray-300 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#041e42]"
                />
                <a
                  href={generateMailtoUrl()}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#041e42] hover:bg-[#002f6c] text-white font-bold text-xs sm:text-sm transition-all cursor-pointer shadow-xs whitespace-nowrap"
                >
                  <Mail size={16} />
                  <span>Send Email</span>
                </a>
              </div>
            </div>
          </div>

          {/* Important Policy Cutoff Card */}
          <div className="bg-amber-50/70 border border-amber-300/80 rounded-2xl p-6 sm:p-8 shadow-xs">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-md">
                <AlertTriangle size={24} />
              </div>
              <div className="space-y-3">
                <div className="inline-block px-2.5 py-0.5 rounded-full bg-amber-200 text-amber-950 text-[10px] font-black uppercase tracking-wider">
                  Important Notice
                </div>
                <h2 className="text-lg sm:text-xl font-black text-amber-950">
                  Cancellation Window & Dispatch Policy
                </h2>
                <div className="bg-white p-4 rounded-xl border border-amber-200/90 text-sm font-bold text-amber-950 leading-relaxed shadow-2xs">
                  Cancellations must be requested within 1 days of dispatch. After this period, the order cannot be canceled and must be accepted upon delivery.
                </div>
                <p className="text-xs sm:text-sm text-amber-900/90 leading-relaxed font-medium">
                  Once an order is handed over to our courier logistics partners (Delhivery, Bluedart, etc.) and in transit, physical rerouting is restricted. If your parcel has already passed the 1-day dispatch cutoff, please receive the package at your address.
                </p>
              </div>
            </div>
          </div>

          {/* Checklist of Details Card */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200/90 shadow-xs">
            <h3 className="text-sm sm:text-base font-black uppercase tracking-wider text-gray-900 mb-4 flex items-center gap-2">
              <CheckCircle2 size={18} className="text-emerald-600" />
              <span>Details to Include in Your Message</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm font-semibold text-gray-800">
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-gray-50 border border-gray-150">
                <span className="w-6 h-6 rounded-full bg-[#041e42] text-white flex items-center justify-center text-[10px] font-black shrink-0">1</span>
                <span>Your Order ID (e.g. MWM-123456)</span>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-gray-50 border border-gray-150">
                <span className="w-6 h-6 rounded-full bg-[#041e42] text-white flex items-center justify-center text-[10px] font-black shrink-0">2</span>
                <span>Full Name registered at checkout</span>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-gray-50 border border-gray-150">
                <span className="w-6 h-6 rounded-full bg-[#041e42] text-white flex items-center justify-center text-[10px] font-black shrink-0">3</span>
                <span>Email address & phone number</span>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-gray-50 border border-gray-150">
                <span className="w-6 h-6 rounded-full bg-[#041e42] text-white flex items-center justify-center text-[10px] font-black shrink-0">4</span>
                <span>Brief reason for cancellation</span>
              </div>
            </div>

            {/* Refund Settlement Terms */}
            <div className="mt-6 pt-5 border-t border-gray-150 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-gray-600">
              <div>
                <strong className="text-gray-900 block font-bold">Prepaid Orders Refund:</strong>
                <span>Initiated immediately upon approval, credited back to original source in 5–7 business days.</span>
              </div>
              <div>
                <strong className="text-gray-900 block font-bold">Cash on Delivery:</strong>
                <span>Cancelled with 0 fees if requested before the cutoff window.</span>
              </div>
            </div>
          </div>

          {/* Signoff & CTA Block */}
          <div className="bg-[#041e42] text-white rounded-2xl p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
            <div className="text-center md:text-left">
              <span className="text-[#e2b04c] text-xs font-black uppercase tracking-wider block mb-1">
                Customer Support
              </span>
              <h3 className="text-xl sm:text-2xl font-black uppercase tracking-wider mb-2">
                Thank you, printokiyo
              </h3>
              <p className="text-xs sm:text-sm text-gray-300 max-w-md">
                We appreciate your trust in our fine art studio and aim to provide seamless service at every step.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
              <a
                href="mailto:printokiyo@gmail.com"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white text-[#041e42] font-black text-xs hover:bg-[#e2b04c] hover:text-black transition-all cursor-pointer shadow-xs"
              >
                <Mail size={16} />
                <span>Email: printokiyo@gmail.com</span>
              </a>

              {onNavigateOrders && (
                <button
                  type="button"
                  onClick={onNavigateOrders}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-all cursor-pointer"
                >
                  <Package size={14} />
                  <span>View My Orders</span>
                </button>
              )}

              {onExploreProducts && (
                <button
                  type="button"
                  onClick={onExploreProducts}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-all cursor-pointer"
                >
                  <span>Continue Shopping</span>
                  <ArrowRight size={14} />
                </button>
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

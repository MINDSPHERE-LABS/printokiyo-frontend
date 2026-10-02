import React from 'react';
import { 
  Home, ChevronRight, Truck, Package, Clock, ShieldCheck, 
  AlertTriangle, Mail, ArrowRight, CheckCircle2, Gift, MapPin, 
  CreditCard, Banknote
} from 'lucide-react';

interface ShippingPolicyPageProps {
  onNavigateHome: () => void;
  onExploreProducts?: () => void;
}

export const ShippingPolicyPage: React.FC<ShippingPolicyPageProps> = ({ 
  onNavigateHome,
  onExploreProducts 
}) => {
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
            <span className="text-white font-bold">Shipping Policy</span>
          </nav>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#041e42]/80 border border-[#002f6c] text-[#e2b04c] text-[11px] font-bold uppercase tracking-wider mb-3">
            <Truck size={14} />
            <span>Pan-India Safe Delivery</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-wider text-white mb-3">
            SHIPPING POLICY
          </h1>
          <p className="text-xs sm:text-sm text-gray-300 max-w-xl leading-relaxed">
            Fast, secure, and damage-proof transit for all your posters, frames, and custom art collections across India.
          </p>
        </div>
      </section>

      {/* 2. Key Highlights Ribbon */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 divide-y sm:divide-y-0 sm:divide-x divide-gray-150 text-center sm:text-left">
            <div className="flex items-center gap-3 justify-center sm:justify-start px-2">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <Gift size={20} />
              </div>
              <div className="text-left">
                <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider block">Threshold</span>
                <span className="text-xs sm:text-sm font-black text-gray-900">Free Ship Above ₹299</span>
              </div>
            </div>

            <div className="flex items-center gap-3 justify-center sm:justify-start px-2 pt-3 sm:pt-0">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <CreditCard size={20} />
              </div>
              <div className="text-left">
                <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider block">Prepaid Bonus</span>
                <span className="text-xs sm:text-sm font-black text-gray-900">Extra 5% Off</span>
              </div>
            </div>

            <div className="flex items-center gap-3 justify-center sm:justify-start px-2 pt-3 sm:pt-0">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Clock size={20} />
              </div>
              <div className="text-left">
                <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider block">Dispatch Time</span>
                <span className="text-xs sm:text-sm font-black text-gray-900">2–4 Business Days</span>
              </div>
            </div>

            <div className="flex items-center gap-3 justify-center sm:justify-start px-2 pt-3 sm:pt-0">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                <MapPin size={20} />
              </div>
              <div className="text-left">
                <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider block">Delivery Window</span>
                <span className="text-xs sm:text-sm font-black text-gray-900">3–20 Business Days</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Main Policy Details */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <div className="flex flex-col gap-8 text-left">
          
          {/* Card 1: 🛍️ Free Shipping */}
          <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-300/80 rounded-2xl p-6 sm:p-8 bg-white shadow-xs">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-md">
                <Gift size={24} />
              </div>
              <div>
                <div className="inline-block px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-black uppercase tracking-wider mb-1.5">
                  Top Offer
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-gray-950 flex items-center gap-2">
                  <span>🛍️ Free Shipping</span>
                </h2>
                <p className="text-sm sm:text-base font-semibold text-gray-800 mt-2 leading-relaxed">
                  Enjoy <strong className="text-black font-black">free shipping</strong> on all prepaid and COD orders above <span className="text-[#041e42] font-black">₹299</span>.
                </p>
                <p className="text-xs sm:text-sm text-gray-600 mt-1 leading-relaxed">
                  Simply add your favorite posters, fine art prints, frames, or collage kits to your shopping cart. Once your cart subtotal reaches ₹299 or more, shipping charges are automatically waived at checkout.
                </p>
              </div>
            </div>
          </div>

          {/* Card 2: 🚚 Shipping Charges */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200/90 shadow-xs">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[#041e42] text-white flex items-center justify-center shrink-0">
                <Truck size={20} />
              </div>
              <h2 className="text-lg sm:text-xl font-black uppercase tracking-wider text-gray-900">
                🚚 Shipping Charges & Payment Modes
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Prepaid Orders */}
              <div className="border border-emerald-200 bg-emerald-50/40 rounded-xl p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-black uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                      <CreditCard size={15} />
                      <span>Prepaid Orders</span>
                    </span>
                    <span className="bg-emerald-600 text-white text-[9.5px] font-black px-2 py-0.5 rounded-full uppercase">
                      Recommended
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-gray-900 mb-2">
                    Free shipping on orders over ₹299
                  </h3>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-100/90 text-emerald-950 text-xs font-bold mb-3">
                    <span>✨ Extra 5% off on prepaid orders</span>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Pay securely using UPI (Google Pay, PhonePe, Paytm), Credit Cards, Debit Cards, or Netbanking. You get an instant extra 5% discount + zero shipping fees when ordering ₹299 or more.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-emerald-200/80 text-[11px] font-semibold text-emerald-900">
                  ⚡ Fast-tracked printing & dispatch priority
                </div>
              </div>

              {/* Cash on Delivery Orders */}
              <div className="border border-gray-200 bg-gray-50/70 rounded-xl p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-black uppercase tracking-wider text-gray-800 flex items-center gap-1.5">
                      <Banknote size={15} />
                      <span>Cash on Delivery (COD)</span>
                    </span>
                    <span className="bg-gray-200 text-gray-800 text-[9.5px] font-bold px-2 py-0.5 rounded-full uppercase">
                      Pay at Doorstep
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-gray-900 mb-2">
                    A nominal ₹80 fee applies to all COD orders
                  </h3>
                  <p className="text-xs text-gray-600 leading-relaxed mb-3">
                    Prefer to pay cash when your parcel arrives? We happily accept COD nationwide. A flat nominal fee of <strong>₹80</strong> is charged by logistics carriers for cash handling and physical courier collection.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-gray-200 text-[11px] font-semibold text-gray-600">
                  💡 Tip: Switch to Prepaid at checkout to save ₹80 COD fee + get 5% OFF!
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: 🔄 Order Processing Time */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200/90 shadow-xs">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
                <Clock size={20} />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-black uppercase tracking-wider text-gray-900">
                  🔄 Order Processing Time
                </h2>
                <span className="text-xs text-gray-500 font-medium">Crafted & inspected before leaving our print studio</span>
              </div>
            </div>

            <div className="bg-blue-50/60 border border-blue-200/80 rounded-xl p-4 sm:p-5 mb-4">
              <p className="text-sm sm:text-base font-bold text-blue-950">
                We typically process orders within <strong>2–4 business days</strong>.
              </p>
              <p className="text-xs sm:text-sm text-blue-900/90 mt-1 font-medium">
                Please note: Orders placed on weekends or public holidays may require additional time.
              </p>
            </div>

            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              Every print at PrintOkiyo is produced on-demand using professional 12-color archival pigment inks on 300 GSM fine art paper. Framed wall art is individually assembled with protective acrylic glass and inspected by hand before dispatch to ensure gallery-grade excellence.
            </p>
          </div>

          {/* Card 4: 📦 Estimated Delivery Time */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200/90 shadow-xs">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
                <Package size={20} />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-black uppercase tracking-wider text-gray-900">
                  📦 Estimated Delivery Time
                </h2>
                <span className="text-xs text-gray-500 font-medium">Delivered across 27,000+ pin codes in India</span>
              </div>
            </div>

            <p className="text-sm sm:text-base font-bold text-gray-900 mb-4 leading-relaxed">
              We aim to deliver your order within <strong className="text-black font-black">3–20 business days</strong>, depending on your location and service availability.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2">
              <div className="border border-gray-150 rounded-xl p-4 bg-gray-50/50">
                <span className="text-[10px] font-black uppercase tracking-wider text-gray-500 block mb-1">
                  Tier 1 & Metros
                </span>
                <span className="text-base font-black text-gray-900 block">3–6 Days</span>
                <span className="text-[11px] text-gray-500 mt-1 block">Delhi NCR, Mumbai, Bengaluru, Hyderabad, Chennai, Kolkata, Pune</span>
              </div>

              <div className="border border-gray-150 rounded-xl p-4 bg-gray-50/50">
                <span className="text-[10px] font-black uppercase tracking-wider text-gray-500 block mb-1">
                  Tier 2 & 3 Cities
                </span>
                <span className="text-base font-black text-gray-900 block">5–12 Days</span>
                <span className="text-[11px] text-gray-500 mt-1 block">State capitals, major commercial districts, and regional postal hubs</span>
              </div>

              <div className="border border-gray-150 rounded-xl p-4 bg-gray-50/50">
                <span className="text-[10px] font-black uppercase tracking-wider text-gray-500 block mb-1">
                  Remote & Extended Areas
                </span>
                <span className="text-base font-black text-gray-900 block">10–20 Days</span>
                <span className="text-[11px] text-gray-500 mt-1 block">Hill stations, remote rural areas, North East & Island regions</span>
              </div>
            </div>
          </div>

          {/* Card 5: ⚠️ Delays & Tracking */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200/90 shadow-xs">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                <AlertTriangle size={20} />
              </div>
              <h2 className="text-lg sm:text-xl font-black uppercase tracking-wider text-gray-900">
                ⚠️ Delays & Tracking
              </h2>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-gray-700 leading-relaxed">
              <p>
                Delivery times may be affected by factors such as weather, strikes, remote locations, or stocking delays.
              </p>
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-emerald-950 font-medium flex items-start gap-3">
                <CheckCircle2 size={18} className="text-emerald-600 shrink-0 mt-0.5" />
                <p>
                  <strong>Don’t worry</strong> — once your package is shipped, you’ll receive a tracking link via <strong>email/SMS</strong> (as well as WhatsApp updates) to follow your order in real time.
                </p>
              </div>
              <p className="text-gray-600">
                You can click the tracking link at any time to see the live courier status, transit checkpoints, and expected delivery date with our verified delivery partners (Delhivery, Bluedart, Xpressbees, Shadowfax, or India Post).
              </p>
            </div>
          </div>

          {/* Card 6: Transit Safety & Damage Replacement Guarantee */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200/90 shadow-xs">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0">
                <ShieldCheck size={20} />
              </div>
              <h2 className="text-lg sm:text-xl font-black uppercase tracking-wider text-gray-900">
                100% Transit Protection Guarantee
              </h2>
            </div>

            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-4">
              We package every order with extreme care:
            </p>

            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-gray-800 font-semibold mb-5">
              <li className="flex items-center gap-2 bg-gray-50 p-3 rounded-xl border border-gray-150">
                <span className="text-indigo-600 font-bold">✔</span>
                <span>Unframed prints rolled in heavy-duty crush-proof cylindrical tubes</span>
              </li>
              <li className="flex items-center gap-2 bg-gray-50 p-3 rounded-xl border border-gray-150">
                <span className="text-indigo-600 font-bold">✔</span>
                <span>Framed art secured with reinforced corner guards & multilayer bubble wrap</span>
              </li>
              <li className="flex items-center gap-2 bg-gray-50 p-3 rounded-xl border border-gray-150">
                <span className="text-indigo-600 font-bold">✔</span>
                <span>Waterproof outer wrapping to withstand moisture and rain during transit</span>
              </li>
              <li className="flex items-center gap-2 bg-gray-50 p-3 rounded-xl border border-gray-150">
                <span className="text-indigo-600 font-bold">✔</span>
                <span>Free replacement issued immediately if package arrives damaged</span>
              </li>
            </ul>

            <p className="text-[11px] text-gray-500 leading-relaxed">
              If your parcel sustains transit damage, simply email us an unboxing photo or video within 48 hours of delivery at <a href="mailto:support@printokiyo.com" className="text-[#041e42] underline font-bold">support@printokiyo.com</a> and we will dispatch a brand-new replacement at zero cost.
            </p>
          </div>

          {/* Card 7: Bottom CTA & Support Assistance */}
          <div className="bg-[#041e42] text-white rounded-2xl p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
            <div className="text-center md:text-left">
              <h3 className="text-xl sm:text-2xl font-black uppercase tracking-wider mb-2">
                Have questions about your shipment?
              </h3>
              <p className="text-xs sm:text-sm text-gray-300 max-w-md">
                Our support team is available Monday through Saturday (10:00 AM – 7:00 PM IST) to assist with order tracking and courier updates.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
              <a
                href="mailto:support@printokiyo.com"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white text-[#041e42] font-black text-xs hover:bg-[#e2b04c] hover:text-black transition-all cursor-pointer shadow-xs"
              >
                <Mail size={15} />
                <span>Contact Support</span>
              </a>

              {onExploreProducts && (
                <button
                  type="button"
                  onClick={onExploreProducts}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-all cursor-pointer"
                >
                  <span>Explore Posters</span>
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

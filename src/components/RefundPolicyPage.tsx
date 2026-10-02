import React from 'react';
import { 
  Home, ChevronRight, ShieldCheck, RefreshCw, AlertTriangle, 
  CheckCircle2, MessageCircle, Mail, ArrowRight, Ban, 
  CreditCard, PackageX
} from 'lucide-react';

interface RefundPolicyPageProps {
  onNavigateHome: () => void;
  onExploreProducts?: () => void;
}

export const RefundPolicyPage: React.FC<RefundPolicyPageProps> = ({
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
            <span className="text-white font-bold">Refund Policy</span>
          </nav>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-700/60 text-emerald-300 text-[11px] font-bold uppercase tracking-wider mb-3">
            <ShieldCheck size={14} />
            <span>1-Day Free Replacement Guarantee</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-wider text-white mb-3">
            REFUND & CANCELLATION POLICY
          </h1>
          <p className="text-xs sm:text-sm text-gray-300 max-w-xl leading-relaxed">
            Transparent and prompt support for transit damage, defects, and replacements on all your custom posters & frames.
          </p>
        </div>
      </section>

      {/* 2. Key Highlights Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 divide-y sm:divide-y-0 sm:divide-x divide-gray-150 text-center sm:text-left">
            <div className="flex items-center gap-3 justify-center sm:justify-start px-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <ShieldCheck size={20} />
              </div>
              <div className="text-left">
                <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider block">Warranty</span>
                <span className="text-xs sm:text-sm font-black text-gray-900">1-Day Replacement</span>
              </div>
            </div>

            <div className="flex items-center gap-3 justify-center sm:justify-start px-2 pt-3 sm:pt-0">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <RefreshCw size={20} />
              </div>
              <div className="text-left">
                <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider block">Coverage</span>
                <span className="text-xs sm:text-sm font-black text-gray-900">Damage / Defect / Misprint</span>
              </div>
            </div>

            <div className="flex items-center gap-3 justify-center sm:justify-start px-2 pt-3 sm:pt-0">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <MessageCircle size={20} />
              </div>
              <div className="text-left">
                <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider block">Quick Help</span>
                <span className="text-xs sm:text-sm font-black text-gray-900">WhatsApp Support</span>
              </div>
            </div>

            <div className="flex items-center gap-3 justify-center sm:justify-start px-2 pt-3 sm:pt-0">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                <CreditCard size={20} />
              </div>
              <div className="text-left">
                <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider block">Approved Refunds</span>
                <span className="text-xs sm:text-sm font-black text-gray-900">Up to 7 Business Days</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Main Policy Details */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <div className="flex flex-col gap-8 text-left">

          {/* Section 1: 🛡️ 1-Day Replacement Warranty & Eligibility */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200/90 shadow-xs">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-md">
                <ShieldCheck size={26} />
              </div>
              <div>
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[10px] font-black uppercase tracking-wider mb-1">
                  Free Warranty
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-gray-950">
                  🛡️ 1-Day Replacement Warranty
                </h2>
                <p className="text-sm sm:text-base font-semibold text-gray-800 mt-1 leading-relaxed">
                  We offer a <strong className="text-black font-black">FREE replacement warranty for 1 day</strong> from the date of delivery on all products.
                </p>
              </div>
            </div>

            {/* Replacement Eligibility Criteria */}
            <div className="border-t border-gray-150 pt-5">
              <h3 className="text-sm sm:text-base font-black uppercase tracking-wider text-gray-900 mb-3 flex items-center gap-2">
                <span>🔁 Replacement Eligibility</span>
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 mb-4">
                You are eligible for a replacement if your product arrives in any of the following conditions:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div className="border border-red-200 bg-red-50/50 rounded-xl p-4 flex flex-col gap-1.5">
                  <div className="w-8 h-8 rounded-lg bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                    <PackageX size={18} />
                  </div>
                  <h4 className="text-sm font-black text-red-950">Damaged</h4>
                  <p className="text-xs text-red-800/80 leading-relaxed">
                    Broken frame, cracked acrylic glass, crumpled or creased posters from courier transit.
                  </p>
                </div>

                <div className="border border-amber-200 bg-amber-50/50 rounded-xl p-4 flex flex-col gap-1.5">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                    <AlertTriangle size={18} />
                  </div>
                  <h4 className="text-sm font-black text-amber-950">Defective</h4>
                  <p className="text-xs text-amber-800/80 leading-relaxed">
                    Structural joint issues, loose backing pins, peeling matte lamination or frame hardware defects.
                  </p>
                </div>

                <div className="border border-blue-200 bg-blue-50/50 rounded-xl p-4 flex flex-col gap-1.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                    <RefreshCw size={18} />
                  </div>
                  <h4 className="text-sm font-black text-blue-950">Misprinted</h4>
                  <p className="text-xs text-blue-800/80 leading-relaxed">
                    Severe ink banding, distorted aspect ratio, or completely incorrect artwork printed and shipped.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: 📩 How to Request a Replacement */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200/90 shadow-xs">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-[#041e42] text-white flex items-center justify-center shrink-0">
                <MessageCircle size={20} />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-black uppercase tracking-wider text-gray-900">
                  📩 How to Request a Replacement
                </h2>
                <span className="text-xs text-gray-500 font-medium">Simple 2-step verification process</span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-gray-700 leading-relaxed mb-4">
              If your item meets the above criteria, please reach out to us immediately via:
            </p>

            {/* Contact Channels */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <a 
                href="https://wa.me/917678647069?text=Hi%20PrintOkiyo,%20I%20would%20like%20to%20request%20a%20replacement%20for%20my%20order."
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 p-4 rounded-xl border border-emerald-200 bg-emerald-50/60 hover:bg-emerald-100/70 transition-all cursor-pointer"
              >
                <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <MessageCircle size={20} />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 block">
                    Fastest Response (Recommended)
                  </span>
                  <span className="text-sm font-black text-gray-900 group-hover:text-emerald-950">
                    WhatsApp: +91-7678647069
                  </span>
                </div>
              </a>

              <a 
                href="mailto:framekro@gmail.com?subject=Replacement%20Request%20-%20PrintOkiyo"
                className="group flex items-center gap-3 p-4 rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 transition-all cursor-pointer"
              >
                <div className="w-10 h-10 rounded-full bg-[#041e42] text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Mail size={18} />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-gray-500 block">
                    Email Support
                  </span>
                  <span className="text-sm font-black text-gray-900 group-hover:text-[#041e42]">
                    framekro@gmail.com
                  </span>
                </div>
              </a>
            </div>

            {/* Required details checklist */}
            <div className="bg-gray-50 rounded-xl p-5 border border-gray-150 mb-5">
              <h4 className="text-xs sm:text-sm font-black text-gray-900 uppercase tracking-wider mb-3">
                Include the following details in your message:
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm text-gray-700">
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                  <span>Your full name</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                  <span>Email address</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                  <span>Order ID (e.g. MWM-123456 or #1042)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                  <span>Clear image(s) or video of the damaged, defective, or misprinted product</span>
                </li>
              </ul>
            </div>

            {/* Important claim callout */}
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-950 text-xs sm:text-sm font-semibold flex items-start gap-2.5">
              <AlertTriangle size={18} className="text-amber-600 shrink-0 mt-0.5" />
              <p>
                <strong>Important:</strong> If your claim is approved, we will send a replacement of the same product you ordered. Refunds will not be issued in these cases.
              </p>
            </div>
          </div>

          {/* Section 3: ⚠️ Please Note & Policy Limitations */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200/90 shadow-xs">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center shrink-0">
                <AlertTriangle size={20} />
              </div>
              <h2 className="text-lg sm:text-xl font-black uppercase tracking-wider text-gray-900">
                ⚠️ Please Note
              </h2>
            </div>

            <ul className="space-y-3 text-xs sm:text-sm text-gray-700 leading-relaxed">
              <li className="flex items-start gap-2.5 bg-gray-50/80 p-3 rounded-xl border border-gray-150">
                <span className="text-rose-600 font-bold">✖</span>
                <span>This policy does not cover misuse, accidental damage, water damage, or any form of abuse of the product after delivery.</span>
              </li>
              <li className="flex items-start gap-2.5 bg-gray-50/80 p-3 rounded-xl border border-gray-150">
                <span className="text-rose-600 font-bold">✖</span>
                <span>Requests made after <strong>1 day</strong> from delivery will not be eligible for a refund or replacement.</span>
              </li>
              <li className="flex items-start gap-2.5 bg-gray-50/80 p-3 rounded-xl border border-gray-150">
                <span className="text-blue-600 font-bold">✔</span>
                <span>If the item is eligible for replacement due to damage, we will provide a <strong>replacement only</strong>.</span>
              </li>
            </ul>
          </div>

          {/* Section 4: REFUND & CANCELLATION POLICY */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200/90 shadow-xs">
            <h2 className="text-lg sm:text-xl font-black uppercase tracking-wider text-gray-900 mb-6 flex items-center gap-2">
              <span>REFUND & CANCELLATION POLICY</span>
            </h2>

            <div className="space-y-6">
              {/* 🔄 Refunds */}
              <div className="border-b border-gray-150 pb-6">
                <h3 className="text-base font-bold text-gray-900 flex items-center gap-2 mb-2">
                  <span>🔄 Refunds</span>
                </h3>
                <p className="text-xs sm:text-sm text-gray-700 leading-relaxed mb-3">
                  Our refund policy is valid for <strong>2 days</strong> after you receive your purchase. If more than 2 days have passed, unfortunately, we can’t offer a refund or replacement.
                </p>
                <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-950 text-xs sm:text-sm font-semibold">
                  ✨ <strong>Repeat Incident Protection:</strong> If your product arrives damaged, you are eligible for a replacement — and if it happens again, you will be eligible for <strong>both refund and replacement</strong>.
                </div>
              </div>

              {/* 🔁 Exchanges & Returns */}
              <div className="border-b border-gray-150 pb-6">
                <h3 className="text-base font-bold text-gray-900 flex items-center gap-2 mb-2">
                  <span>🔁 Exchanges & Returns</span>
                </h3>
                <p className="text-xs sm:text-sm text-gray-700 leading-relaxed mb-2">
                  We only replace items if they are defective or damaged. We do not accept returns or exchanges for design preferences.
                </p>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  To be eligible for a product exchange, the issue must be reported within <strong>2 days of delivery</strong>.
                </p>
              </div>

              {/* 💳 Refunds (If Applicable) */}
              <div>
                <h3 className="text-base font-bold text-gray-900 flex items-center gap-2 mb-2">
                  <span>💳 Refunds (If Applicable)</span>
                </h3>
                <p className="text-xs sm:text-sm text-gray-700 leading-relaxed mb-3">
                  Once approved, your refund will be automatically processed to your original payment method.
                </p>
                <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-purple-50 border border-purple-200 text-purple-950 text-xs font-semibold">
                  <CreditCard size={16} className="text-purple-600" />
                  <span>Please allow up to <strong>7 business days</strong> for the refund to appear, depending on your bank or card provider.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 5: 🚫 Invalid Reasons for Refund or Cancellation */}
          <div className="bg-rose-50/50 border border-rose-200 rounded-2xl p-6 sm:p-8 shadow-xs">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0">
                <Ban size={20} />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-black uppercase tracking-wider text-rose-950">
                  🚫 Invalid Reasons for Refund or Cancellation
                </h2>
                <span className="text-xs text-rose-700 font-medium">Non-qualifying claims</span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-gray-700 leading-relaxed mb-5">
              We understand that circumstances may change, but the following reasons are not considered valid for refund or cancellation:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Invalid Reason 1 */}
              <div className="bg-white rounded-xl p-5 border border-rose-150">
                <span className="text-[10px] font-black uppercase tracking-wider text-rose-700 block mb-1">
                  Reason 1
                </span>
                <h3 className="text-sm font-black text-gray-950 mb-1">
                  Change of Mind
                </h3>
                <blockquote className="italic text-xs font-semibold text-gray-500 mb-2 border-l-2 border-rose-300 pl-2">
                  &ldquo;I no longer want the items.&rdquo;
                </blockquote>
                <p className="text-xs text-gray-600 leading-relaxed">
                  This is the most common reason we receive, but unfortunately, we cannot accept it. Please ensure you are certain about your purchase before placing the order. Once submitted, your order becomes part of a legally binding agreement and immediately moves into our customized printing pipeline.
                </p>
              </div>

              {/* Invalid Reason 2 */}
              <div className="bg-white rounded-xl p-5 border border-rose-150">
                <span className="text-[10px] font-black uppercase tracking-wider text-rose-700 block mb-1">
                  Reason 2
                </span>
                <h3 className="text-sm font-black text-gray-950 mb-1">
                  Found a Lower Price Elsewhere
                </h3>
                <blockquote className="italic text-xs font-semibold text-gray-500 mb-2 border-l-2 border-rose-300 pl-2">
                  &ldquo;I saw the product cheaper somewhere else.&rdquo;
                </blockquote>
                <p className="text-xs text-gray-600 leading-relaxed">
                  We encourage all customers to compare and make informed decisions prior to placing an order. After confirmation, the price agreed upon at checkout is final and binding.
                </p>
              </div>
            </div>
          </div>

          {/* Section 6: Need Help & Fast Action CTA */}
          <div className="bg-[#041e42] text-white rounded-2xl p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
            <div className="text-center md:text-left">
              <h3 className="text-xl sm:text-2xl font-black uppercase tracking-wider mb-2">
                Need to submit a replacement claim?
              </h3>
              <p className="text-xs sm:text-sm text-gray-300 max-w-md">
                Our support team is ready to help resolve damaged or defective items swiftly over WhatsApp or email.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
              <a
                href="https://wa.me/917678647069?text=Hi%20PrintOkiyo,%20I%20have%20an%20issue%20with%20my%20order."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs transition-all cursor-pointer shadow-xs"
              >
                <MessageCircle size={16} />
                <span>WhatsApp (+91-7678647069)</span>
              </a>

              {onExploreProducts && (
                <button
                  type="button"
                  onClick={onExploreProducts}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-all cursor-pointer"
                >
                  <span>Explore Products</span>
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

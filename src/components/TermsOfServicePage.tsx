import React, { useState } from 'react';
import { 
  Home, ChevronRight, ShieldCheck, FileText, AlertCircle, 
  HelpCircle, CheckCircle2, ArrowRight 
} from 'lucide-react';

interface TermsOfServicePageProps {
  onNavigateHome: () => void;
}

export const TermsOfServicePage: React.FC<TermsOfServicePageProps> = ({ onNavigateHome }) => {
  const [activeSection, setActiveSection] = useState<string>('agreement');

  const sections = [
    { id: 'agreement', title: '1. Agreement to Terms' },
    { id: 'eligibility', title: '2. Eligibility & Account Security' },
    { id: 'products', title: '3. Products, Specifications & Accuracy' },
    { id: 'custom-uploads', title: '4. Custom Photos & User Content' },
    { id: 'pricing-payment', title: '5. Pricing, Orders & Payments' },
    { id: 'shipping-delivery', title: '6. Shipping, Delivery & Tracking' },
    { id: 'cancellation-returns', title: '7. Damage, Replacements & Refunds' },
    { id: 'intellectual-property', title: '8. Intellectual Property & Fan Art' },
    { id: 'prohibited-conduct', title: '9. Prohibited Conduct' },
    { id: 'liability-warranty', title: '10. Limitation of Liability' },
    { id: 'governing-law', title: '11. Governing Law & Dispute Resolution' },
    { id: 'grievance', title: '12. Grievance Officer & Contact' }
  ];

  const scrollTo = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 select-none flex flex-col">
      {/* 1. Hero Banner with Dark Aesthetic Theme */}
      <section className="relative overflow-hidden bg-zinc-950 text-white py-14 sm:py-20 px-4 text-center">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-35 scale-105"
          style={{ backgroundImage: `url('/hero-banner.webp')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/80 to-zinc-950" />

        <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-300 mb-4">
            <button 
              onClick={onNavigateHome}
              className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer text-gray-300"
            >
              <Home size={14} className="text-[#e2b04c]" />
              <span>Home</span>
            </button>
            <ChevronRight size={14} className="text-gray-400" />
            <span className="text-white font-bold">Terms of Service</span>
          </nav>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-wider text-white mb-3">
            TERMS OF SERVICE
          </h1>
          <p className="text-xs sm:text-sm text-gray-300 max-w-lg leading-relaxed">
            Effective Date: <strong className="text-white font-semibold">January 1, 2026</strong> &bull; Governed under the Information Technology Act, 2000 & Consumer Protection (E-Commerce) Rules, 2020.
          </p>
        </div>
      </section>

      {/* 2. Main Content Layout */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 text-left">
          
          {/* Table of Contents Sticky Sidebar (Desktop) */}
          <aside className="hidden lg:block lg:col-span-4 xl:col-span-3">
            <div className="sticky top-24 bg-gray-50/90 rounded-2xl p-5 border border-gray-200/80 shadow-xs">
              <div className="flex items-center gap-2 pb-3 mb-3 border-b border-gray-200">
                <FileText size={16} className="text-[#041e42]" />
                <h3 className="text-xs font-black uppercase tracking-wider text-gray-900">
                  Table of Contents
                </h3>
              </div>
              <nav className="flex flex-col space-y-1">
                {sections.map((sec) => (
                  <button
                    key={sec.id}
                    onClick={() => scrollTo(sec.id)}
                    className={`text-left px-3 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      activeSection === sec.id
                        ? 'bg-[#041e42] text-white shadow-xs font-bold'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    {sec.title}
                  </button>
                ))}
              </nav>

              <div className="mt-6 pt-4 border-t border-gray-200 flex flex-col gap-2">
                <span className="text-[11px] font-semibold text-gray-500">Need legal assistance?</span>
                <a 
                  href="mailto:support@printokiyo.com" 
                  className="text-xs font-bold text-[#041e42] hover:underline flex items-center gap-1.5"
                >
                  <HelpCircle size={13} />
                  <span>support@printokiyo.com</span>
                </a>
              </div>
            </div>
          </aside>

          {/* Legal Text Content Body */}
          <article className="lg:col-span-8 xl:col-span-9 space-y-12 leading-relaxed text-gray-700 text-sm">
            
            {/* Highlights Card */}
            <div className="p-5 sm:p-6 bg-blue-50/60 border border-blue-200/80 rounded-2xl flex flex-col sm:flex-row gap-4 items-start">
              <div className="p-2.5 rounded-xl bg-blue-600 text-white flex-shrink-0">
                <ShieldCheck size={22} />
              </div>
              <div className="space-y-1 text-xs sm:text-sm text-blue-950">
                <h4 className="font-extrabold text-sm sm:text-base text-blue-900">
                  Quick Customer Summary
                </h4>
                <p>
                  Welcome to <strong>PrintOkiyo</strong>. By accessing our platform, purchasing posters, frames, split collages, or uploading custom photos, you agree to these Terms. We prioritize museum-grade archival quality, transparent flat pricing, and insured pan-India delivery. Please read this agreement in full.
                </p>
              </div>
            </div>

            {/* Section 1 */}
            <section id="agreement" className="scroll-mt-24 space-y-3">
              <h2 className="text-xl font-black text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-2">
                <span className="text-red-600">1.</span> Agreement to Terms
              </h2>
              <p>
                These Terms of Service (&ldquo;Terms&rdquo;) constitute a legally binding electronic agreement between you (&ldquo;Customer&rdquo;, &ldquo;User&rdquo;, or &ldquo;You&rdquo;) and <strong>PrintOkiyo</strong> (&ldquo;Company&rdquo;, &ldquo;We&rdquo;, &ldquo;Us&rdquo;, or &ldquo;Our&rdquo;) governing your access to and use of the website located at <strong>printokiyo.com</strong>, subdomains, payment interfaces, and all associated services.
              </p>
              <p>
                By visiting our store, creating an account, browsing collections, or making a purchase, you acknowledge that you have read, understood, and agreed to be bound by these Terms and our Privacy Policy. If you do not agree with any part of these Terms, you must immediately discontinue use of the platform.
              </p>
            </section>

            {/* Section 2 */}
            <section id="eligibility" className="scroll-mt-24 space-y-3">
              <h2 className="text-xl font-black text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-2">
                <span className="text-red-600">2.</span> Eligibility & Account Security
              </h2>
              <p>
                You must be at least 18 years old or the age of legal majority in your jurisdiction to purchase goods or register an account. If you are under 18, you may use PrintOkiyo only under the supervision of a parent or legal guardian who agrees to be bound by these Terms.
              </p>
              <p>
                When creating an account via mobile OTP or email, you agree to provide truthful, accurate, and complete information. You are solely responsible for maintaining the confidentiality of your session, password, and OTP, and for all activities that occur under your account.
              </p>
            </section>

            {/* Section 3 */}
            <section id="products" className="scroll-mt-24 space-y-3">
              <h2 className="text-xl font-black text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-2">
                <span className="text-red-600">3.</span> Products, Specifications & Accuracy
              </h2>
              <p>
                PrintOkiyo specializes in premium art posters, multi-panel split prints, desktop frames, and custom photo keepsakes. All posters are manufactured using genuine <strong>300 GSM Archival Fine Art Matte paper</strong> and calibrated <strong>12-color archival pigment inks</strong>.
              </p>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs sm:text-sm text-amber-950 flex gap-3 items-start">
                <AlertCircle size={18} className="text-amber-700 flex-shrink-0 mt-0.5" />
                <p>
                  <strong>Color & Display Disclaimer:</strong> Due to variations in computer monitors, smartphone screens, brightness settings, and the technical difference between RGB screen light and physical CMYK pigment ink reflection, actual printed colors may vary slightly from what appears on your digital screen. These slight natural variations are not considered manufacturing defects.
                </p>
              </div>
            </section>

            {/* Section 4 */}
            <section id="custom-uploads" className="scroll-mt-24 space-y-3">
              <h2 className="text-xl font-black text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-2">
                <span className="text-red-600">4.</span> Custom Photos & User-Submitted Content
              </h2>
              <p>
                When you order personalized items (such as <em>Custom Polaroid Photos</em>, custom split designs, or lithophanes) and upload images:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm">
                <li>
                  <strong>Copyright Ownership:</strong> You represent and warrant that you own the rights to the uploaded photograph or have express written permission from the copyright holder to reproduce it for personal wall display.
                </li>
                <li>
                  <strong>Prohibited Content:</strong> You strictly agree not to upload any photograph or artwork that is defamatory, obscene, pornographic, promoting violence, hate speech, illegal acts, or infringing upon the privacy or intellectual property rights of any third party.
                </li>
                <li>
                  <strong>Refusal Right:</strong> PrintOkiyo reserves the right to immediately reject and cancel any custom order containing prohibited or unlawful content without liability.
                </li>
                <li>
                  <strong>Temporary Storage:</strong> Uploaded images are stored strictly for fulfillment, quality checking, and printing purposes on encrypted cloud storage and are not resold or repurposed.
                </li>
              </ul>
            </section>

            {/* Section 5 */}
            <section id="pricing-payment" className="scroll-mt-24 space-y-3">
              <h2 className="text-xl font-black text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-2">
                <span className="text-red-600">5.</span> Pricing, Order Acceptance & Payments
              </h2>
              <p>
                All prices are stated in <strong>Indian Rupees (₹ INR)</strong> and include applicable taxes unless otherwise noted. We reserve the right to change prices, promotional discounts (such as <em>Best Value Packs Buy 1 Get 2</em>), or shipping thresholds at any time without prior notice.
              </p>
              <p>
                <strong>Payment Methods:</strong> We accept online prepaid payments via Razorpay (Unified Payments Interface / UPI, Google Pay, PhonePe, Paytm, Debit/Credit Cards, Net Banking) and Cash on Delivery (COD) on eligible orders.
              </p>
              <p>
                <strong>Order Acceptance:</strong> Receipt of an electronic order confirmation does not signify our final acceptance of your order. PrintOkiyo reserves the right to cancel or limit order quantities at any time prior to shipment due to inventory shortages, pricing glitches, suspicion of fraud, or courier service unavailability in your pin code.
              </p>
            </section>

            {/* Section 6 */}
            <section id="shipping-delivery" className="scroll-mt-24 space-y-3">
              <h2 className="text-xl font-black text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-2">
                <span className="text-red-600">6.</span> Shipping, Delivery & Tracking
              </h2>
              <p>
                We dispatch packages across India through trusted national courier partners (including Delhivery, Blue Dart, Xpressbees, Shadowfax, and India Post).
              </p>
              <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm">
                <li>
                  <strong>Dispatch Timeline:</strong> Orders are typically processed, custom-printed, and dispatched within <strong>24 to 48 business hours</strong>.
                </li>
                <li>
                  <strong>Estimated Delivery:</strong> Metro cities generally take <strong>3 to 5 business days</strong>; non-metro/rural destinations may take <strong>5 to 8 business days</strong>.
                </li>
                <li>
                  <strong>Live Tracking:</strong> Once dispatched, a live tracking link and AWB/tracking ID are sent directly to your registered phone number and WhatsApp.
                </li>
                <li>
                  <strong>Incorrect Delivery Address:</strong> You are responsible for providing an accurate street address and active mobile number. PrintOkiyo is not responsible for failed deliveries resulting from incomplete addresses or uncontactable recipients.
                </li>
              </ul>
            </section>

            {/* Section 7 */}
            <section id="cancellation-returns" className="scroll-mt-24 space-y-3">
              <h2 className="text-xl font-black text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-2">
                <span className="text-red-600">7.</span> Transit Damage, Replacements & Refunds
              </h2>
              <p>
                Because posters and custom polaroid photos are custom-produced on-demand upon your order, <strong>we do not accept standard buyer-remorse returns or size exchanges</strong> once printed.
              </p>
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-xs sm:text-sm space-y-2">
                <h4 className="font-bold text-gray-900 flex items-center gap-1.5">
                  <CheckCircle2 size={16} className="text-emerald-600" />
                  100% Free Replacement Guarantee for Transit Damage:
                </h4>
                <p>
                  Every poster is shipped in heavy-duty crush-resistant reinforced cylindrical tubes. However, in the rare event your package arrives damaged, bent, or with a printing defect:
                </p>
                <ol className="list-decimal pl-5 space-y-1">
                  <li>Capture a clear photo or short unboxing video of the damaged item and packaging within <strong>48 hours</strong> of delivery.</li>
                  <li>Email us at <strong>support@printokiyo.com</strong> or WhatsApp our support line with your Order ID (#MWM-XXXX).</li>
                  <li>Upon prompt verification, we will dispatch a <strong>brand-new replacement completely free of charge</strong>, or issue a full refund if the item is out of stock.</li>
                </ol>
              </div>
            </section>

            {/* Section 8 */}
            <section id="intellectual-property" className="scroll-mt-24 space-y-3">
              <h2 className="text-xl font-black text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-2">
                <span className="text-red-600">8.</span> Intellectual Property & Fan Art Disclaimer
              </h2>
              <p>
                The website design, branding, logo, code, layout, graphics, text, and user interface are the exclusive intellectual property of PrintOkiyo and protected under Indian and international copyright and trademark laws.
              </p>
              <p>
                <strong>Fan Art Disclaimer:</strong> All anime, cinema, superhero, sports, and pop-culture posters curated on this platform are intended as transformative fan art and creative tributes for personal indoor aesthetic decoration. They are not purported to be official licensed merchandise unless explicitly stated. If you are a copyright holder and believe any artwork infringes on your rights, please reach out to our IP Grievance channel at <strong>support@printokiyo.com</strong> for prompt takedown review.
              </p>
            </section>

            {/* Section 9 */}
            <section id="prohibited-conduct" className="scroll-mt-24 space-y-3">
              <h2 className="text-xl font-black text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-2">
                <span className="text-red-600">9.</span> Prohibited Conduct
              </h2>
              <p>You agree not to:</p>
              <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm">
                <li>Use automated bots, spiders, or scrapers to extract product catalogs, pricing, or images.</li>
                <li>Interfere with, breach, or compromise the server security, API endpoints, or database integrity.</li>
                <li>Place fraudulent Cash on Delivery (COD) orders or intentionally reject genuine deliveries.</li>
                <li>Attempt to reverse-engineer or clone the proprietary design assets or user interface.</li>
              </ul>
            </section>

            {/* Section 10 */}
            <section id="liability-warranty" className="scroll-mt-24 space-y-3">
              <h2 className="text-xl font-black text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-2">
                <span className="text-red-600">10.</span> Limitation of Liability & Warranty Disclaimer
              </h2>
              <p>
                To the fullest extent permitted by applicable law, PrintOkiyo provides products and the platform on an &ldquo;as is&rdquo; and &ldquo;as available&rdquo; basis without warranties of any kind, whether express or implied.
              </p>
              <p>
                In no event shall PrintOkiyo, its founders, directors, employees, or logistics partners be liable for any indirect, incidental, punitive, or consequential damages arising out of your use of the website or purchased products. In all circumstances, our maximum aggregate liability shall not exceed the total amount actually paid by you for the specific product giving rise to the claim.
              </p>
            </section>

            {/* Section 11 */}
            <section id="governing-law" className="scroll-mt-24 space-y-3">
              <h2 className="text-xl font-black text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-2">
                <span className="text-red-600">11.</span> Governing Law & Dispute Resolution
              </h2>
              <p>
                These Terms and any purchase contracts shall be governed by, interpreted, and construed in accordance with the <strong>laws of the Republic of India</strong>, including the Indian Contract Act, 1872, the Information Technology Act, 2000, and the Consumer Protection Act, 2019.
              </p>
              <p>
                Any dispute, controversy, or claim arising out of or relating to these Terms or orders placed on PrintOkiyo shall be subject to the exclusive jurisdiction of the competent courts in India.
              </p>
            </section>

            {/* Section 12 */}
            <section id="grievance" className="scroll-mt-24 space-y-3">
              <h2 className="text-xl font-black text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-2">
                <span className="text-red-600">12.</span> Grievance Redressal Officer & Contact
              </h2>
              <p>
                In accordance with the Consumer Protection (E-Commerce) Rules, 2020 and the Information Technology Act, 2000, the contact details of our Grievance Officer are provided below:
              </p>
              
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 text-xs sm:text-sm space-y-2">
                <p><strong>Grievance Officer:</strong> Legal & Customer Support Team</p>
                <p><strong>Brand / Entity:</strong> PrintOkiyo India</p>
                <p><strong>Official Support Email:</strong> <a href="mailto:support@printokiyo.com" className="text-blue-600 hover:underline font-semibold">support@printokiyo.com</a></p>
                <p><strong>WhatsApp Support:</strong> Available 10:00 AM &ndash; 7:00 PM IST (Mon &ndash; Sat)</p>
                <p><strong>Acknowledgment Time:</strong> Within 48 business hours of ticket receipt</p>
                <p><strong>Resolution Target:</strong> Within 30 days from grievance submission</p>
              </div>

              <div className="pt-6">
                <button
                  onClick={onNavigateHome}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-black hover:bg-zinc-800 text-white rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer"
                >
                  <span>Back to PrintOkiyo Shop</span>
                  <ArrowRight size={15} />
                </button>
              </div>
            </section>

          </article>
        </div>
      </main>
    </div>
  );
};

import React from 'react';
import { 
  Home, ChevronRight, Facebook, Instagram, MessageCircle, 
  Sparkles, ShieldCheck, Zap, Heart, ArrowRight 
} from 'lucide-react';

interface AboutUsPageProps {
  onNavigateHome: () => void;
  onExploreProducts: () => void;
}

export const AboutUsPage: React.FC<AboutUsPageProps> = ({ 
  onNavigateHome, 
  onExploreProducts 
}) => {
  return (
    <div className="min-h-screen bg-white text-gray-900 select-none flex flex-col">
      {/* 1. Hero Banner with Dark Aesthetic Room Overlay */}
      <section className="relative overflow-hidden bg-zinc-950 text-white py-14 sm:py-20 md:py-24 px-4 text-center">
        {/* Background image & gradient overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40 scale-105 transform transition-transform duration-1000"
          style={{ backgroundImage: `url('/hero-banner.webp')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/75 to-zinc-950/90" />

        {/* Content Container */}
        <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center">
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-300 mb-6">
            <button 
              onClick={onNavigateHome}
              className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer text-gray-300"
            >
              <Home size={14} className="text-[#e2b04c]" />
              <span>Home</span>
            </button>
            <ChevronRight size={14} className="text-gray-400" />
            <span className="text-white font-bold">About Us</span>
          </nav>

          {/* Page Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-wider text-white mb-3">
            ABOUT US
          </h1>

          {/* Subtitle */}
          <p className="text-xs sm:text-sm md:text-base text-gray-300 font-medium max-w-xl leading-relaxed">
            Welcome to <span className="text-white font-bold">PrintOkiyo</span>. A place where your search for an amazing frame/poster comes to an end.
          </p>
        </div>
      </section>

      {/* 2. Main Story & Mission Section */}
      <main className="flex-1 py-14 sm:py-20 px-5 sm:px-8 max-w-4xl mx-auto text-center">
        {/* Catchphrase Header matching reference styling */}
        <h2 className="text-red-600 font-serif text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-8">
          &ldquo;Jo Dikhe Print Karo&rdquo;
        </h2>

        {/* Story Paragraph 1 */}
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed sm:leading-loose mb-7 font-normal">
          Founded in 2024 by two friends who are passionate anime, art, and pop-culture enthusiasts looking for wall art with unique designs at an affordable price, but couldn&apos;t find it anywhere without sacrificing paper thickness or clarity. So, we started <strong className="text-gray-900 font-semibold">PrintOkiyo</strong> to solve the problem for creators, students, and home decor lovers like us.
        </p>

        {/* Story Paragraph 2 */}
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed sm:leading-loose mb-10 font-normal">
          Our vision is to provide you with premium quality frames and posters with some of the most amazing and eye-catching designs at a very affordable price that will make your walls look absolutely great. Every product is made with love and perfection using <strong className="text-gray-900 font-semibold">300 GSM Archival Fine Art Matte paper</strong> and vibrant 12-color pigment printing so that we fulfill all the expectations of our beloved customers.
        </p>

        {/* Social Media Links (Matching circular black buttons in reference) */}
        <div className="flex items-center justify-center gap-4 mb-14">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center hover:bg-red-600 transition-all duration-200 shadow-md hover:scale-105 cursor-pointer"
          >
            <Facebook size={18} fill="currentColor" />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center hover:bg-red-600 transition-all duration-200 shadow-md hover:scale-105 cursor-pointer"
          >
            <Instagram size={18} />
          </a>
          <a
            href="https://wa.me/919999999999?text=Hi%20PrintOkiyo%20Team!%20I%20love%20your%20posters."
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp"
            className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center hover:bg-emerald-600 transition-all duration-200 shadow-md hover:scale-105 cursor-pointer"
          >
            <MessageCircle size={18} />
          </a>
        </div>

        {/* 3. Core Brand Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-left pt-6 border-t border-gray-100">
          <div className="p-4 rounded-xl bg-gray-50 border border-gray-100/80 flex flex-col gap-2">
            <div className="w-8 h-8 rounded-lg bg-red-100 text-red-600 flex items-center justify-center">
              <Sparkles size={16} />
            </div>
            <h3 className="font-bold text-xs uppercase tracking-wide text-gray-900">12-Color Archival</h3>
            <p className="text-xs text-gray-500 leading-normal">
              Ultra-high-definition pigment inks for deep blacks and rich colors that never fade.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-gray-50 border border-gray-100/80 flex flex-col gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
              <ShieldCheck size={16} />
            </div>
            <h3 className="font-bold text-xs uppercase tracking-wide text-gray-900">300 GSM Matte</h3>
            <p className="text-xs text-gray-500 leading-normal">
              Heavyweight fine art matte paper with non-glare, fingerprint-resistant velvet finish.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-gray-50 border border-gray-100/80 flex flex-col gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
              <Zap size={16} />
            </div>
            <h3 className="font-bold text-xs uppercase tracking-wide text-gray-900">Hard Tube Packing</h3>
            <p className="text-xs text-gray-500 leading-normal">
              Multi-layer shock-absorbing reinforced packaging for zero transit damage.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-gray-50 border border-gray-100/80 flex flex-col gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Heart size={16} />
            </div>
            <h3 className="font-bold text-xs uppercase tracking-wide text-gray-900">Made With Love</h3>
            <p className="text-xs text-gray-500 leading-normal">
              Custom split panels, polaroid packs, and curated themes crafted for your space.
            </p>
          </div>
        </div>

        {/* 4. Call to Action Button */}
        <div className="mt-12">
          <button
            onClick={onExploreProducts}
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-black hover:bg-zinc-800 text-white text-xs sm:text-sm font-bold uppercase tracking-wider rounded-xl transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 cursor-pointer"
          >
            <span>Explore Our Collection</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </main>
    </div>
  );
};

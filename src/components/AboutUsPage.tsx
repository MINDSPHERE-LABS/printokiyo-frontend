import React from 'react';
import { 
  ArrowLeft, Facebook, Instagram, MessageCircle, 
  Sparkles, ShieldCheck, Layers, PackageCheck, ArrowRight, Compass, Flame
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
      {/* 1. Sleek Navigation Header */}
      <div className="pt-4 pb-2 px-4 sm:px-6 max-w-5xl mx-auto w-full">
        <button
          onClick={onNavigateHome}
          className="inline-flex items-center gap-2 text-xs font-bold text-gray-800 hover:text-black bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-full transition-all cursor-pointer shadow-xs active:scale-95 border-0"
          style={{ border: 0 }}
        >
          <ArrowLeft size={14} className="stroke-[2.5]" />
          <span>Back to Home</span>
        </button>
      </div>

      {/* 2. Hero Section */}
      <section className="relative overflow-hidden bg-zinc-950 text-white py-16 sm:py-24 px-4 text-center mt-2 rounded-2xl max-w-5xl mx-auto w-full">
        {/* Subtle Dark Room Texture & Ambient Glow */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30 scale-105 transform transition-transform duration-1000"
          style={{ backgroundImage: `url('/hero-banner.webp')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-zinc-950/80 to-zinc-950" />
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-red-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-[11px] font-extrabold uppercase tracking-widest mb-4">
            <Compass size={13} className="text-red-400" />
            <span>The PrintOkiyo Story</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-display font-black uppercase tracking-tight text-white mb-4 leading-tight">
            YOUR WALLS SHOULD <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-amber-400 to-orange-400">
              FUEL YOUR AMBITION
            </span>
          </h1>

          <p className="text-xs sm:text-sm md:text-base text-gray-300 font-medium max-w-2xl leading-relaxed">
            Where anime energy, racetrack adrenaline, cinematic icons, and sacred heritage meet industrial-grade archival printmaking.
          </p>
        </div>
      </section>

      {/* 3. The Origin Story & Philosophy */}
      <main className="flex-1 py-14 sm:py-20 px-5 sm:px-8 max-w-4xl mx-auto text-left">
        {/* Origin Chapter */}
        <div className="mb-14">
          <span className="text-xs font-black uppercase tracking-widest text-red-600 block mb-2">
            01 / The Genesis
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-black text-gray-900 tracking-tight mb-6">
            We Refused to Accept Flimsy Paper and Cheap Glare.
          </h2>
          <div className="space-y-5 text-sm sm:text-base text-gray-600 leading-relaxed font-normal">
            <p>
              Your room is not just four walls. It is your visual sanctuary. It is where you pull late-night coding sessions, grind through study marathons, binge unforgettable anime arcs, celebrate cricket triumphs, and dream about your next milestones.
            </p>
            <p>
              Yet for years, buying posters online was a constant compromise. You either received thin, 150 GSM magazine-grade flyers that curled at the corners within a week, or cheap glossy prints that bounced harsh glare from every desk lamp and RGB lighting setup.
            </p>
            <p>
              <strong className="text-gray-900 font-semibold">PrintOkiyo was born to break that standard.</strong> Inspired by the philosophy of <em>&ldquo;Okiyo&rdquo;</em>—living vibrantly and celebrating art in everyday life—we set out to craft wall art that carries the heft, texture, and deep pigment fidelity of museum-grade collectibles, delivered straight to your door at prices everyone can own.
            </p>
          </div>
        </div>

        {/* The Engineering Chapter */}
        <div className="mb-14 p-6 sm:p-8 bg-zinc-50 rounded-2xl border-0" style={{ border: 0 }}>
          <span className="text-xs font-black uppercase tracking-widest text-amber-600 block mb-2">
            02 / The PrintOkiyo Craft Standard
          </span>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-display font-black text-gray-900 tracking-tight mb-4">
            Industrial Precision in Every Single Sheet.
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-6">
            We don&apos;t drop-ship or cut corners. Every design in our catalog goes through high-resolution digital remastering, professional color calibration, and hands-on print inspection:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-xl shadow-xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900 flex items-center gap-1.5 mb-1">
                <span className="w-2 h-2 rounded-full bg-red-500" />
                300+ GSM Archival Art Cardstock
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Substantial, rigid, and durable cardstock that hangs flat without tape wrinkles or warping.
              </p>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900 flex items-center gap-1.5 mb-1">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                Velvet Anti-Glare Matte Lamination
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Zero reflections under gaming setups, study lights, or sunlight with deep, velvety contrast.
              </p>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900 flex items-center gap-1.5 mb-1">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                Engineered Multi-Panel Splits
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Seamless panoramic split posters aligned with mathematical precision for ultra-wide wall setups.
              </p>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900 flex items-center gap-1.5 mb-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Crush-Proof Armor Packaging
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Shipped in heavy-gauge reinforced rigid tubes so your prints arrive in 100% mint condition.
              </p>
            </div>
          </div>
        </div>

        {/* 4. Core Brand Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-left mb-14">
          <div className="p-4 rounded-xl bg-gray-50 border-0 flex flex-col gap-2" style={{ border: 0 }}>
            <div className="w-8 h-8 rounded-lg bg-red-100 text-red-600 flex items-center justify-center">
              <Sparkles size={16} />
            </div>
            <h3 className="font-bold text-xs uppercase tracking-wide text-gray-900">12-Color Pigment</h3>
            <p className="text-xs text-gray-500 leading-normal">
              Ultra-high-definition inks reproducing vivid colors and ink blacks that never fade.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-gray-50 border-0 flex flex-col gap-2" style={{ border: 0 }}>
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
              <ShieldCheck size={16} />
            </div>
            <h3 className="font-bold text-xs uppercase tracking-wide text-gray-900">300+ GSM Matte</h3>
            <p className="text-xs text-gray-500 leading-normal">
              Heavyweight fine art cardstock with fingerprint-resistant velvet tactile finish.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-gray-50 border-0 flex flex-col gap-2" style={{ border: 0 }}>
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
              <Layers size={16} />
            </div>
            <h3 className="font-bold text-xs uppercase tracking-wide text-gray-900">Custom Splits</h3>
            <p className="text-xs text-gray-500 leading-normal">
              Pioneering 3-panel &amp; 8-panel split displays engineered for modern desk setups.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-gray-50 border-0 flex flex-col gap-2" style={{ border: 0 }}>
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <PackageCheck size={16} />
            </div>
            <h3 className="font-bold text-xs uppercase tracking-wide text-gray-900">Zero Damage</h3>
            <p className="text-xs text-gray-500 leading-normal">
              Multi-layer shock-absorbing cylindrical tubes backed by our free replacement guarantee.
            </p>
          </div>
        </div>

        {/* 5. Manifesto Quote Banner */}
        <div className="text-center p-8 sm:p-10 bg-black text-white rounded-2xl mb-14">
          <Flame size={24} className="text-amber-400 mx-auto mb-3" />
          <blockquote className="font-display font-black text-lg sm:text-2xl uppercase tracking-tight max-w-xl mx-auto leading-snug">
            &ldquo;No flimsy paper. No glossy reflections. No faded colors. Just pure art that transforms your everyday space.&rdquo;
          </blockquote>
          <span className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-3 block">
            — The PrintOkiyo Manifesto
          </span>
        </div>

        {/* 6. Social Connect & Direct Contact */}
        <div className="text-center mb-12">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">
            Connect With Our Community
          </p>
          <div className="flex items-center justify-center gap-4">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center hover:bg-red-600 transition-all duration-200 shadow-sm hover:scale-105 cursor-pointer"
            >
              <Facebook size={18} fill="currentColor" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center hover:bg-red-600 transition-all duration-200 shadow-sm hover:scale-105 cursor-pointer"
            >
              <Instagram size={18} />
            </a>
            <a
              href="https://wa.me/919999999999?text=Hi%20PrintOkiyo%20Team!%20I%20love%20your%20posters."
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center hover:bg-emerald-600 transition-all duration-200 shadow-sm hover:scale-105 cursor-pointer"
            >
              <MessageCircle size={18} />
            </a>
          </div>
        </div>

        {/* 7. Call to Action Button */}
        <div className="text-center">
          <button
            onClick={onExploreProducts}
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-black hover:bg-zinc-800 text-white text-xs sm:text-sm font-bold uppercase tracking-wider rounded-xl transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 cursor-pointer border-0"
            style={{ border: 0 }}
          >
            <span>Explore The Collection</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </main>
    </div>
  );
};

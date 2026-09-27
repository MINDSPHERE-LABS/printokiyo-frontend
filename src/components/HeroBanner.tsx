import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck, Zap, Sparkles } from 'lucide-react';

export const HeroBanner: React.FC = () => {
  return (
    <section className="relative overflow-hidden py-12 md:py-20 lg:py-24">
      {/* Background radial gradients for luxury feel */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-brand-100/40 dark:bg-brand-950/10 rounded-full filter blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-brand-200/20 dark:bg-zinc-900/20 rounded-full filter blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Hero text */}
          <div className="lg:col-span-6 flex flex-col justify-center text-center lg:text-left">
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-1.5 self-center lg:self-start px-3.5 py-1.5 rounded-full bg-brand-100 dark:bg-brand-950/50 border border-brand-200/50 dark:border-brand-900/30 text-xs font-semibold text-brand-700 dark:text-brand-300 mb-6"
            >
              <Sparkles size={12} className="text-luxury-bronze" />
              <span>Artisan 3D Printed Physical Products</span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-display font-black tracking-tight leading-none text-gray-900 dark:text-white"
            >
              Artisanal Precision.<br />
              <span className="gold-gradient-text">Premium Realization.</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-6 text-base sm:text-lg text-gray-600 dark:text-zinc-400 max-w-xl mx-auto lg:mx-0 leading-relaxed font-sans"
            >
              We design, print, and hand-finish luxury desk accessories, cosplay masks, home decor, and gaming objects. Each piece is crafted on-demand using premium bio-plastics and raw metallic blends.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
            >
              <a 
                href="#shop" 
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 border border-transparent text-sm font-semibold rounded-xl text-white bg-brand-600 hover:bg-brand-700 dark:bg-brand-500 dark:hover:bg-brand-600 shadow-md hover:shadow-lg transition-all duration-300 group"
              >
                Explore Collection
                <ArrowRight size={16} className="ml-2 transform group-hover:translate-x-1 transition-transform" />
              </a>
              <a 
                href="#about" 
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 border border-gray-200 dark:border-zinc-800 text-sm font-semibold rounded-xl text-gray-700 dark:text-zinc-300 bg-white dark:bg-zinc-900 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-all duration-300"
              >
                Our Process
              </a>
            </motion.div>

            {/* Subtle badges */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="mt-12 grid grid-cols-3 gap-4 border-t border-gray-100 dark:border-zinc-900 pt-8 max-w-lg mx-auto lg:mx-0"
            >
              <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
                <span className="text-xl sm:text-2xl font-black font-display text-gray-900 dark:text-white">0.12mm</span>
                <span className="text-[10px] sm:text-xs text-gray-500 dark:text-zinc-500 uppercase tracking-wider font-medium mt-1">Extra Fine Resolution</span>
              </div>
              <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
                <span className="text-xl sm:text-2xl font-black font-display text-gray-900 dark:text-white">100%</span>
                <span className="text-[10px] sm:text-xs text-gray-500 dark:text-zinc-500 uppercase tracking-wider font-medium mt-1">On-Demand Brand</span>
              </div>
              <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
                <span className="text-xl sm:text-2xl font-black font-display text-gray-900 dark:text-white">Eco</span>
                <span className="text-[10px] sm:text-xs text-gray-500 dark:text-zinc-500 uppercase tracking-wider font-medium mt-1">Renewable Polymers</span>
              </div>
            </motion.div>
          </div>

          {/* Hero Image Showcase */}
          <div className="lg:col-span-6 relative flex justify-center items-center">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="relative w-full max-w-lg aspect-square sm:aspect-[4/3] lg:aspect-square bg-gradient-to-tr from-brand-100 to-brand-200 dark:from-zinc-900 dark:to-zinc-800 rounded-3xl p-4 overflow-visible shadow-2xl flex items-center justify-center border border-white/20 dark:border-white/5"
            >
              <img 
                src="/images/products/cyberpunk_stand.jpg" 
                alt="Apex Cyberpunk Headphone Stand"
                className="w-[85%] h-[85%] object-contain rounded-2xl drop-shadow-[0_20px_40px_rgba(0,0,0,0.3)] hover:scale-105 transition-transform duration-500"
              />

              {/* Floating badges overlay */}
              <motion.div 
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-4 -right-4 glass px-4 py-2.5 rounded-2xl shadow-lg border border-white/40 flex items-center gap-2"
              >
                <div className="p-1.5 rounded-lg bg-green-500/10 text-green-600 dark:text-green-400">
                  <ShieldCheck size={16} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">QC Passed</span>
                  <span className="text-xs font-semibold text-gray-900 dark:text-white">Microscopically Audited</span>
                </div>
              </motion.div>

              <motion.div 
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 4, delay: 1, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-6 -left-4 glass px-4 py-2.5 rounded-2xl shadow-lg border border-white/40 flex items-center gap-2"
              >
                <div className="p-1.5 rounded-lg bg-brand-500/10 text-brand-600 dark:text-brand-400">
                  <Zap size={16} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Fast Execution</span>
                  <span className="text-xs font-semibold text-gray-900 dark:text-white">2-3 Days Production Time</span>
                </div>
              </motion.div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
};

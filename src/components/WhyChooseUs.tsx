import React from 'react';
import { Award, ShieldCheck, Sparkles, Truck, CheckCircle2 } from 'lucide-react';

const reasons = [
  {
    icon: Award,
    title: "300+ GSM Archival Cardstock",
    description: "Printed on museum-grade heavy art paper that stays rigid and never curls, ripples, or tears over time."
  },
  {
    icon: Sparkles,
    title: "Anti-Glare Matte Finish",
    description: "Premium velvet lamination eliminates harsh room reflections while locking in vibrant colors and deep blacks."
  },
  {
    icon: ShieldCheck,
    title: "Ultra-HD Pigment Inks",
    description: "High-definition 12-color archival pigment printing ensures razor-sharp artwork that stays fade-proof for 10+ years."
  },
  {
    icon: Truck,
    title: "Damage-Proof Rigid Packaging",
    description: "Shipped in heavy-gauge reinforced cylindrical tubes with moisture seals. 100% free replacement if transit-damaged."
  }
];

export const WhyChooseUs: React.FC = () => {
  return (
    <section className="py-12 sm:py-16 bg-gradient-to-b from-white via-zinc-50/60 to-white text-left select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] sm:text-xs font-black tracking-widest uppercase bg-zinc-900 text-white shadow-xs mb-2.5">
            <CheckCircle2 size={13} className="text-emerald-400" />
            <span>THE PRINTOKIYO PROMISE</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-black text-gray-950 tracking-tight uppercase">
            Crafted for True Collectors
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 mt-2 font-medium max-w-lg mx-auto">
            We don't do cheap magazine prints. Every poster is precision-crafted with gallery-grade cardstock and archival inks.
          </p>
        </div>

        {/* 4 Feature Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {reasons.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div 
                key={idx} 
                className="group relative p-6 sm:p-7 rounded-2xl bg-white border border-gray-150 hover:border-black/30 hover:shadow-lg transition-all duration-300 flex flex-col items-start text-left"
              >
                <div className="w-11 h-11 rounded-xl bg-zinc-950 text-white flex items-center justify-center mb-4.5 group-hover:scale-105 transition-transform shadow-xs">
                  <Icon size={20} className="text-amber-300" />
                </div>
                <h3 className="text-sm sm:text-base font-display font-black text-gray-950 uppercase tracking-tight mb-2">
                  {item.title}
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed font-normal">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

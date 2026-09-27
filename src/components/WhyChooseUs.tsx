import React from 'react';
import { Award, Feather, ShieldCheck, Zap } from 'lucide-react';

const reasons = [
  {
    icon: Award,
    title: "Premium Hand-Finished Quality",
    description: "Every product is sanded, inspectively cleaned, and finished by hand. No raw structural stringing or rough layer lines leave our workshop."
  },
  {
    icon: ShieldCheck,
    title: "Eco-Friendly Engineered Plastics",
    description: "We print exclusively with premium corn-starch bio-PLA and recycled composite PETG polymers, combining strength with environmental care."
  },
  {
    icon: Zap,
    title: "Rapid Made-to-Order Process",
    description: "Your product is queued, manufactured, and finished within 2-3 business days. We begin shipping immediately after final visual audits."
  },
  {
    icon: Feather,
    title: "High-Strength Design Layouts",
    description: "We optimize print settings for each item (infill patterns, shell counts) to ensure structural integrity and premium density."
  }
];

export const WhyChooseUs: React.FC = () => {
  return (
    <section className="py-16 bg-white dark:bg-zinc-950 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-xl mx-auto mb-16">
          <span className="text-xs font-semibold text-brand-600 dark:text-brand-400 uppercase tracking-widest">Our Standards</span>
          <h2 className="text-3xl font-display font-black text-gray-900 dark:text-white mt-2">Why Choose PrintOkiyo</h2>
          <p className="text-sm text-gray-500 dark:text-zinc-400 mt-3">
            We bridge the gap between digital artwork and museum-quality wall prints & frames.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {reasons.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div 
                key={idx} 
                className="group p-8 rounded-3xl bg-gray-50 dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 hover:border-brand-200 dark:hover:border-brand-900/50 hover:bg-white dark:hover:bg-zinc-900/85 transition-all duration-300 flex flex-col items-center text-center shadow-xs"
              >
                <div className="p-4 rounded-2xl bg-brand-50 text-brand-600 dark:bg-brand-950/40 dark:text-brand-400 mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Icon size={24} />
                </div>
                <h3 className="text-base font-display font-bold text-gray-900 dark:text-white mb-3">
                  {item.title}
                </h3>
                <p className="text-xs text-gray-500 dark:text-zinc-400 leading-relaxed">
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

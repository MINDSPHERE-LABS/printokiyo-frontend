import React from 'react';
import { 
  Sparkles, Layers, Box, Cpu, Home, Compass, 
  Gamepad, Gift, Hammer, Key
} from 'lucide-react';

const categories = [
  { name: "All Products", icon: Sparkles },
  { name: "Headphone Stands", icon: Cpu },
  { name: "Vases", icon: Layers },
  { name: "Organizers", icon: Box },
  { name: "Planters", icon: Home },
  { name: "Masks", icon: Hammer },
  { name: "Wall Art", icon: Compass },
  { name: "Gaming Accessories", icon: Gamepad },
  { name: "Desk Accessories", icon: Key },
  { name: "Custom Gifts", icon: Gift }
];

interface ShopByCategoryProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export const ShopByCategory: React.FC<ShopByCategoryProps> = ({ selectedCategory, onSelectCategory }) => {
  return (
    <section className="py-12 bg-gray-50/50 dark:bg-zinc-900/30 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs font-semibold text-brand-600 dark:text-brand-400 uppercase tracking-widest">Find Your Fit</span>
          <h2 className="text-2xl sm:text-3xl font-display font-black text-gray-900 dark:text-white mt-1">Shop by Category</h2>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-zinc-400 mt-2">
            Filter our premium finished items by structural category to narrow down your search.
          </p>
        </div>

        {/* Scrollable category list */}
        <div className="flex overflow-x-auto pb-4 gap-4 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-zinc-800 scroll-smooth no-scrollbar snap-x">
          {categories.map((cat, idx) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === (cat.name === "All Products" ? "" : cat.name);
            
            return (
              <button
                key={idx}
                onClick={() => onSelectCategory(cat.name === "All Products" ? "" : cat.name)}
                className={`snap-start flex-shrink-0 flex items-center gap-2.5 px-6 py-3.5 rounded-full border text-xs sm:text-sm font-semibold transition-all duration-300 ${
                  isSelected
                    ? 'bg-brand-600 border-brand-600 text-white dark:bg-brand-500 dark:border-brand-500 shadow-md scale-102'
                    : 'bg-white border-gray-200 text-gray-700 hover:border-gray-400 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-300 dark:hover:border-zinc-600'
                }`}
              >
                <Icon size={16} className={isSelected ? 'text-white' : 'text-brand-500 dark:text-brand-400'} />
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>

      </div>
    </section>
  );
};

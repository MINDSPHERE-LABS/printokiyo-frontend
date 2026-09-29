import React, { useState } from 'react';
import { 
  X, ChevronRight, ChevronLeft, User, UserPlus, Heart, LogOut
} from 'lucide-react';

interface SidebarDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCategory: (category: string | null) => void;
  onNavigateTab: (tab: 'home' | 'search' | 'wishlist' | 'cart' | 'profile') => void;
  isLoggedIn: boolean;
  userProfile: any;
  onOpenAuth: () => void;
  onLogout: () => void;
  categoriesList?: string[];
  onSelectPolaroid?: () => void;
}

type MenuLevel = 'main' | 'split_poster' | 'posters' | 'collage_kits';

export const SidebarDrawer: React.FC<SidebarDrawerProps> = ({
  isOpen,
  onClose,
  onSelectCategory,
  onNavigateTab,
  isLoggedIn,
  userProfile,
  onOpenAuth,
  onLogout,
  onSelectPolaroid
}) => {
  const [currentLevel, setCurrentLevel] = useState<MenuLevel>('main');

  if (!isOpen) return null;

  const handleCategoryClick = (cat: string | null) => {
    onSelectCategory(cat);
    onClose();
  };

  const handleTabClick = (tab: 'home' | 'search' | 'wishlist' | 'cart' | 'profile') => {
    onNavigateTab(tab);
    onClose();
  };

  const getSubmenuTitle = (): string => {
    if (currentLevel === 'split_poster') return 'Split Poster';
    if (currentLevel === 'posters') return 'Posters';
    if (currentLevel === 'collage_kits') return 'Collage/Block Kits';
    return 'Menu';
  };

  return (
    <div className="fixed inset-0 z-50 flex select-none">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200"
      />

      {/* Drawer Content */}
      <div className="relative bg-white w-80 max-w-[85vw] h-full shadow-2xl flex flex-col animate-in slide-in-from-left duration-300">
        
        {/* Header Header matching reference screenshot media_1790514343537.png */}
        {currentLevel === 'main' ? (
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-150 bg-white">
            <span className="text-base font-bold text-gray-900">Menu</span>
            <button 
              onClick={onClose} 
              className="p-1.5 rounded-full hover:bg-gray-100 text-gray-600 hover:text-black transition-colors cursor-pointer"
              aria-label="Close menu"
            >
              <X size={18} />
            </button>
          </div>
        ) : (
          <div className="relative flex items-center justify-center px-4 py-4 border-b border-gray-150 bg-gray-50/70">
            <button 
              onClick={() => setCurrentLevel('main')}
              className="absolute left-4 p-1 rounded-full text-gray-700 hover:text-black hover:bg-gray-200/80 transition-colors cursor-pointer"
              aria-label="Back to main menu"
            >
              <ChevronLeft size={20} />
            </button>
            <span className="text-sm sm:text-base font-semibold text-gray-900">
              {getSubmenuTitle()}
            </span>
          </div>
        )}

        {/* Scrollable Navigation Body */}
        <div className="flex-grow overflow-y-auto">
          {/* Level 0: Main Menu */}
          {currentLevel === 'main' && (
            <div className="flex flex-col divide-y divide-gray-100 text-left">
              <button
                onClick={() => setCurrentLevel('split_poster')}
                className="w-full flex items-center justify-between px-5 py-3.5 text-sm font-medium text-gray-900 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <span>Split Poster</span>
                <ChevronRight size={16} className="text-gray-400" />
              </button>

              <button
                onClick={() => setCurrentLevel('posters')}
                className="w-full flex items-center justify-between px-5 py-3.5 text-sm font-medium text-gray-900 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <span>Posters</span>
                <ChevronRight size={16} className="text-gray-400" />
              </button>

              <button
                onClick={() => handleCategoryClick('Wall Sets')}
                className="w-full flex items-center justify-between px-5 py-3.5 text-sm font-medium text-gray-900 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <span>Wall Sets</span>
              </button>

              <button
                onClick={() => setCurrentLevel('collage_kits')}
                className="w-full flex items-center justify-between px-5 py-3.5 text-sm font-medium text-gray-900 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <span>Collage/Block Kits</span>
                <ChevronRight size={16} className="text-gray-400" />
              </button>

              <button
                onClick={() => {
                  if (onSelectPolaroid) {
                    onSelectPolaroid();
                  } else {
                    handleCategoryClick('Custom Poloride Photo');
                  }
                  onClose();
                }}
                className="w-full flex items-center justify-between px-5 py-3.5 text-sm font-bold text-gray-950 bg-gradient-to-r from-amber-50 to-orange-50/60 hover:from-amber-100 hover:to-orange-100 transition-colors cursor-pointer border-l-4 border-amber-500"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-base">📸</span>
                  <span>Custom Polaroid Photos</span>
                </div>
                <span className="text-[8.5px] font-black uppercase tracking-wider bg-amber-500 text-white px-2 py-0.5 rounded-full shadow-2xs">
                  NEW
                </span>
              </button>

              <button
                onClick={() => handleCategoryClick('Customization')}
                className="w-full flex items-center justify-between px-5 py-3.5 text-sm font-medium text-gray-900 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <span>Customization</span>
              </button>

              <button
                onClick={() => {
                  onClose();
                  window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
                }}
                className="w-full flex items-center justify-between px-5 py-3.5 text-sm font-medium text-gray-900 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <span>Happy Customers</span>
              </button>

              <a
                href="mailto:support@printokiyo.com"
                className="w-full flex items-center justify-between px-5 py-3.5 text-sm font-medium text-gray-900 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <span>Support</span>
              </a>

              {/* Account Utilities matching bottom of reference screenshot */}
              <div className="pt-2 flex flex-col divide-y divide-gray-100 bg-gray-50/50">
                {isLoggedIn ? (
                  <>
                    <button
                      onClick={() => handleTabClick('profile')}
                      className="w-full flex items-center gap-3 px-5 py-3.5 text-sm font-medium text-gray-900 hover:bg-gray-100 transition-colors cursor-pointer"
                    >
                      <User size={18} className="text-gray-600" />
                      <span>My Account ({userProfile?.name?.split(' ')[0] || 'User'})</span>
                    </button>
                    <button
                      onClick={() => {
                        onLogout();
                        onClose();
                      }}
                      className="w-full flex items-center gap-3 px-5 py-3.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                    >
                      <LogOut size={18} />
                      <span>Sign Out</span>
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        onClose();
                        onOpenAuth();
                      }}
                      className="w-full flex items-center gap-3 px-5 py-3.5 text-sm font-medium text-gray-900 hover:bg-gray-100 transition-colors cursor-pointer"
                    >
                      <User size={18} className="text-gray-600" />
                      <span>Sign In</span>
                    </button>
                    <button
                      onClick={() => {
                        onClose();
                        onOpenAuth();
                      }}
                      className="w-full flex items-center gap-3 px-5 py-3.5 text-sm font-medium text-gray-900 hover:bg-gray-100 transition-colors cursor-pointer"
                    >
                      <UserPlus size={18} className="text-gray-600" />
                      <span>Create an Account</span>
                    </button>
                  </>
                )}

                <button
                  onClick={() => handleTabClick('wishlist')}
                  className="w-full flex items-center gap-3 px-5 py-3.5 text-sm font-medium text-gray-900 hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <Heart size={18} className="text-gray-600" />
                  <span>My Wish List</span>
                </button>
              </div>
            </div>
          )}

          {/* Sub-menu Level 1: Split Poster */}
          {currentLevel === 'split_poster' && (
            <div className="flex flex-col divide-y divide-gray-100 text-left">
              <button
                onClick={() => handleCategoryClick(null)}
                className="w-full text-left px-5 py-3.5 text-sm font-semibold text-gray-950 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Go To Split Poster
              </button>

              {[
                { label: 'Anime Split Poster', cat: 'Anime & Gaming' },
                { label: 'Superhero Split Poster', cat: 'Superhero' },
                { label: 'Supercar Split Poster', cat: 'Supercars' },
                { label: 'Superbike Split Poster', cat: 'Superbike' },
                { label: 'Cricket Split Poster', cat: 'Cricket' },
                { label: 'Devotional Split Poster', cat: 'Devotional' },
                { label: 'Gym & Fitness Split Poster', cat: 'Gym & Fitness' },
                { label: 'Music & Bands Split Poster', cat: 'Music' }
              ].map((sub) => (
                <button
                  key={sub.label}
                  onClick={() => handleCategoryClick(sub.cat)}
                  className="w-full text-left px-5 py-3.5 text-sm font-medium text-gray-900 hover:bg-gray-50 hover:text-black transition-colors cursor-pointer"
                >
                  {sub.label}
                </button>
              ))}
            </div>
          )}

          {/* Sub-menu Level 1: Posters */}
          {currentLevel === 'posters' && (
            <div className="flex flex-col divide-y divide-gray-100 text-left">
              <button
                onClick={() => handleCategoryClick(null)}
                className="w-full text-left px-5 py-3.5 text-sm font-semibold text-gray-950 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Go To Posters
              </button>

              {[
                { label: 'Anime & Gaming Posters', cat: 'Anime & Gaming' },
                { label: 'Superhero Posters', cat: 'Superhero' },
                { label: 'Supercars Posters', cat: 'Supercars' },
                { label: 'Superbike Posters', cat: 'Superbike' },
                { label: 'Cricket Posters', cat: 'Cricket' },
                { label: 'Devotional Posters', cat: 'Devotional' },
                { label: 'Gym & Fitness Posters', cat: 'Gym & Fitness' },
                { label: 'Music Posters', cat: 'Music' }
              ].map((sub) => (
                <button
                  key={sub.label}
                  onClick={() => handleCategoryClick(sub.cat)}
                  className="w-full text-left px-5 py-3.5 text-sm font-medium text-gray-900 hover:bg-gray-50 hover:text-black transition-colors cursor-pointer"
                >
                  {sub.label}
                </button>
              ))}
            </div>
          )}

          {/* Sub-menu Level 1: Collage/Block Kits matching exact reference image media_1790514343537.png */}
          {currentLevel === 'collage_kits' && (
            <div className="flex flex-col divide-y divide-gray-100 text-left">
              <button
                onClick={() => handleCategoryClick('Collage/Block Kits')}
                className="w-full text-left px-5 py-3.5 text-sm font-semibold text-gray-955 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Go To Collage/Block Kits
              </button>

              {[
                'Cricket Collage/Block Kits',
                'Football Collage/Block Kits',
                'God Collage/Block Kits',
                'F1 Collage/Block Kits',
                'Anime Collage/Block Kits',
                'Supercar Collage/Block Kits',
                'Movies Collage/Block Kits',
                'Motivation Collage/Block Kits'
              ].map((kit) => (
                <button
                  key={kit}
                  onClick={() => handleCategoryClick(kit)}
                  className="w-full text-left px-5 py-3.5 text-sm font-medium text-gray-900 hover:bg-gray-50 hover:text-black transition-colors cursor-pointer"
                >
                  {kit}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

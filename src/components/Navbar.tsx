import React, { useState, useEffect } from 'react';
import { Search, ShoppingBag, Heart, User, Sun, Moon, Menu, X } from 'lucide-react';
import logoPng from '../assets/logo.png';

interface NavbarProps {
  onSearch: (query: string) => void;
  cartCount: number;
  wishlistCount: number;
  onProfileClick?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onSearch, cartCount, wishlistCount, onProfileClick }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [darkMode, setDarkMode] = useState(() => {
    return document.documentElement.classList.contains('dark') || 
      (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'glass shadow-sm py-3' 
        : 'bg-transparent border-b border-gray-100 dark:border-zinc-900 py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          
          {/* Mobile Menu & Search Toggle (Pixel-perfect aligned with Category images left edge) */}
          <div className="flex items-center gap-1.5 md:hidden ml-1">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
            <button 
              onClick={() => onSearch('')}
              className="p-1.5 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
              aria-label="Search"
            >
              <Search size={20} />
            </button>
          </div>

          {/* PrintOkiyo Brand Logo */}
          <a href="#" className="flex-shrink-0 flex items-center">
            <img 
              src={logoPng} 
              alt="PrintOkiyo" 
              className="h-12 sm:h-16 w-auto max-h-20 object-contain"
            />
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-6 lg:space-x-8 text-sm font-medium text-gray-600 dark:text-gray-300">
            <a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Shop</a>
            <a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Categories</a>
            <a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">New Arrivals</a>
            <a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Best Sellers</a>
            <a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">About</a>
            <a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Contact</a>
          </nav>

          {/* Right Section: Search & Actions */}
          <div className="flex items-center gap-2 sm:gap-4 flex-1 md:flex-initial justify-end">
            
            {/* Search Bar - Desktop */}
            <form onSubmit={handleSearchSubmit} className="hidden lg:flex items-center relative">
              <input
                type="text"
                placeholder="Search premium prints..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-48 xl:w-64 bg-gray-100 dark:bg-zinc-800 text-xs text-gray-900 dark:text-white pl-4 pr-10 py-2 rounded-full focus:outline-none focus:ring-1 focus:ring-gray-400 dark:focus:ring-zinc-600 focus:w-64 transition-all duration-300"
              />
              <button type="submit" className="absolute right-3 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                <Search size={14} />
              </button>
            </form>

            {/* Dark Mode Toggle */}
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
              aria-label="Toggle theme"
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Account Icon */}
            <button 
              onClick={onProfileClick}
              className="p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
              aria-label="Account"
            >
              <User size={18} />
            </button>

            {/* Wishlist Icon */}
            <a 
              href="#" 
              className="p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full transition-colors relative"
              aria-label="Wishlist"
            >
              <Heart size={18} />
              {wishlistCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-[9px] font-bold leading-none text-white bg-red-500 rounded-full">
                  {wishlistCount}
                </span>
              )}
            </a>

            {/* Cart Icon */}
            <a 
              href="#" 
              className="p-2 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full transition-colors relative"
              aria-label="Cart"
            >
              <ShoppingBag size={18} />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-[9px] font-bold leading-none text-white bg-[#b47965] rounded-full">
                  {cartCount}
                </span>
              )}
            </a>

          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden glass border-b border-gray-200 dark:border-zinc-800 absolute top-full left-0 w-full shadow-lg py-4 px-6 animate-in fade-in slide-in-from-top-5 duration-200">
          {/* Search form for mobile */}
          <form onSubmit={handleSearchSubmit} className="flex items-center relative mb-4">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-100 dark:bg-zinc-800 text-sm text-gray-900 dark:text-white pl-4 pr-10 py-2.5 rounded-xl focus:outline-none"
            />
            <button type="submit" className="absolute right-3 text-gray-500 dark:text-gray-400">
              <Search size={16} />
            </button>
          </form>

          <nav className="flex flex-col space-y-4 font-medium text-gray-700 dark:text-gray-200">
            <a href="#" className="hover:text-gray-900 dark:hover:text-white" onClick={() => setMobileMenuOpen(false)}>Shop All</a>
            <a href="#" className="hover:text-gray-900 dark:hover:text-white" onClick={() => setMobileMenuOpen(false)}>Categories</a>
            <a href="#" className="hover:text-gray-900 dark:hover:text-white" onClick={() => setMobileMenuOpen(false)}>New Arrivals</a>
            <a href="#" className="hover:text-gray-900 dark:hover:text-white" onClick={() => setMobileMenuOpen(false)}>Best Sellers</a>
            <a href="#" className="hover:text-gray-900 dark:hover:text-white" onClick={() => setMobileMenuOpen(false)}>About Us</a>
            <a href="#" className="hover:text-gray-900 dark:hover:text-white" onClick={() => setMobileMenuOpen(false)}>Contact</a>
          </nav>
        </div>
      )}
    </header>
  );
};

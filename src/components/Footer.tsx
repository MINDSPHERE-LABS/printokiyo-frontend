import React from 'react';
import { Github, Instagram, Twitter, Mail, HelpCircle } from 'lucide-react';
import logoPng from '../assets/logo.png';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#111111] dark:bg-[#0d0e12] text-[#8e8d91] dark:text-[#7f818c] text-xs pt-16 pb-8 border-t border-zinc-900 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12 pb-12 border-b border-zinc-800">
          
          {/* Brand Col */}
          <div className="md:col-span-2 lg:col-span-4 flex flex-col gap-4">
            <img 
              src={logoPng} 
              alt="PrintOkiyo" 
              className="h-10 w-auto object-contain brightness-0 invert"
            />
            <p className="text-xs leading-relaxed max-w-sm">
              Premium e-commerce storefront for high-grade posters, canvas wall prints, and custom frames in many sizes. We print with fade-resistant inks on archival paper to elevate your home, office, and living spaces.
            </p>
            <div className="flex gap-4 mt-2">
              <a href="#" className="hover:text-white transition-colors" aria-label="Instagram">
                <Instagram size={16} />
              </a>
              <a href="#" className="hover:text-white transition-colors" aria-label="Twitter">
                <Twitter size={16} />
              </a>
              <a href="#" className="hover:text-white transition-colors" aria-label="GitHub">
                <Github size={16} />
              </a>
            </div>
          </div>

          {/* Links Col 1: Shop */}
          <div className="lg:col-span-2 flex flex-col gap-3">
            <h4 className="text-white text-xs font-bold uppercase tracking-wider">Poster Categories</h4>
            <ul className="flex flex-col gap-2">
              <li><a href="#" className="hover:text-white transition-colors">Aesthetic Posters</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Canvas Wall Art</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Framed Fine Art</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Custom Photo Prints</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Anime & Movie Posters</a></li>
            </ul>
          </div>

          {/* Links Col 2: Brand */}
          <div className="lg:col-span-2 flex flex-col gap-3">
            <h4 className="text-white text-xs font-bold uppercase tracking-wider">Our Brand</h4>
            <ul className="flex flex-col gap-2">
              <li><a href="#" className="hover:text-white transition-colors">Printing Process</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Archival Paper Quality</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Custom Framing Options</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Bulk & Corporate Orders</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Art Gallery Blog</a></li>
            </ul>
          </div>

          {/* Links Col 3: Support */}
          <div className="lg:col-span-2 flex flex-col gap-3">
            <h4 className="text-white text-xs font-bold uppercase tracking-wider">Support</h4>
            <ul className="flex flex-col gap-2">
              <li><a href="#" className="hover:text-white transition-colors">Order Tracking</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Shipping & Returns</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Poster Care Guide</a></li>
              <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact Support</a></li>
            </ul>
          </div>

          {/* Contact Col */}
          <div className="lg:col-span-2 flex flex-col gap-3">
            <h4 className="text-white text-xs font-bold uppercase tracking-wider">Contact Info</h4>
            <ul className="flex flex-col gap-2.5">
              <li className="flex items-center gap-2">
                <Mail size={12} />
                <a href="mailto:support@printokiyo.com" className="hover:text-white transition-colors">support@printokiyo.com</a>
              </li>
              <li className="flex items-center gap-2">
                <HelpCircle size={12} />
                <span>On-Demand Poster Studio</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Lower Footer */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] uppercase tracking-wider font-semibold">
          <span>&copy; {new Date().getFullYear()} PrintOkiyo. All rights reserved.</span>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Accessibility</a>
          </div>
        </div>

      </div>
    </footer>
  );
};

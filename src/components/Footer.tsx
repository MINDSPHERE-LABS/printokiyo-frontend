import React from 'react';
import { Mail, Facebook, Instagram } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#111111] text-white text-xs select-none border-t border-zinc-900">
      {/* Main Footer Body */}
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
          
          {/* Column 1: DISCLAIMER & EMAIL & SOCIAL */}
          <div className="md:col-span-6 lg:col-span-6 flex flex-col gap-4 text-left">
            <h3 className="text-[#e2b04c] text-sm md:text-base font-black uppercase tracking-wider">
              DISCLAIMER
            </h3>
            <p className="text-gray-300 text-xs sm:text-sm leading-relaxed max-w-lg font-normal">
              All artworks posted on this website is intended as fan art and is not purported to be official merchandise unless indicated otherwise. If you have any issues regarding the artwork, contact us.
            </p>

            <div className="flex flex-col gap-2 mt-1">
              <a 
                href="mailto:support@printokiyo.com" 
                className="flex items-center gap-2.5 text-gray-200 hover:text-[#e2b04c] transition-colors text-xs sm:text-sm font-semibold group"
              >
                <Mail size={15} className="text-[#e2b04c]" />
                <span className="underline underline-offset-2">support@printokiyo.com</span>
              </a>
            </div>

            {/* FOLLOW US ON */}
            <div className="mt-4 flex flex-col gap-3">
              <h4 className="text-[#e2b04c] text-xs font-black uppercase tracking-wider">
                FOLLOW US ON
              </h4>
              <div className="flex items-center gap-3">
                <a 
                  href="#" 
                  aria-label="Facebook"
                  className="w-8.5 h-8.5 rounded-full bg-white text-black flex items-center justify-center hover:bg-[#e2b04c] transition-colors shadow-xs"
                >
                  <Facebook size={16} fill="currentColor" />
                </a>
                <a 
                  href="#" 
                  aria-label="Instagram"
                  className="w-8.5 h-8.5 rounded-full bg-white text-black flex items-center justify-center hover:bg-[#e2b04c] transition-colors shadow-xs"
                >
                  <Instagram size={16} />
                </a>
              </div>
            </div>
          </div>

          {/* Column 2: USEFUL LINKS */}
          <div className="md:col-span-3 lg:col-span-3 flex flex-col gap-3 text-left">
            <h3 className="text-[#e2b04c] text-sm md:text-base font-black uppercase tracking-wider">
              USEFUL LINKS
            </h3>
            <ul className="flex flex-col gap-2.5 text-xs sm:text-sm font-medium text-gray-300">
              <li><a href="#" className="hover:text-[#e2b04c] transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-[#e2b04c] transition-colors">Terms Of Service</a></li>
              <li><a href="#" className="hover:text-[#e2b04c] transition-colors">Shipping Policy</a></li>
              <li><a href="#" className="hover:text-[#e2b04c] transition-colors">Refund Policy</a></li>
              <li><a href="#" className="hover:text-[#e2b04c] transition-colors">Cancel Order</a></li>
              <li><a href="#" className="hover:text-[#e2b04c] transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-[#e2b04c] transition-colors">Refund</a></li>
            </ul>
          </div>

          {/* Column 3: MAIN MENU */}
          <div className="md:col-span-3 lg:col-span-3 flex flex-col gap-3 text-left">
            <h3 className="text-[#e2b04c] text-sm md:text-base font-black uppercase tracking-wider">
              MAIN MENU
            </h3>
            <ul className="flex flex-col gap-2.5 text-xs sm:text-sm font-medium text-gray-300">
              <li><a href="#" className="hover:text-[#e2b04c] transition-colors">Split Poster</a></li>
              <li><a href="#" className="hover:text-[#e2b04c] transition-colors">Posters</a></li>
              <li><a href="#" className="hover:text-[#e2b04c] transition-colors">Wall Sets</a></li>
              <li><a href="#" className="hover:text-[#e2b04c] transition-colors">Collage/Block Kits</a></li>
              <li><a href="#" className="hover:text-[#e2b04c] transition-colors">Customization</a></li>
              <li><a href="#" className="hover:text-[#e2b04c] transition-colors">Happy Customers</a></li>
              <li><a href="#" className="hover:text-[#e2b04c] transition-colors">Support</a></li>
            </ul>
          </div>

        </div>
      </div>

      {/* Sleek Dark Bottom Payment & Copyright Bar */}
      <div className="w-full bg-[#0a0a0b] py-5 px-4 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4 max-w-7xl mx-auto">
        <span className="text-gray-400 text-[11px] font-medium tracking-wide">
          &copy; {new Date().getFullYear()} PrintOkiyo. All rights reserved.
        </span>

        {/* Payment Methods */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* VISA */}
          <div className="bg-[#142680] text-white px-2.5 py-1 rounded text-[10px] font-black italic tracking-widest uppercase shadow-xs">
            VISA
          </div>
          {/* Mastercard */}
          <div className="bg-[#1e1e1e] text-white px-2.5 py-1 rounded text-[9px] font-bold flex items-center gap-1 shadow-xs border border-zinc-800">
            <span className="w-3 h-3 rounded-full bg-[#eb001b] inline-block -mr-2 opacity-90" />
            <span className="w-3 h-3 rounded-full bg-[#f79e1b] inline-block opacity-90" />
          </div>
          {/* AMEX */}
          <div className="bg-[#006fcf] text-white px-2.5 py-1 rounded text-[9px] font-black tracking-wider uppercase shadow-xs">
            AMEX
          </div>
          {/* Apple Pay */}
          <div className="bg-white text-black px-2.5 py-1 rounded text-[9px] font-black flex items-center gap-1 shadow-xs">
             Pay
          </div>
          {/* Google Pay */}
          <div className="bg-white text-gray-800 px-2.5 py-1 rounded text-[9px] font-bold flex items-center gap-1 shadow-xs">
            <span className="text-[#4285F4] font-black">G</span> Pay
          </div>
        </div>
      </div>
    </footer>
  );
};

import React from 'react';
import logoPng from '../assets/logo.png';

interface BrandBufferProps {
  fullScreen?: boolean;
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const BrandBuffer: React.FC<BrandBufferProps> = ({
  fullScreen = false,
  message = 'Connecting securely...',
  size = 'md'
}) => {
  const logoSizes = {
    sm: 'h-7 sm:h-8 max-w-[140px]',
    md: 'h-10 sm:h-12 max-w-[210px]',
    lg: 'h-13 sm:h-15 max-w-[270px]'
  };

  const loaderContent = (
    <div className="flex flex-col items-center justify-center gap-5 select-none p-6 animate-in fade-in duration-300">
      {/* Logo container with ambient glow and sweeping flow sheen effect (No circle spinner) */}
      <div className="relative flex items-center justify-center">
        {/* Soft Multi-Color Ambient Fluid Aura matching PrintOkiyo brand colors */}
        <div 
          className="absolute -inset-5 rounded-3xl bg-gradient-to-r from-cyan-400/25 via-pink-500/20 to-amber-400/25 blur-2xl animate-subtle-glow pointer-events-none" 
        />

        {/* Clean Logo Card with Flowing Sheen Light Effect */}
        <div className="relative z-10 px-6 py-3.5 rounded-2xl bg-white/95 backdrop-blur-md border border-gray-100 shadow-[0_10px_35px_rgba(0,0,0,0.06)] overflow-hidden flex items-center justify-center">
          {/* PrintOkiyo Multi-Color Brand Logo */}
          <img 
            src={logoPng} 
            alt="PrintOkiyo" 
            className={`${logoSizes[size]} w-auto object-contain transition-transform`} 
          />

          {/* Sweeping Radiant Flow Sheen that continuously flows across the logo */}
          <div 
            className="absolute inset-y-0 w-3/5 bg-gradient-to-r from-transparent via-white/85 to-transparent pointer-events-none animate-shimmer-flow" 
          />
        </div>
      </div>

      {/* Modern Liquid Flow Bar & Status Text */}
      <div className="flex flex-col items-center gap-3 text-center">
        {/* Sleek Liquid Flow Progress Bar */}
        <div className="relative w-44 sm:w-52 h-1 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className="absolute inset-y-0 w-24 rounded-full bg-gradient-to-r from-cyan-500 via-pink-500 to-amber-400 animate-track-flow shadow-[0_0_10px_rgba(6,182,212,0.5)]" 
          />
        </div>

        {/* Status Message */}
        {message && (
          <p className="text-[10px] sm:text-[11px] font-extrabold text-gray-500 tracking-[0.22em] uppercase animate-pulse">
            {message}
          </p>
        )}
      </div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 bg-white/95 backdrop-blur-md flex items-center justify-center transition-all duration-300">
        {loaderContent}
      </div>
    );
  }

  return loaderContent;
};

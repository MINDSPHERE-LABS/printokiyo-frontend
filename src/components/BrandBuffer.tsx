import React from 'react';
import logoPng from '../assets/logo.png';

interface BrandBufferProps {
  fullScreen?: boolean;
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const BrandBuffer: React.FC<BrandBufferProps> = ({
  fullScreen = false,
  message = 'Buffering premium posters...',
  size = 'md'
}) => {
  const logoSizes = {
    sm: 'h-8 sm:h-9',
    md: 'h-10 sm:h-12',
    lg: 'h-14 sm:h-16'
  };

  const containerSizes = {
    sm: 'w-20 h-20',
    md: 'w-28 h-28',
    lg: 'w-36 h-36'
  };

  const loaderContent = (
    <div className="flex flex-col items-center justify-center gap-3 select-none p-4 animate-in fade-in duration-300">
      {/* Brand logo container with dual spinning buffer rings */}
      <div className={`relative flex items-center justify-center ${containerSizes[size]}`}>
        {/* Outer Pulsing Ambient Glow */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500/20 to-indigo-600/20 animate-ping opacity-25" />

        {/* Primary Outer Spinner Ring */}
        <div 
          className="absolute inset-0 rounded-full border-3 border-transparent border-t-[#041E42] border-r-[#041E42]/30 animate-spin" 
          style={{ animationDuration: '0.85s' }} 
        />

        {/* Secondary Inner Counter-Spinner Ring */}
        <div 
          className="absolute inset-2 rounded-full border-2 border-transparent border-b-cyan-500 border-l-cyan-300 animate-spin opacity-80" 
          style={{ animationDuration: '1.3s', animationDirection: 'reverse' }} 
        />

        {/* Centered Brand Logo */}
        <div className="relative z-10 p-2.5 bg-white/90 backdrop-blur-xs rounded-2xl shadow-2xs flex items-center justify-center">
          <img 
            src={logoPng} 
            alt="PrintOkiyo" 
            className={`${logoSizes[size]} w-auto object-contain animate-pulse`} 
          />
        </div>
      </div>

      {/* Styled PRINTOKIYO Buffer Title */}
      <div className="flex flex-col items-center gap-1 text-center">
        <div className="flex items-center gap-1">
          <span className="text-xs sm:text-sm font-display font-black uppercase tracking-[0.25em] text-[#041E42]">
            PRINT<span className="text-cyan-600">OKIYO</span>
          </span>
        </div>

        {/* Animated Buffering Dots */}
        <div className="flex items-center gap-1.5 my-0.5">
          <div className="w-1.5 h-1.5 rounded-full bg-[#041E42] animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-1.5 h-1.5 rounded-full bg-cyan-600 animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-1.5 h-1.5 rounded-full bg-[#041E42] animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>

        {message && (
          <p className="text-[10px] sm:text-xs font-semibold text-gray-500 tracking-wide uppercase">
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

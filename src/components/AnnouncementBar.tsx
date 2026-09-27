import React, { useEffect, useState } from 'react';
import { Flame, Clock } from 'lucide-react';

export const AnnouncementBar: React.FC = () => {
  // Fresh countdown starting from 2 hours 15 minutes (8100 seconds) on every page open / refresh
  const INITIAL_TIME = 2 * 3600 + 15 * 60; // 2 hours 15 minutes
  const [timeLeft, setTimeLeft] = useState<number>(INITIAL_TIME);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          return INITIAL_TIME; // Auto-reset when reaching zero to keep urgency infinite
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const pad = (n: number) => n.toString().padStart(2, '0');
    return { hours: pad(hours), minutes: pad(minutes), seconds: pad(seconds) };
  };

  const { hours, minutes, seconds } = formatTime(timeLeft);

  return (
    <div className="bg-black text-white text-xs font-medium py-2 px-3 sm:px-4 select-none border-b border-zinc-800 flex items-center justify-center overflow-hidden relative z-50 whitespace-nowrap">
      {/* Subtle ambient gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-red-950/40 via-amber-950/20 to-red-950/40 pointer-events-none" />

      {/* One-liner flex container */}
      <div className="relative flex items-center justify-center gap-2 sm:gap-3 text-xs">
        {/* Flash Sale Badge */}
        <span className="inline-flex items-center gap-1 bg-red-600 text-white text-[10px] sm:text-[11px] uppercase tracking-wider font-black px-2.5 py-0.5 rounded-full animate-pulse flex-shrink-0">
          <Flame size={12} className="fill-white" />
          <span>Flash Sale</span>
        </span>

        {/* Text message */}
        <span className="font-semibold text-zinc-200 text-[11px] sm:text-xs">
          Special Discounts End In:
        </span>

        {/* Live Timer (HH : MM : SS) */}
        <div className="inline-flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 rounded-md px-2.5 py-0.5 text-zinc-200 font-mono text-[11px] sm:text-xs shadow-inner flex-shrink-0">
          <Clock size={12} className="text-red-400" />
          <div className="flex items-center gap-1 font-bold tracking-wider text-amber-400">
            <span>{hours}h</span>
            <span className="text-zinc-500 animate-pulse">:</span>
            <span>{minutes}m</span>
            <span className="text-zinc-500 animate-pulse">:</span>
            <span>{seconds}s</span>
          </div>
        </div>
      </div>
    </div>
  );
};



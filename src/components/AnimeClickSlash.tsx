import React, { useState, useEffect } from 'react';

interface SlashEffect {
  id: number;
  x: number;
  y: number;
}

export const AnimeClickSlash: React.FC = () => {
  const [slashes, setSlashes] = useState<SlashEffect[]>([]);

  useEffect(() => {
    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      let clientX = 0;
      let clientY = 0;

      if ('touches' in e && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else if ('clientX' in e) {
        clientX = (e as MouseEvent).clientX;
        clientY = (e as MouseEvent).clientY;
      } else {
        return;
      }

      const newSlash: SlashEffect = {
        id: Date.now() + Math.random(),
        x: clientX,
        y: clientY,
      };

      setSlashes((prev) => [...prev.slice(-8), newSlash]);

      // Automatically clean up after animation finishes (400ms)
      setTimeout(() => {
        setSlashes((prev) => prev.filter((s) => s.id !== newSlash.id));
      }, 400);
    };

    window.addEventListener('pointerdown', handlePointerDown);
    return () => {
      window.removeEventListener('pointerdown', handlePointerDown);
    };
  }, []);

  if (slashes.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden select-none">
      {slashes.map((slash) => (
        <div
          key={slash.id}
          className="absolute"
          style={{ left: `${slash.x}px`, top: `${slash.y}px` }}
        >
          {/* Red Energy Slash Line (Tilted -35deg) */}
          <div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-36 sm:w-48 h-1 sm:h-1.5 rounded-full animate-anime-slash-red"
            style={{
              background: 'linear-gradient(90deg, transparent 0%, #ff0055 30%, #ffffff 50%, #ff0055 70%, transparent 100%)',
              boxShadow: '0 0 12px #ff0055, 0 0 24px #ff0055, 0 0 36px #ff0055',
            }}
          />

          {/* Electric Blue Energy Slash Line (Tilted 45deg) */}
          <div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-36 sm:w-48 h-1 sm:h-1.5 rounded-full animate-anime-slash-blue"
            style={{
              background: 'linear-gradient(90deg, transparent 0%, #00f0ff 30%, #ffffff 50%, #00f0ff 70%, transparent 100%)',
              boxShadow: '0 0 12px #00f0ff, 0 0 24px #00f0ff, 0 0 36px #00f0ff',
            }}
          />

          {/* Center Slash Intersection Energy Spark Burst */}
          <div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white animate-anime-slash-spark"
            style={{
              boxShadow: '0 0 20px #ffffff, 0 0 35px #00f0ff, 0 0 35px #ff0055',
            }}
          />
        </div>
      ))}
    </div>
  );
};

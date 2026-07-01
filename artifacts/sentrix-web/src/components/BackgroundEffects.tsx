import React from 'react';

/* Pixel flowers — green palette */
const FLOWERS = [
  { x: 8,  y: 12, color: '#4ade80', size: 3, delay: '0s',   dur: '6s'   },
  { x: 88, y: 8,  color: '#22c55e', size: 4, delay: '1.2s', dur: '7s'   },
  { x: 22, y: 78, color: '#86efac', size: 3, delay: '2.1s', dur: '5.5s' },
  { x: 75, y: 82, color: '#4ade80', size: 4, delay: '0.7s', dur: '8s'   },
  { x: 50, y: 6,  color: '#16a34a', size: 3, delay: '1.8s', dur: '6.5s' },
  { x: 94, y: 50, color: '#86efac', size: 3, delay: '3s',   dur: '7s'   },
  { x: 5,  y: 50, color: '#22c55e', size: 4, delay: '0.4s', dur: '9s'   },
  { x: 35, y: 90, color: '#4ade80', size: 3, delay: '2.6s', dur: '6s'   },
  { x: 65, y: 20, color: '#86efac', size: 3, delay: '1.5s', dur: '7.5s' },
  { x: 15, y: 35, color: '#22c55e', size: 4, delay: '0.9s', dur: '8.5s' },
  { x: 80, y: 65, color: '#4ade80', size: 3, delay: '3.3s', dur: '5s'   },
  { x: 42, y: 55, color: '#16a34a', size: 3, delay: '1.1s', dur: '9.5s' },
  { x: 58, y: 45, color: '#86efac', size: 4, delay: '2.4s', dur: '7s'   },
  { x: 28, y: 20, color: '#4ade80', size: 3, delay: '0.6s', dur: '6.5s' },
  { x: 92, y: 28, color: '#22c55e', size: 3, delay: '1.9s', dur: '8s'   },
  { x: 12, y: 65, color: '#86efac', size: 4, delay: '3.5s', dur: '5.5s' },
];

const STARS = [
  { x: 18, y: 22, delay: '0s',   dur: '3s'   },
  { x: 72, y: 14, delay: '0.8s', dur: '4s'   },
  { x: 45, y: 38, delay: '1.5s', dur: '2.5s' },
  { x: 85, y: 72, delay: '2s',   dur: '3.5s' },
  { x: 30, y: 60, delay: '0.3s', dur: '4.5s' },
  { x: 60, y: 88, delay: '1.1s', dur: '3s'   },
  { x: 90, y: 40, delay: '2.7s', dur: '2.8s' },
  { x: 6,  y: 80, delay: '1.8s', dur: '3.8s' },
  { x: 52, y: 72, delay: '0.5s', dur: '4.2s' },
  { x: 78, y: 30, delay: '3.1s', dur: '2.5s' },
  { x: 24, y: 45, delay: '1.4s', dur: '5s'   },
  { x: 67, y: 55, delay: '2.2s', dur: '3.2s' },
  { x: 38, y: 8,  delay: '0.9s', dur: '4s'   },
  { x: 10, y: 90, delay: '3.5s', dur: '3s'   },
  { x: 82, y: 90, delay: '0.7s', dur: '4.8s' },
  { x: 55, y: 25, delay: '2.5s', dur: '3.5s' },
  { x: 40, y: 78, delay: '1.7s', dur: '2.8s' },
  { x: 96, y: 15, delay: '0.2s', dur: '5s'   },
  { x: 20, y: 5,  delay: '3.8s', dur: '3s'   },
  { x: 70, y: 42, delay: '1.3s', dur: '4.2s' },
];

interface FlowerProps { x: number; y: number; color: string; size: number; delay: string; dur: string; }
function PixelFlower({ x, y, color, size: s, delay, dur }: FlowerProps) {
  return (
    <g transform={`translate(${x * 10}, ${y * 10})`}
       style={{ animation: `bg-bloom ${dur} ${delay} ease-in-out infinite` }}>
      <rect x={0}  y={-s} width={s} height={s} fill={color} opacity={0.65} />
      <rect x={0}  y={s}  width={s} height={s} fill={color} opacity={0.65} />
      <rect x={-s} y={0}  width={s} height={s} fill={color} opacity={0.65} />
      <rect x={s}  y={0}  width={s} height={s} fill={color} opacity={0.65} />
      <rect x={0}  y={0}  width={s} height={s} fill="#fbbf24" opacity={0.9} />
    </g>
  );
}

interface StarProps { x: number; y: number; delay: string; dur: string; }
function PixelStar({ x, y, delay, dur }: StarProps) {
  return (
    <g transform={`translate(${x * 10}, ${y * 10})`}
       style={{ animation: `bg-twinkle ${dur} ${delay} ease-in-out infinite` }}>
      <rect x={1} y={0} width={2} height={2} fill="#bbf7d0" opacity={0.55} />
      <rect x={0} y={1} width={2} height={2} fill="#bbf7d0" opacity={0.55} />
      <rect x={2} y={1} width={2} height={2} fill="#bbf7d0" opacity={0.55} />
      <rect x={1} y={2} width={2} height={2} fill="#bbf7d0" opacity={0.55} />
    </g>
  );
}

export function BackgroundEffects() {
  return (
    <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden">
      {/* Base */}
      <div className="absolute inset-0" style={{ background: 'hsl(150 20% 7%)' }} />

      {/* Dot grid */}
      <div className="absolute inset-0 opacity-[0.022]" style={{
        backgroundImage: 'radial-gradient(circle, hsl(142 76% 45% / 0.7) 1px, transparent 1px)',
        backgroundSize: '32px 32px',
      }} />

      {/* Ambient glows */}
      <div className="absolute top-[-15%] left-[28%] w-[640px] h-[640px] rounded-full pointer-events-none"
           style={{ background: 'radial-gradient(circle, hsl(142 76% 45% / 0.055) 0%, transparent 65%)' }} />
      <div className="absolute bottom-[-8%] right-[8%] w-[380px] h-[380px] rounded-full pointer-events-none"
           style={{ background: 'radial-gradient(circle, hsl(160 60% 38% / 0.04) 0%, transparent 65%)' }} />
      <div className="absolute top-[45%] left-[-4%] w-[280px] h-[280px] rounded-full pointer-events-none"
           style={{ background: 'radial-gradient(circle, hsl(142 76% 30% / 0.04) 0%, transparent 65%)' }} />

      {/* Pixel garden SVG */}
      <svg viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid slice"
           className="absolute inset-0 w-full h-full" aria-hidden="true">
        <defs>
          <style>{`
            @keyframes bg-bloom {
              0%, 100% { transform: scale(1) rotate(0deg); }
              50%       { transform: scale(1.1) rotate(4deg); }
            }
            @keyframes bg-twinkle {
              0%, 100% { opacity: 0.18; }
              50%       { opacity: 0.8;  }
            }
          `}</style>
        </defs>
        {FLOWERS.map((f, i) => <PixelFlower key={i} {...f} />)}
        {STARS.map((s, i)   => <PixelStar   key={i} {...s} />)}
      </svg>
    </div>
  );
}

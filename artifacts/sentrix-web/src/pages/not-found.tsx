import React from 'react';
import { Link } from 'wouter';

/* Pixel character — little guy standing */
function PixelCharacter() {
  return (
    <svg width="80" height="96" viewBox="0 0 10 12" fill="none" shapeRendering="crispEdges" aria-hidden="true">
      {/* head */}
      <rect x="3" y="0" width="4" height="4" fill="#4ade80"/>
      {/* eyes */}
      <rect x="4" y="1" width="1" height="1" fill="#052e16"/>
      <rect x="6" y="1" width="1" height="1" fill="#052e16"/>
      {/* mouth sad */}
      <rect x="4" y="3" width="3" height="1" fill="#052e16"/>
      <rect x="4" y="2" width="1" height="1" fill="#052e16"/>
      <rect x="6" y="2" width="1" height="1" fill="#052e16"/>
      {/* body */}
      <rect x="3" y="4" width="4" height="4" fill="#22c55e"/>
      {/* shield on chest */}
      <rect x="4" y="5" width="2" height="2" fill="#bbf7d0" opacity="0.6"/>
      {/* arms */}
      <rect x="1" y="4" width="2" height="3" fill="#22c55e"/>
      <rect x="7" y="4" width="2" height="3" fill="#22c55e"/>
      {/* legs */}
      <rect x="3" y="8" width="2" height="4" fill="#16a34a"/>
      <rect x="5" y="8" width="2" height="4" fill="#16a34a"/>
      {/* feet */}
      <rect x="2" y="11" width="3" height="1" fill="#4ade80"/>
      <rect x="5" y="11" width="3" height="1" fill="#4ade80"/>
    </svg>
  );
}

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">

      <div className="float-medium mb-6 relative">
        <div className="absolute inset-[-12px] rounded-full pointer-events-none"
             style={{ background: 'radial-gradient(circle, hsl(142 76% 45% / 0.12) 0%, transparent 70%)' }} />
        <PixelCharacter />
      </div>

      <div className="text-7xl md:text-8xl font-pixel text-gradient select-none leading-none mb-4"
           style={{ fontFamily: "'Press Start 2P', cursive" }}>
        404
      </div>

      <h2 className="text-xl font-semibold text-foreground mb-3">Page not found</h2>
      <p className="text-muted-foreground text-sm mb-10 max-w-xs leading-relaxed">
        This page doesn't exist. Maybe it was moved or the link is wrong.
      </p>

      <Link href="/"
            className="inline-block px-7 py-3 rounded-md pixel-btn-primary text-sm font-semibold">
        Go home
      </Link>
    </div>
  );
}

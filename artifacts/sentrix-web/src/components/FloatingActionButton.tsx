import React, { useEffect, useState } from 'react';

export function FloatingActionButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-6 right-6 w-11 h-11 rounded-lg bg-[hsl(148_22%_11%)] border border-[hsl(142_76%_45%/0.22)] text-primary flex items-center justify-center hover:bg-[hsl(142_76%_45%/0.12)] hover:border-[hsl(142_76%_45%/0.5)] transition-all duration-200 z-50 shadow-lg"
      aria-label="Back to top"
    >
      {/* pixel up arrow */}
      <svg viewBox="0 0 8 8" width="16" height="16" shapeRendering="crispEdges" fill="currentColor">
        <rect x="3" y="0" width="2" height="2"/>
        <rect x="1" y="2" width="6" height="2"/>
        <rect x="0" y="3" width="2" height="2" fill="transparent"/>
        <rect x="3" y="2" width="2" height="6"/>
      </svg>
    </button>
  );
}

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
      className="fixed bottom-6 right-6 w-11 h-11 rounded-lg bg-[hsl(240_35%_14%)] border border-[hsl(239_84%_73%/0.25)] text-primary flex items-center justify-center hover:bg-[hsl(239_84%_73%/0.15)] hover:border-[hsl(239_84%_73%/0.5)] transition-all duration-200 z-50 shadow-lg"
      aria-label="Back to top"
    >
      <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
        <rect x="7"  y="0" width="2" height="10" />
        <rect x="2"  y="4" width="2" height="2"  />
        <rect x="4"  y="2" width="2" height="2"  />
        <rect x="10" y="2" width="2" height="2"  />
        <rect x="12" y="4" width="2" height="2"  />
      </svg>
    </button>
  );
}

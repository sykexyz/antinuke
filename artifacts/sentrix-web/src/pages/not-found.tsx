import React from 'react';
import { Link } from 'wouter';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">

      <div className="float-slow mb-8">
        <svg width="80" height="80" viewBox="0 0 28 28" fill="none" aria-hidden="true" opacity="0.5">
          <rect x="12" y="0"  width="4" height="4" fill="#818cf8" />
          <rect x="8"  y="4"  width="4" height="4" fill="#c084fc" />
          <rect x="16" y="4"  width="4" height="4" fill="#c084fc" />
          <rect x="12" y="8"  width="4" height="4" fill="#fbbf24" />
          <rect x="8"  y="16" width="4" height="4" fill="#f472b6" />
          <rect x="12" y="16" width="4" height="4" fill="#f472b6" />
          <rect x="16" y="16" width="4" height="4" fill="#f472b6" />
          <rect x="12" y="20" width="4" height="4" fill="#c084fc" />
        </svg>
      </div>

      <div
        className="text-8xl md:text-9xl font-pixel text-gradient select-none leading-none mb-6"
        style={{ fontFamily: "'Press Start 2P', cursive" }}
      >
        404
      </div>

      <h2 className="text-xl font-semibold text-foreground mb-3">Page not found</h2>
      <p className="text-muted-foreground text-sm mb-10 max-w-xs">
        This page doesn't exist. Maybe it was moved, or the link is wrong.
      </p>

      <Link
        href="/"
        className="inline-block px-7 py-3 rounded-md pixel-btn-primary text-sm font-semibold"
      >
        Go home
      </Link>

    </div>
  );
}

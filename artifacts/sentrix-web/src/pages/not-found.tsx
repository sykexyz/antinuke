import React from 'react';
import { Link } from 'wouter';
import { CursorTrail } from "@/components/CursorTrail";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 relative">
      <CursorTrail />
      <div className="text-center z-10">
        <div className="text-[120px] font-pixel text-gradient glitch mb-4 select-none leading-none">404</div>
        <h2 className="text-2xl font-mono text-white mb-8 border-r-2 border-primary whitespace-nowrap overflow-hidden inline-block" style={{ animation: 'typing 2s steps(40, end), blink-caret .75s step-end infinite' }}>
          Directive not found.
        </h2>
        <br />
        <Link href="/" className="px-8 py-4 bg-primary/10 border border-primary text-primary font-bold tracking-widest text-sm hover:bg-primary hover:text-black transition-all inline-block neon-box-shadow">
          RETURN TO BASE
        </Link>
      </div>
    </div>
  );
}

import React from 'react';

export default function Developer() {
  return (
    <div className="pt-32 pb-20 px-4 min-h-[80vh] flex flex-col items-center justify-center">
      <h1 className="text-3xl md:text-5xl font-pixel text-gradient mb-12">DEVELOPER</h1>
      
      {/* Discord-style Profile Card */}
      <div className="w-full max-w-[340px] bg-[#111214] rounded-xl overflow-hidden shadow-[0_0_30px_rgba(0,255,65,0.1)] border border-[#1e1f22] relative group">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        
        {/* Banner */}
        <div className="h-[120px] bg-[#050f05] relative border-b border-primary/20">
          <div className="absolute inset-0 scanline opacity-20" />
          <div className="absolute inset-0 flex items-center justify-center opacity-30">
            <svg viewBox="0 0 100 100" className="w-32 h-32 text-primary" fill="currentColor">
              <path d="M50 5 L90 25 L90 60 L50 95 L10 60 L10 25 Z" fill="none" stroke="currentColor" strokeWidth="2" />
            </svg>
          </div>
        </div>

        {/* Avatar */}
        <div className="px-4 relative -mt-[40px] mb-3">
          <div className="w-[80px] h-[80px] rounded-full border-[6px] border-[#111214] bg-[#050f05] relative flex items-center justify-center">
            <span className="font-pixel text-2xl text-primary">S</span>
            <div className="absolute bottom-0 right-0 w-[20px] h-[20px] bg-green-500 rounded-full border-[4px] border-[#111214]" />
          </div>
        </div>

        {/* Content */}
        <div className="px-4 pb-4">
          <div className="mb-4">
            <h2 className="text-xl font-bold text-white leading-tight">sykw.exe</h2>
            <p className="text-sm text-gray-400">@sykw.exe</p>
          </div>

          <div className="mb-4">
            <div className="w-full h-[1px] bg-[#1e1f22] mb-4" />
            <h3 className="text-xs font-bold text-gray-400 uppercase mb-2">About Me</h3>
            <p className="text-sm text-gray-300 font-mono">
              Systems engineer. Building uncrackable defense mechanisms for Discord communities.
            </p>
          </div>

          <div className="mb-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase mb-2">Roles</h3>
            <div className="flex gap-2">
              <div className="flex items-center gap-1 bg-[#1e1f22] rounded px-2 py-1 text-xs text-primary font-mono border border-primary/20">
                <div className="w-2 h-2 rounded-full bg-primary" />
                Lead Developer
              </div>
            </div>
          </div>

          <button className="w-full py-2 bg-primary hover:bg-primary/90 text-black font-bold text-sm rounded transition-colors tracking-wide">
            Send Message
          </button>
        </div>
      </div>
    </div>
  );
}

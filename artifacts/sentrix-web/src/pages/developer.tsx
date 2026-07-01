import React from 'react';

export default function Developer() {
  return (
    <div className="pt-32 pb-24 px-4 min-h-[80vh] flex flex-col items-center justify-center">

      <div className="mb-10 text-center">
        <h1
          className="text-2xl md:text-3xl font-pixel text-gradient mb-3"
          style={{ fontFamily: "'Press Start 2P', cursive" }}
        >
          Developer
        </h1>
        <p className="text-muted-foreground text-sm">The person behind Sentrix.</p>
      </div>

      {/* Discord-style profile card */}
      <div className="w-full max-w-[340px] bg-[#111214] rounded-2xl overflow-hidden border border-[#2e3035] shadow-2xl relative">

        {/* Banner */}
        <div className="h-[100px] relative overflow-hidden" style={{
          background: 'linear-gradient(135deg, hsl(240 28% 12%) 0%, hsl(260 40% 16%) 50%, hsl(280 35% 14%) 100%)'
        }}>
          <svg viewBox="0 0 340 100" className="absolute inset-0 w-full h-full opacity-40" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
            {/* pixel stars in banner */}
            {[
              [20, 20], [80, 40], [140, 15], [200, 55], [260, 25], [310, 45],
              [50, 70], [120, 80], [180, 35], [240, 75], [300, 65], [160, 60],
            ].map(([x, y], i) => (
              <rect key={i} x={x} y={y} width="3" height="3" fill="#e0e7ff" opacity={0.5 + (i % 3) * 0.2} />
            ))}
            {/* pixel flowers */}
            <rect x="30"  y="12" width="4" height="4" fill="#f472b6" opacity="0.7" />
            <rect x="26"  y="16" width="4" height="4" fill="#f472b6" opacity="0.7" />
            <rect x="34"  y="16" width="4" height="4" fill="#f472b6" opacity="0.7" />
            <rect x="30"  y="20" width="4" height="4" fill="#f472b6" opacity="0.7" />
            <rect x="30"  y="16" width="4" height="4" fill="#fbbf24" opacity="0.9" />

            <rect x="290" y="55" width="4" height="4" fill="#818cf8" opacity="0.7" />
            <rect x="286" y="59" width="4" height="4" fill="#818cf8" opacity="0.7" />
            <rect x="294" y="59" width="4" height="4" fill="#818cf8" opacity="0.7" />
            <rect x="290" y="63" width="4" height="4" fill="#818cf8" opacity="0.7" />
            <rect x="290" y="59" width="4" height="4" fill="#fbbf24" opacity="0.9" />
          </svg>
        </div>

        {/* Avatar */}
        <div className="px-4 relative -mt-10 mb-3 flex items-end justify-between">
          <div className="w-20 h-20 rounded-full border-[5px] border-[#111214] bg-[hsl(240_35%_14%)] relative flex items-center justify-center overflow-hidden">
            <svg width="44" height="44" viewBox="0 0 28 28" fill="none" aria-hidden="true">
              <rect x="12" y="0"  width="4" height="4" fill="#818cf8" />
              <rect x="8"  y="4"  width="4" height="4" fill="#c084fc" />
              <rect x="16" y="4"  width="4" height="4" fill="#c084fc" />
              <rect x="4"  y="8"  width="4" height="4" fill="#818cf8" />
              <rect x="12" y="8"  width="4" height="4" fill="#fbbf24" />
              <rect x="20" y="8"  width="4" height="4" fill="#818cf8" />
              <rect x="4"  y="12" width="4" height="4" fill="#4ade80" />
              <rect x="8"  y="12" width="4" height="4" fill="#818cf8" />
              <rect x="16" y="12" width="4" height="4" fill="#818cf8" />
              <rect x="20" y="12" width="4" height="4" fill="#4ade80" />
              <rect x="8"  y="16" width="4" height="4" fill="#f472b6" />
              <rect x="12" y="16" width="4" height="4" fill="#f472b6" />
              <rect x="16" y="16" width="4" height="4" fill="#f472b6" />
              <rect x="12" y="20" width="4" height="4" fill="#c084fc" />
            </svg>
            <div className="absolute bottom-1 right-1 w-4 h-4 bg-[#4ade80] rounded-full border-2 border-[#111214]" />
          </div>
        </div>

        {/* Content */}
        <div className="px-4 pb-5">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-white leading-tight">sykw.exe</h2>
            <p className="text-sm text-[#b5bac1]">@sykw.exe</p>
          </div>

          <div className="w-full h-px bg-[#2e3035] my-4" />

          <div className="mb-4">
            <h3 className="text-xs font-semibold text-[#b5bac1] uppercase tracking-wide mb-2">About</h3>
            <p className="text-sm text-[#dbdee1] leading-relaxed">
              Building tools for Discord communities. Sentrix is my main project — a bot that actually does what it says.
            </p>
          </div>

          <div className="mb-5">
            <h3 className="text-xs font-semibold text-[#b5bac1] uppercase tracking-wide mb-2">Role</h3>
            <div className="inline-flex items-center gap-1.5 bg-[#1e2029] rounded-md px-2.5 py-1 text-xs text-[#818cf8] border border-[#818cf8]/25">
              <div className="w-2 h-2 rounded-full bg-[#818cf8]" />
              Lead Developer
            </div>
          </div>

          <div className="w-full h-px bg-[#2e3035] my-4" />

          <div className="flex gap-3 text-xs text-[#b5bac1]">
            <div>
              <span className="font-semibold text-white">74</span> commands built
            </div>
            <div>
              <span className="font-semibold text-white">10</span> event handlers
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

import React from 'react';

function SmallShield() {
  return (
    <svg width="36" height="42" viewBox="0 0 14 16" fill="none" shapeRendering="crispEdges" aria-hidden="true">
      <rect x="2"  y="0"  width="10" height="2"  fill="#4ade80"/>
      <rect x="0"  y="2"  width="2"  height="8"  fill="#4ade80"/>
      <rect x="12" y="2"  width="2"  height="8"  fill="#4ade80"/>
      <rect x="2"  y="2"  width="10" height="8"  fill="#16a34a"/>
      <rect x="0"  y="10" width="14" height="2"  fill="#4ade80"/>
      <rect x="2"  y="12" width="10" height="2"  fill="#4ade80"/>
      <rect x="4"  y="14" width="6"  height="2"  fill="#4ade80"/>
      <rect x="6"  y="15" width="2"  height="1"  fill="#4ade80"/>
      <rect x="2"  y="10" width="10" height="2"  fill="#16a34a"/>
      <rect x="4"  y="12" width="6"  height="2"  fill="#16a34a"/>
      <rect x="6"  y="14" width="2"  height="2"  fill="#22c55e"/>
      <rect x="3"  y="5"  width="2"  height="2"  fill="#bbf7d0"/>
      <rect x="5"  y="7"  width="2"  height="2"  fill="#bbf7d0"/>
      <rect x="7"  y="5"  width="2"  height="2"  fill="#bbf7d0"/>
      <rect x="9"  y="3"  width="2"  height="2"  fill="#bbf7d0"/>
    </svg>
  );
}

export default function Developer() {
  return (
    <div className="pt-32 pb-24 px-4 min-h-[80vh] flex flex-col items-center justify-center">

      <div className="mb-10 text-center">
        <h1 className="text-2xl md:text-3xl font-pixel text-gradient mb-3"
            style={{ fontFamily: "'Press Start 2P', cursive" }}>
          Developer
        </h1>
        <p className="text-muted-foreground text-sm">The person behind Sentrix.</p>
      </div>

      {/* Discord-style profile card */}
      <div className="w-full max-w-[340px] bg-[#111214] rounded-2xl overflow-hidden border border-[#2e3035] shadow-2xl relative">

        {/* Banner */}
        <div className="h-[100px] relative overflow-hidden" style={{
          background: 'linear-gradient(135deg, hsl(148 30% 10%) 0%, hsl(152 40% 14%) 50%, hsl(148 30% 12%) 100%)'
        }}>
          {/* pixel stars */}
          <svg viewBox="0 0 340 100" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
            {([
              [20,20],[80,40],[140,15],[200,55],[260,25],[310,45],
              [50,70],[120,80],[180,35],[240,75],[300,65],[160,60],
            ] as [number,number][]).map(([x,y],i) => (
              <rect key={i} x={x} y={y} width="2" height="2" fill="#bbf7d0" opacity={0.3 + (i%3)*0.15}/>
            ))}
            {/* small flowers in banner */}
            <rect x="28"  y="14" width="4" height="4" fill="#4ade80" opacity="0.6"/>
            <rect x="24"  y="18" width="4" height="4" fill="#4ade80" opacity="0.6"/>
            <rect x="32"  y="18" width="4" height="4" fill="#4ade80" opacity="0.6"/>
            <rect x="28"  y="22" width="4" height="4" fill="#4ade80" opacity="0.6"/>
            <rect x="28"  y="18" width="4" height="4" fill="#fbbf24" opacity="0.8"/>
            <rect x="290" y="58" width="4" height="4" fill="#22c55e" opacity="0.6"/>
            <rect x="286" y="62" width="4" height="4" fill="#22c55e" opacity="0.6"/>
            <rect x="294" y="62" width="4" height="4" fill="#22c55e" opacity="0.6"/>
            <rect x="290" y="66" width="4" height="4" fill="#22c55e" opacity="0.6"/>
            <rect x="290" y="62" width="4" height="4" fill="#fbbf24" opacity="0.8"/>
          </svg>
        </div>

        {/* Avatar */}
        <div className="px-4 relative -mt-10 mb-3 flex items-end justify-between">
          <div className="w-20 h-20 rounded-full border-[5px] border-[#111214] bg-[hsl(148_22%_12%)] relative flex items-center justify-center overflow-hidden">
            <SmallShield />
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
            <div className="inline-flex items-center gap-1.5 bg-[#1e2029] rounded-md px-2.5 py-1 text-xs text-[#4ade80] border border-[#4ade80]/25">
              <div className="w-2 h-2 rounded-full bg-[#4ade80]" />
              Lead Developer
            </div>
          </div>

          <div className="w-full h-px bg-[#2e3035] my-4" />

          <div className="flex gap-4 text-xs text-[#b5bac1]">
            <div><span className="font-semibold text-white">74</span> commands built</div>
            <div><span className="font-semibold text-white">10</span> event handlers</div>
          </div>
        </div>
      </div>
    </div>
  );
}

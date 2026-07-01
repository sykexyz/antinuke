import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'wouter';
import { useGetBotStats } from '@workspace/api-client-react';

const INVITE_LINK = "https://discord.com/oauth2/authorize?client_id=1521797977478271056";

/* ── Animated counter ── */
function AnimatedCounter({ end, duration = 1800 }: { end: number; duration?: number }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (end === 0) return;
    let start: number | null = null;
    const step = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      setCount(Math.floor((1 - Math.pow(1 - p, 3)) * end));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [end, duration]);
  return <span>{count.toLocaleString()}</span>;
}

/* ── Mouse-reactive pixel garden canvas ── */
function PixelGardenCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef  = useRef({ x: -999, y: -999 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const GRID   = 36;
    const COLORS = ['#4ade80', '#22c55e', '#86efac', '#16a34a', '#fbbf24'];

    type Particle = {
      gx: number; gy: number;
      ox: number; oy: number;
      color: string;
      phase: number; speed: number;
      vx: number; vy: number;
    };

    let particles: Particle[] = [];
    let W = 0, H = 0;
    let raf = 0;

    const resize = () => {
      W = canvas.width  = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
      particles = [];
      const cols = Math.ceil(W / GRID) + 1;
      const rows = Math.ceil(H / GRID) + 1;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if (Math.random() > 0.28) continue;
          particles.push({
            gx: c * GRID, gy: r * GRID,
            ox: c * GRID, oy: r * GRID,
            color: COLORS[Math.floor(Math.random() * COLORS.length)],
            phase: Math.random() * Math.PI * 2,
            speed: 0.4 + Math.random() * 0.6,
            vx: 0, vy: 0,
          });
        }
      }
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, W, H);
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      for (const p of particles) {
        const dx = p.ox - mx;
        const dy = p.oy - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const RADIUS = 90;

        const floatX = p.ox + Math.sin(t * 0.001 * p.speed + p.phase) * 3;
        const floatY = p.oy + Math.cos(t * 0.0008 * p.speed + p.phase) * 4;

        let tx = floatX, ty = floatY;
        if (dist < RADIUS) {
          const force = (1 - dist / RADIUS) * 22;
          tx = floatX + (dx / dist) * force;
          ty = floatY + (dy / dist) * force;
        }

        p.vx = (tx - p.gx) * 0.12;
        p.vy = (ty - p.gy) * 0.12;
        p.gx += p.vx;
        p.gy += p.vy;

        const alpha = 0.25 + 0.55 * Math.abs(Math.sin(t * 0.001 * p.speed + p.phase));

        /* pixel flower: 3×3 cross */
        ctx.fillStyle = p.color + Math.round(alpha * 255).toString(16).padStart(2, '0');
        ctx.fillRect(p.gx - 1, p.gy - 3, 2, 2); // top
        ctx.fillRect(p.gx - 1, p.gy + 1, 2, 2); // bottom
        ctx.fillRect(p.gx - 3, p.gy - 1, 2, 2); // left
        ctx.fillRect(p.gx + 1, p.gy - 1, 2, 2); // right
        ctx.fillStyle = '#fbbf24' + Math.round(alpha * 230).toString(16).padStart(2, '0');
        ctx.fillRect(p.gx - 1, p.gy - 1, 2, 2); // center
      }

      raf = requestAnimationFrame(draw);
    };

    const onMouse = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const onLeave = () => { mouseRef.current = { x: -999, y: -999 }; };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();
    raf = requestAnimationFrame(draw);
    canvas.addEventListener('mousemove', onMouse);
    canvas.addEventListener('mouseleave', onLeave);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      canvas.removeEventListener('mousemove', onMouse);
      canvas.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return (
    <canvas ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-auto opacity-60"
            style={{ imageRendering: 'pixelated' }} />
  );
}

/* ── Pixel security shield (large hero) ── */
function HeroShield() {
  return (
    <div className="float-slow relative">
      <div className="absolute inset-[-20px] rounded-full pointer-events-none"
           style={{ background: 'radial-gradient(circle, hsl(142 76% 45% / 0.15) 0%, transparent 70%)' }} />
      <svg width="96" height="112" viewBox="0 0 14 16" fill="none"
           className="shield-pulse" shapeRendering="crispEdges" aria-label="Sentrix shield">
        {/* outer border */}
        <rect x="2"  y="0"  width="10" height="2"  fill="#4ade80"/>
        <rect x="0"  y="2"  width="2"  height="8"  fill="#4ade80"/>
        <rect x="12" y="2"  width="2"  height="8"  fill="#4ade80"/>
        {/* body */}
        <rect x="2"  y="2"  width="10" height="8"  fill="#16a34a"/>
        {/* taper */}
        <rect x="0"  y="10" width="14" height="2"  fill="#4ade80"/>
        <rect x="2"  y="12" width="10" height="2"  fill="#4ade80"/>
        <rect x="4"  y="14" width="6"  height="2"  fill="#4ade80"/>
        <rect x="6"  y="15" width="2"  height="1"  fill="#4ade80"/>
        {/* taper fill */}
        <rect x="2"  y="10" width="10" height="2"  fill="#16a34a"/>
        <rect x="4"  y="12" width="6"  height="2"  fill="#16a34a"/>
        <rect x="6"  y="14" width="2"  height="2"  fill="#22c55e"/>
        {/* checkmark */}
        <rect x="3"  y="5"  width="2"  height="2"  fill="#bbf7d0"/>
        <rect x="5"  y="7"  width="2"  height="2"  fill="#bbf7d0"/>
        <rect x="7"  y="5"  width="2"  height="2"  fill="#bbf7d0"/>
        <rect x="9"  y="3"  width="2"  height="2"  fill="#bbf7d0"/>
      </svg>
    </div>
  );
}

/* ── Feature cards ── */
const FEATURES = [
  {
    color: '#4ade80',
    label: 'Anti-Nuke',
    desc: 'Catches mass bans, channel deletions, webhook spam, and bot raids — and shuts them down before anyone notices.',
    /* pixel sword icon */
    icon: (
      <svg viewBox="0 0 12 12" width="22" height="22" shapeRendering="crispEdges" fill="currentColor">
        <rect x="5" y="0" width="2" height="8" />
        <rect x="3" y="2" width="6" height="2" />
        <rect x="4" y="8" width="4" height="2" />
        <rect x="5" y="10" width="2" height="2"/>
      </svg>
    ),
  },
  {
    color: '#22c55e',
    label: 'Moderation',
    desc: 'Warn, mute, kick, ban — with full case history, auto-mod filters, and clean logs so nothing slips through.',
    /* pixel gavel */
    icon: (
      <svg viewBox="0 0 12 12" width="22" height="22" shapeRendering="crispEdges" fill="currentColor">
        <rect x="0" y="4" width="6" height="4" />
        <rect x="4" y="2" width="4" height="4" />
        <rect x="6" y="8" width="2" height="4" />
        <rect x="8" y="6" width="4" height="2" />
      </svg>
    ),
  },
  {
    color: '#86efac',
    label: 'Leveling & Economy',
    desc: 'XP per message, level-up role rewards, coins, shops, and leaderboards that keep members coming back.',
    /* pixel bar chart */
    icon: (
      <svg viewBox="0 0 12 12" width="22" height="22" shapeRendering="crispEdges" fill="currentColor">
        <rect x="0"  y="8"  width="2" height="4"/>
        <rect x="3"  y="4"  width="2" height="8"/>
        <rect x="6"  y="2"  width="2" height="10"/>
        <rect x="9"  y="0"  width="2" height="12"/>
        <rect x="0"  y="11" width="12" height="1"/>
      </svg>
    ),
  },
  {
    color: '#16a34a',
    label: 'Tickets & Utility',
    desc: 'Support tickets with full transcripts, reaction roles, welcome messages, giveaways, and polls.',
    /* pixel ticket */
    icon: (
      <svg viewBox="0 0 12 12" width="22" height="22" shapeRendering="crispEdges" fill="currentColor">
        <rect x="0" y="2" width="12" height="8"/>
        <rect x="2" y="0" width="2"  height="2"/>
        <rect x="8" y="0" width="2"  height="2"/>
        <rect x="2" y="10" width="2" height="2"/>
        <rect x="8" y="10" width="2" height="2"/>
        <rect x="2" y="4" width="8"  height="1" fill="hsl(150 20% 7%)"/>
        <rect x="2" y="6" width="6"  height="1" fill="hsl(150 20% 7%)"/>
      </svg>
    ),
  },
];

export default function Home() {
  const { data: statsData, isLoading } = useGetBotStats();
  const stats = statsData ?? { servers: 0, users: 0, commands: 74, status: 'online' };

  return (
    <div className="flex flex-col items-center">

      {/* ── Hero ── */}
      <section className="relative min-h-screen w-full flex flex-col items-center justify-center px-4 overflow-hidden">
        <PixelGardenCanvas />

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
             style={{ background: 'radial-gradient(circle, hsl(142 76% 45% / 0.06) 0%, transparent 65%)' }} />

        <div className="relative z-10 text-center max-w-3xl mx-auto flex flex-col items-center gap-8 pointer-events-none">
          <HeroShield />

          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary status-pulse" />
            <span className="text-xs text-muted-foreground font-medium tracking-wide">
              {isLoading ? 'Checking…' : stats.status === 'online' ? 'Online and ready' : 'Offline'}
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-pixel select-none leading-tight text-gradient"
              style={{ fontFamily: "'Press Start 2P', cursive", letterSpacing: '-0.02em' }}>
            SENTRIX
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-xl leading-relaxed">
            A Discord bot that protects your server, keeps things active, and gives your community room to grow.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm justify-center pointer-events-auto">
            <a href={INVITE_LINK} target="_blank" rel="noreferrer"
               className="flex-1 text-center px-7 py-3 rounded-md pixel-btn-primary text-sm font-semibold">
              Add to Server
            </a>
            <Link href="/commands"
                  className="flex-1 text-center px-7 py-3 rounded-md pixel-btn-secondary text-sm">
              Browse Commands
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="w-full py-16 border-y border-[hsl(142_76%_45%/0.1)] bg-[hsl(148_22%_8%/0.5)]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 text-center">
            {[
              { value: stats.servers,  label: 'Servers'  },
              { value: stats.users,    label: 'Members'  },
              { value: stats.commands, label: 'Commands' },
            ].map((s, i) => (
              <div key={s.label}
                   className={`py-10 px-6 ${i === 1 ? 'border-y md:border-y-0 md:border-x border-[hsl(142_76%_45%/0.1)]' : ''}`}>
                <div className="text-4xl md:text-5xl font-pixel text-gradient mb-3"
                     style={{ fontFamily: "'Press Start 2P', cursive" }}>
                  {isLoading ? '…' : <AnimatedCounter end={s.value} />}
                </div>
                <div className="text-sm text-muted-foreground font-medium tracking-wide">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="w-full py-28 container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-2xl md:text-3xl font-pixel text-gradient mb-4"
              style={{ fontFamily: "'Press Start 2P', cursive" }}>
            What it does
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Protection, moderation, engagement, and community tools — all in one bot.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-5xl mx-auto">
          {FEATURES.map((f) => (
            <div key={f.label} className="pixel-card rounded-xl p-7 flex gap-5 group">
              <div className="w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors duration-200"
                   style={{
                     background: `${f.color}18`,
                     color: f.color,
                     border: `1px solid ${f.color}30`,
                   }}>
                {f.icon}
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">{f.label}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Discord embed preview ── */}
      <section className="w-full py-20 border-t border-[hsl(142_76%_45%/0.1)] bg-[hsl(148_22%_8%/0.4)]">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-10">
            <h2 className="text-xl md:text-2xl font-pixel text-gradient mb-3"
                style={{ fontFamily: "'Press Start 2P', cursive" }}>
              See it in action
            </h2>
            <p className="text-muted-foreground text-sm">
              What Sentrix sends when it catches something suspicious.
            </p>
          </div>

          <div className="bg-[#313338] rounded-lg p-4 border border-[#1e1f22] shadow-2xl">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-[hsl(142_76%_45%/0.15)] flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg width="18" height="20" viewBox="0 0 14 16" fill="none" shapeRendering="crispEdges">
                  <rect x="2"  y="0"  width="10" height="2"  fill="#4ade80"/>
                  <rect x="0"  y="2"  width="2"  height="8"  fill="#4ade80"/>
                  <rect x="12" y="2"  width="2"  height="8"  fill="#4ade80"/>
                  <rect x="2"  y="2"  width="10" height="8"  fill="#16a34a"/>
                  <rect x="0"  y="10" width="14" height="2"  fill="#4ade80"/>
                  <rect x="2"  y="12" width="10" height="2"  fill="#4ade80"/>
                  <rect x="4"  y="14" width="6"  height="2"  fill="#4ade80"/>
                  <rect x="2"  y="10" width="10" height="2"  fill="#16a34a"/>
                  <rect x="4"  y="12" width="6"  height="2"  fill="#16a34a"/>
                  <rect x="3"  y="5"  width="2"  height="2"  fill="#bbf7d0"/>
                  <rect x="5"  y="7"  width="2"  height="2"  fill="#bbf7d0"/>
                  <rect x="7"  y="5"  width="2"  height="2"  fill="#bbf7d0"/>
                  <rect x="9"  y="3"  width="2"  height="2"  fill="#bbf7d0"/>
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="text-white font-semibold text-sm">Sentrix</span>
                  <span className="text-[10px] bg-[#5865F2] text-white px-1.5 py-0.5 rounded font-medium">APP</span>
                  <span className="text-[#72767d] text-xs">Today at 3:14 PM</span>
                </div>
                <div className="bg-[#2b2d31] rounded-sm p-4 border-l-4 border-[#4ade80]">
                  <p className="text-white text-sm font-semibold mb-1">🛡️ Action blocked — Mass ban attempt</p>
                  <p className="text-[#dbdee1] text-xs mb-4 leading-relaxed">
                    Sentrix detected an unusual spike in bans from one account and stepped in.
                  </p>
                  <div className="grid grid-cols-2 gap-3 text-xs mb-4">
                    <div>
                      <div className="text-[#b5bac1] mb-1 font-medium">Action</div>
                      <div className="text-white font-mono bg-[#1e1f22] px-2 py-1 rounded inline-block">MEMBER_BAN</div>
                    </div>
                    <div>
                      <div className="text-[#b5bac1] mb-1 font-medium">By</div>
                      <div className="text-[#4ade80] font-mono bg-[#4ade80]/10 px-2 py-1 rounded inline-block">@rogue_mod</div>
                    </div>
                  </div>
                  <div className="text-xs">
                    <span className="text-[#b5bac1]">Result — </span>
                    <span className="text-[#dbdee1]">
                      Permissions removed. Bans reversed. Time:{' '}
                      <span className="text-[#4ade80] font-semibold">138ms</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="w-full py-28 text-center px-4">
        <div className="relative max-w-2xl mx-auto">
          <div className="absolute inset-0 rounded-2xl pointer-events-none"
               style={{ background: 'radial-gradient(ellipse at center, hsl(142 76% 45% / 0.05) 0%, transparent 70%)' }} />
          <h2 className="text-2xl md:text-3xl font-pixel text-gradient mb-5 relative"
              style={{ fontFamily: "'Press Start 2P', cursive" }}>
            Ready?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto leading-relaxed">
            Add Sentrix to your server in seconds. No complicated setup needed.
          </p>
          <a href={INVITE_LINK} target="_blank" rel="noreferrer"
             className="inline-block px-9 py-3.5 rounded-md pixel-btn-primary text-sm font-semibold">
            Add to Server
          </a>
        </div>
      </section>

    </div>
  );
}

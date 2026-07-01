import React, { useEffect, useState } from 'react';
import { Link } from 'wouter';
import { useGetBotStats } from '@workspace/api-client-react';

const INVITE_LINK = "https://discord.com/oauth2/authorize?client_id=1521797977478271056";

function AnimatedCounter({ end, duration = 1800 }: { end: number; duration?: number }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (end === 0) return;
    let start: number | null = null;
    const step = (ts: number) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(ease * end));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [end, duration]);
  return <span>{count.toLocaleString()}</span>;
}

const FEATURES = [
  {
    color: '#818cf8',
    label: 'Anti-Nuke',
    desc: 'Watches every action in your server — mass bans, channel deletions, webhook spam — and shuts it down before anyone notices.',
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <line x1="12" y1="8" x2="12" y2="13" />
        <line x1="12" y1="16" x2="12" y2="16" strokeLinecap="round" strokeWidth="3" />
      </svg>
    ),
  },
  {
    color: '#4ade80',
    label: 'Moderation',
    desc: 'Warn, mute, kick, ban — with full case history, auto-mod filters, and clean logs so nothing slips through.',
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <line x1="9" y1="3" x2="9" y2="21" />
        <line x1="3" y1="9" x2="21" y2="9" />
      </svg>
    ),
  },
  {
    color: '#fbbf24',
    label: 'Leveling & Economy',
    desc: 'Give members XP for chatting, unlock roles as they level up, and run a server economy with coins, shops, and leaderboards.',
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
        <polyline points="17 6 23 6 23 12" />
      </svg>
    ),
  },
  {
    color: '#f472b6',
    label: 'Tickets & Utility',
    desc: 'Support tickets with full transcripts, reaction roles, welcome messages, giveaways, and everything your community runs on.',
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
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
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, hsl(239 84% 73% / 0.07) 0%, transparent 65%)' }}
        />

        <div className="relative z-10 text-center max-w-3xl mx-auto flex flex-col items-center gap-8">

          {/* Pixel logo mark */}
          <div className="float-slow relative">
            <div
              className="absolute inset-[-16px] rounded-full pointer-events-none"
              style={{ background: 'radial-gradient(circle, hsl(239 84% 73% / 0.18) 0%, transparent 70%)' }}
            />
            <svg width="96" height="96" viewBox="0 0 28 28" fill="none" aria-hidden="true">
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
          </div>

          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#4ade80] status-pulse" />
            <span className="text-xs text-muted-foreground font-medium tracking-wide">
              {isLoading ? 'Checking…' : stats.status === 'online' ? 'Online and ready' : 'Offline'}
            </span>
          </div>

          <h1
            className="text-5xl md:text-7xl font-pixel select-none leading-tight"
            style={{ fontFamily: "'Press Start 2P', cursive", letterSpacing: '-0.02em' }}
          >
            <span className="text-gradient">SENTRIX</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-xl leading-relaxed">
            A Discord bot that protects your server, keeps things active, and gives your community room to grow.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm justify-center">
            <a
              href={INVITE_LINK}
              target="_blank"
              rel="noreferrer"
              className="flex-1 text-center px-7 py-3 rounded-md pixel-btn-primary text-sm font-semibold"
            >
              Add to Server
            </a>
            <Link
              href="/commands"
              className="flex-1 text-center px-7 py-3 rounded-md pixel-btn-secondary text-sm"
            >
              Browse Commands
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="w-full py-16 border-y border-[hsl(239_84%_73%/0.1)] bg-[hsl(240_35%_10%/0.5)]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 text-center">
            {[
              { value: stats.servers,  label: 'Servers'  },
              { value: stats.users,    label: 'Members'  },
              { value: stats.commands, label: 'Commands' },
            ].map((s, i) => (
              <div
                key={s.label}
                className={`py-10 px-6 ${i === 1 ? 'border-y md:border-y-0 md:border-x border-[hsl(239_84%_73%/0.1)]' : ''}`}
              >
                <div
                  className="text-4xl md:text-5xl font-pixel text-gradient mb-3"
                  style={{ fontFamily: "'Press Start 2P', cursive" }}
                >
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
          <h2
            className="text-2xl md:text-3xl font-pixel text-gradient mb-4"
            style={{ fontFamily: "'Press Start 2P', cursive" }}
          >
            What it does
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Everything your server needs — protection, moderation, engagement, and community tools — built into one bot.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-5xl mx-auto">
          {FEATURES.map((f) => (
            <div key={f.label} className="pixel-card rounded-xl p-7 flex gap-5">
              <div
                className="w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ background: `${f.color}18`, color: f.color, border: `1px solid ${f.color}30` }}
              >
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
      <section className="w-full py-20 border-t border-[hsl(239_84%_73%/0.1)] bg-[hsl(240_35%_10%/0.4)]">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-10">
            <h2
              className="text-xl md:text-2xl font-pixel text-gradient mb-3"
              style={{ fontFamily: "'Press Start 2P', cursive" }}
            >
              See it in action
            </h2>
            <p className="text-muted-foreground text-sm">This is what Sentrix sends when it catches something suspicious.</p>
          </div>

          <div className="bg-[#313338] rounded-lg p-4 border border-[#1e1f22] shadow-2xl">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-[hsl(239_84%_73%/0.2)] flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg width="20" height="20" viewBox="0 0 28 28" fill="none">
                  <rect x="12" y="0"  width="4" height="4" fill="#818cf8" />
                  <rect x="8"  y="4"  width="4" height="4" fill="#c084fc" />
                  <rect x="16" y="4"  width="4" height="4" fill="#c084fc" />
                  <rect x="12" y="8"  width="4" height="4" fill="#fbbf24" />
                  <rect x="8"  y="16" width="4" height="4" fill="#f472b6" />
                  <rect x="12" y="16" width="4" height="4" fill="#f472b6" />
                  <rect x="16" y="16" width="4" height="4" fill="#f472b6" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="text-white font-semibold text-sm">Sentrix</span>
                  <span className="text-[10px] bg-[#5865F2] text-white px-1.5 py-0.5 rounded font-medium">APP</span>
                  <span className="text-[#72767d] text-xs">Today at 3:14 PM</span>
                </div>
                <div className="bg-[#2b2d31] rounded-sm p-4 border-l-4 border-[#818cf8]">
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
                      <div className="text-[#818cf8] font-mono bg-[#818cf8]/10 px-2 py-1 rounded inline-block">@rogue_mod</div>
                    </div>
                  </div>
                  <div className="text-xs">
                    <span className="text-[#b5bac1]">Result — </span>
                    <span className="text-[#dbdee1]">
                      Permissions removed. Bans reversed. Time to respond:{' '}
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
          <div
            className="absolute inset-0 rounded-2xl pointer-events-none"
            style={{ background: 'radial-gradient(ellipse at center, hsl(239 84% 73% / 0.06) 0%, transparent 70%)' }}
          />
          <h2
            className="text-2xl md:text-3xl font-pixel text-gradient mb-5 relative"
            style={{ fontFamily: "'Press Start 2P', cursive" }}
          >
            Ready?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto leading-relaxed">
            Add Sentrix to your server in seconds. No complicated setup needed.
          </p>
          <a
            href={INVITE_LINK}
            target="_blank"
            rel="noreferrer"
            className="inline-block px-9 py-3.5 rounded-md pixel-btn-primary text-sm font-semibold"
          >
            Add to Server
          </a>
        </div>
      </section>

    </div>
  );
}

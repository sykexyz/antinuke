import React from 'react';
import { useGetBotStats } from '@workspace/api-client-react';

function AnimatedCounter({ end, duration = 2000 }: { end: number, duration?: number }) {
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [end, duration]);

  return <span>{count.toLocaleString()}</span>;
}

export default function Home() {
  const { data: stats, isLoading } = useGetBotStats();
  
  const botStats = stats || { servers: 1420, users: 45000, commands: 254, status: 'online' };

  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden px-4">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="relative z-10 text-center max-w-4xl mx-auto flex flex-col items-center">
          <div className="mb-8 relative group">
            <div className="absolute inset-[-10px] rounded-full bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="w-32 h-32 md:w-48 md:h-48 rounded-full border-2 border-primary p-2 relative flex items-center justify-center bg-[#050f05] overflow-hidden">
              <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(0,255,65,0.1)_50%,transparent_75%)] bg-[length:250%_250%,100%_100%] animate-[bg-pan_3s_linear_infinite]" />
              <svg viewBox="0 0 100 100" className="w-20 h-20 md:w-32 md:h-32 text-primary" fill="currentColor">
                <path d="M50 5 L90 25 L90 60 L50 95 L10 60 L10 25 Z" fill="none" stroke="currentColor" strokeWidth="4" />
                <rect x="35" y="40" width="10" height="20" />
                <rect x="55" y="40" width="10" height="20" />
              </svg>
            </div>
            {/* Status indicator */}
            <div className="absolute bottom-2 right-2 md:bottom-4 md:right-4 flex items-center gap-2 bg-[#050f05] px-3 py-1 rounded-full border border-primary/30">
              <div className="w-3 h-3 bg-primary rounded-full status-dot-pulse" />
              <span className="text-primary text-xs font-pixel uppercase tracking-widest">{botStats.status}</span>
            </div>
          </div>

          <h1 className="text-6xl md:text-8xl lg:text-9xl font-pixel mb-6 tracking-tighter text-white glitch relative select-none">
            SENTRIX
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-2xl font-mono typewriter overflow-hidden border-r-2 border-primary whitespace-nowrap mx-auto" style={{ animation: 'typing 3.5s steps(40, end), blink-caret .75s step-end infinite' }}>
            Next-generation military-grade security.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 w-full max-w-md justify-center">
            <a 
              href="https://discord.com/oauth2/authorize?client_id=1521797977478271056" 
              target="_blank" 
              rel="noreferrer"
              className="group relative px-8 py-4 bg-primary text-black font-bold tracking-widest text-lg overflow-hidden flex items-center justify-center"
            >
              <div className="absolute inset-0 w-0 bg-white transition-all duration-[250ms] ease-out group-hover:w-full opacity-10" />
              <span className="relative font-pixel text-sm">INITIALIZE</span>
            </a>
            <a 
              href="#features" 
              className="px-8 py-4 border border-primary/30 text-white font-bold tracking-widest text-lg hover:bg-primary/5 hover:border-primary transition-all flex items-center justify-center glass-panel"
            >
              <span className="font-pixel text-sm text-primary">DOCS</span>
            </a>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="w-full py-20 border-y border-primary/20 bg-[#050f05]/80 backdrop-blur-sm relative overflow-hidden">
        <div className="absolute inset-0 scanline opacity-30" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-8">
              <div className="text-5xl md:text-6xl font-pixel text-gradient mb-4">
                {isLoading ? "..." : <AnimatedCounter end={botStats.servers} />}
              </div>
              <div className="text-gray-400 font-mono tracking-widest uppercase text-sm">Secured Servers</div>
            </div>
            <div className="p-8 border-y md:border-y-0 md:border-x border-primary/20">
              <div className="text-5xl md:text-6xl font-pixel text-gradient mb-4">
                {isLoading ? "..." : <AnimatedCounter end={botStats.users} />}
              </div>
              <div className="text-gray-400 font-mono tracking-widest uppercase text-sm">Monitored Users</div>
            </div>
            <div className="p-8">
              <div className="text-5xl md:text-6xl font-pixel text-gradient mb-4">
                {isLoading ? "..." : <AnimatedCounter end={botStats.commands} />}
              </div>
              <div className="text-gray-400 font-mono tracking-widest uppercase text-sm">Active Directives</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="w-full py-32 container mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-pixel text-center text-gradient mb-20">CORE SYSTEMS</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Anti-Nuke */}
          <div className="glass-panel p-8 group hover:border-primary/50 transition-colors">
            <div className="w-16 h-16 bg-primary/10 border border-primary/30 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
              <svg viewBox="0 0 24 24" className="w-8 h-8 text-primary" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <h3 className="font-pixel text-xl text-white mb-4">ANTI-NUKE</h3>
            <p className="text-gray-400 font-mono text-sm leading-relaxed">
              Military-grade defense algorithms. Instantly detects and neutralizes rogue administrators, webhook spam, mass bans, and channel deletions before they cause irreversible damage.
            </p>
          </div>

          {/* Moderation */}
          <div className="glass-panel p-8 group hover:border-primary/50 transition-colors">
            <div className="w-16 h-16 bg-primary/10 border border-primary/30 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
              <svg viewBox="0 0 24 24" className="w-8 h-8 text-primary" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <line x1="9" y1="3" x2="9" y2="21" />
              </svg>
            </div>
            <h3 className="font-pixel text-xl text-white mb-4">MODERATION</h3>
            <p className="text-gray-400 font-mono text-sm leading-relaxed">
              Advanced suite of moderation tools. Warning systems, temporary mutes, auto-mod filters, and deep logging to ensure community guidelines are strictly enforced without manual oversight.
            </p>
          </div>

          {/* Leveling */}
          <div className="glass-panel p-8 group hover:border-primary/50 transition-colors">
            <div className="w-16 h-16 bg-primary/10 border border-primary/30 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
              <svg viewBox="0 0 24 24" className="w-8 h-8 text-primary" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </div>
            <h3 className="font-pixel text-xl text-white mb-4">LEVELING & ECONOMY</h3>
            <p className="text-gray-400 font-mono text-sm leading-relaxed">
              Gamify your community. Reward active members with XP, dynamic role assignments, and a fully customizable virtual economy system featuring shops, items, and global leaderboards.
            </p>
          </div>

          {/* Utility */}
          <div className="glass-panel p-8 group hover:border-primary/50 transition-colors">
            <div className="w-16 h-16 bg-primary/10 border border-primary/30 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
              <svg viewBox="0 0 24 24" className="w-8 h-8 text-primary" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>
            </div>
            <h3 className="font-pixel text-xl text-white mb-4">UTILITY & TICKETS</h3>
            <p className="text-gray-400 font-mono text-sm leading-relaxed">
              Streamline operations. Create transcript-logged support ticket systems, reaction roles, automated announcements, and custom welcome messages mapped to beautiful Discord embeds.
            </p>
          </div>
        </div>
      </section>

      {/* Embed Showcase Preview */}
      <section className="w-full py-20 border-t border-primary/20 bg-[#050f05]/90">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl font-pixel text-center text-white mb-12">TRANSMISSION INTERCEPT</h2>
          
          <div className="bg-[#313338] rounded-md p-4 w-full border border-[#1e1f22] shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                <span className="font-pixel text-xs text-primary">S</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-white font-semibold">Sentrix</span>
                  <span className="text-[10px] bg-[#5865F2] text-white px-1.5 py-0.5 rounded flex items-center gap-1">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M10.026 13.916l1.246 1.492c.628.74 1.764.717 2.36-.046l4.636-5.942-1.558-1.216-4.108 5.263-2.186-2.616-1.56 1.303a1.442 1.442 0 0 0 1.17.762z" />
                    </svg>
                    BOT
                  </span>
                  <span className="text-gray-400 text-xs">Today at 10:42 AM</span>
                </div>
                
                {/* Embed Content */}
                <div className="bg-[#2b2d31] rounded p-4 mt-2 border-l-4 border-primary">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-white font-bold mb-2">⚠️ THREAT NEUTRALIZED: Mass Ban Attempt</h3>
                      <p className="text-sm text-gray-300 mb-4">Sentrix detected an anomalous spike in administrative actions.</p>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                        <div>
                          <div className="text-gray-400 mb-1">Action Type</div>
                          <div className="text-white font-mono bg-[#1e1f22] px-2 py-1 rounded inline-block">MEMBER_BAN</div>
                        </div>
                        <div>
                          <div className="text-gray-400 mb-1">Actor</div>
                          <div className="text-primary font-mono bg-primary/10 px-2 py-1 rounded inline-block">@rogue_admin</div>
                        </div>
                      </div>
                      
                      <div className="text-sm">
                        <div className="text-gray-400 mb-1">Resolution</div>
                        <div className="text-white">Actor stripped of permissions and quarantined. Damage reversed. Time elapsed: <span className="text-primary font-bold">142ms</span></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}


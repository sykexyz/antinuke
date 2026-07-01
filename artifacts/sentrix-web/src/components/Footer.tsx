import React from 'react';
import { Link } from 'wouter';

export function Footer() {
  return (
    <footer className="w-full border-t border-[hsl(239_84%_73%/0.1)] bg-[hsl(240_35%_8%/0.6)] backdrop-blur-sm mt-24">
      <div className="container mx-auto px-4 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <Link href="/" className="flex items-center gap-3 group mb-4 w-fit select-none">
              <svg width="22" height="22" viewBox="0 0 28 28" fill="none" aria-hidden="true">
                <rect x="12" y="0"  width="4" height="4" fill="#818cf8" />
                <rect x="8"  y="4"  width="4" height="4" fill="#c084fc" />
                <rect x="16" y="4"  width="4" height="4" fill="#c084fc" />
                <rect x="12" y="8"  width="4" height="4" fill="#fbbf24" />
                <rect x="8"  y="16" width="4" height="4" fill="#f472b6" />
                <rect x="12" y="16" width="4" height="4" fill="#f472b6" />
                <rect x="16" y="16" width="4" height="4" fill="#f472b6" />
                <rect x="12" y="20" width="4" height="4" fill="#c084fc" />
              </svg>
              <span
                className="font-pixel text-xs text-white group-hover:text-primary transition-colors"
                style={{ fontFamily: "'Press Start 2P', cursive" }}
              >
                SENTRIX
              </span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
              A Discord bot that keeps your server safe, active, and fun — all in one place.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Pages</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/about"     className="text-muted-foreground hover:text-foreground transition-colors">About</Link></li>
              <li><Link href="/commands"  className="text-muted-foreground hover:text-foreground transition-colors">Commands</Link></li>
              <li><Link href="/status"    className="text-muted-foreground hover:text-foreground transition-colors">Status</Link></li>
              <li><Link href="/developer" className="text-muted-foreground hover:text-foreground transition-colors">Developer</Link></li>
              <li>
                <a
                  href="https://discord.com/oauth2/authorize?client_id=1521797977478271056"
                  target="_blank"
                  rel="noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Add to Server
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Legal</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/tos"     className="text-muted-foreground hover:text-foreground transition-colors">Terms of Service</Link></li>
              <li><Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-[hsl(239_84%_73%/0.08)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Sentrix. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#4ade80] opacity-60" />
            <div className="w-1.5 h-1.5 rounded-full bg-[#818cf8] opacity-80" />
            <div className="w-1.5 h-1.5 rounded-full bg-[#f472b6] opacity-60" />
          </div>
        </div>
      </div>
    </footer>
  );
}

import React from 'react';
import { Link } from 'wouter';
import { ShieldIcon } from './Navbar';

export function Footer() {
  return (
    <footer className="w-full border-t border-[hsl(142_76%_45%/0.1)] bg-[hsl(148_22%_7%/0.6)] backdrop-blur-sm mt-24">
      <div className="container mx-auto px-4 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          <div>
            <Link href="/" className="flex items-center gap-2.5 group mb-4 w-fit select-none">
              <ShieldIcon size={22} />
              <span className="font-pixel text-xs text-foreground group-hover:text-primary transition-colors"
                    style={{ fontFamily: "'Press Start 2P', cursive" }}>
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
              <li><a href="https://discord.com/oauth2/authorize?client_id=1521797977478271056"
                     target="_blank" rel="noreferrer"
                     className="text-muted-foreground hover:text-foreground transition-colors">
                    Add to Server
                  </a></li>
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

        <div className="mt-12 pt-8 border-t border-[hsl(142_76%_45%/0.08)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Sentrix. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-primary opacity-50" />
            <div className="w-1.5 h-1.5 rounded-full bg-primary opacity-75" />
            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
          </div>
        </div>
      </div>
    </footer>
  );
}

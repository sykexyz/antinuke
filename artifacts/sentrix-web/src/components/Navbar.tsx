import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Menu, X } from 'lucide-react';

const INVITE_LINK = "https://discord.com/oauth2/authorize?client_id=1521797977478271056";

const NAV_LINKS = [
  { href: '/about',     label: 'About'    },
  { href: '/commands',  label: 'Commands' },
  { href: '/status',    label: 'Status'   },
  { href: '/developer', label: 'Developer'},
];

export function Navbar() {
  const [location] = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? 'py-2 bg-[hsl(240_28%_9%/0.9)] backdrop-blur-xl border-b border-[hsl(239_84%_73%/0.12)]'
          : 'py-4 bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group select-none">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
            <rect x="12" y="0"  width="4"  height="4"  fill="#818cf8" />
            <rect x="8"  y="4"  width="4"  height="4"  fill="#c084fc" />
            <rect x="16" y="4"  width="4"  height="4"  fill="#c084fc" />
            <rect x="4"  y="8"  width="4"  height="4"  fill="#818cf8" />
            <rect x="12" y="8"  width="4"  height="4"  fill="#fbbf24" />
            <rect x="20" y="8"  width="4"  height="4"  fill="#818cf8" />
            <rect x="4"  y="12" width="4"  height="4"  fill="#4ade80" />
            <rect x="8"  y="12" width="4"  height="4"  fill="#818cf8" />
            <rect x="16" y="12" width="4"  height="4"  fill="#818cf8" />
            <rect x="20" y="12" width="4"  height="4"  fill="#4ade80" />
            <rect x="8"  y="16" width="4"  height="4"  fill="#f472b6" />
            <rect x="12" y="16" width="4"  height="4"  fill="#f472b6" />
            <rect x="16" y="16" width="4"  height="4"  fill="#f472b6" />
            <rect x="12" y="20" width="4"  height="4"  fill="#c084fc" />
          </svg>
          <span
            className="font-pixel text-[13px] tracking-tight text-white group-hover:text-primary transition-colors duration-200"
            style={{ fontFamily: "'Press Start 2P', cursive" }}
          >
            SENTRIX
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-7">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors duration-200 ${
                location === link.href
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <a
            href={INVITE_LINK}
            target="_blank"
            rel="noreferrer"
            className="ml-2 px-5 py-2 rounded-md pixel-btn-primary text-sm font-semibold"
          >
            Add to Server
          </a>
        </nav>

        <button
          className="md:hidden text-muted-foreground hover:text-foreground p-2 transition-colors"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden absolute top-full left-0 w-full bg-[hsl(240_35%_10%/0.97)] backdrop-blur-xl border-b border-[hsl(239_84%_73%/0.12)] flex flex-col p-4 gap-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={`text-sm font-medium px-3 py-2.5 rounded-md transition-colors ${
                location === link.href
                  ? 'text-primary bg-[hsl(239_84%_73%/0.1)]'
                  : 'text-muted-foreground hover:text-foreground hover:bg-[hsl(239_84%_73%/0.05)]'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <a
            href={INVITE_LINK}
            target="_blank"
            rel="noreferrer"
            className="mt-3 text-center px-5 py-2.5 rounded-md pixel-btn-primary text-sm font-semibold"
          >
            Add to Server
          </a>
        </div>
      )}
    </header>
  );
}

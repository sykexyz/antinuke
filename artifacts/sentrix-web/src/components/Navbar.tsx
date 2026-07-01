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

/* Pixel shield — 14×16 grid */
function ShieldIcon({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 16" fill="none" aria-hidden="true" shapeRendering="crispEdges">
      {/* outer left */}
      <rect x="2" y="0" width="2" height="2" fill="#4ade80"/>
      <rect x="0" y="2" width="2" height="2" fill="#4ade80"/>
      {/* outer right */}
      <rect x="10" y="0" width="2" height="2" fill="#4ade80"/>
      <rect x="12" y="2" width="2" height="2" fill="#4ade80"/>
      {/* top row */}
      <rect x="2" y="0" width="10" height="2" fill="#4ade80"/>
      {/* sides */}
      <rect x="0" y="2" width="2" height="8" fill="#4ade80"/>
      <rect x="12" y="2" width="2" height="8" fill="#4ade80"/>
      {/* body fill */}
      <rect x="2" y="2" width="10" height="8" fill="#22c55e"/>
      {/* taper left */}
      <rect x="0" y="10" width="2" height="2" fill="#4ade80"/>
      <rect x="2" y="12" width="2" height="2" fill="#4ade80"/>
      <rect x="4" y="14" width="2" height="2" fill="#4ade80"/>
      {/* taper right */}
      <rect x="12" y="10" width="2" height="2" fill="#4ade80"/>
      <rect x="10" y="12" width="2" height="2" fill="#4ade80"/>
      <rect x="8"  y="14" width="2" height="2" fill="#4ade80"/>
      {/* taper fill */}
      <rect x="2"  y="10" width="10" height="2" fill="#22c55e"/>
      <rect x="4"  y="12" width="6"  height="2" fill="#22c55e"/>
      <rect x="6"  y="14" width="2"  height="2" fill="#22c55e"/>
      {/* checkmark */}
      <rect x="3"  y="5" width="2" height="2" fill="#052e16"/>
      <rect x="5"  y="7" width="2" height="2" fill="#052e16"/>
      <rect x="7"  y="5" width="2" height="2" fill="#052e16"/>
      <rect x="9"  y="3" width="2" height="2" fill="#052e16"/>
    </svg>
  );
}

export { ShieldIcon };

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
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      scrolled
        ? 'py-2 bg-[hsl(150_20%_7%/0.92)] backdrop-blur-xl border-b border-[hsl(142_76%_45%/0.12)]'
        : 'py-4 bg-transparent'
    }`}>
      <div className="container mx-auto px-4 flex items-center justify-between">

        <Link href="/" className="flex items-center gap-2.5 group select-none">
          <div className="group-hover:scale-110 transition-transform duration-200">
            <ShieldIcon size={28} />
          </div>
          <span className="font-pixel text-[13px] tracking-tight text-foreground group-hover:text-primary transition-colors duration-200"
                style={{ fontFamily: "'Press Start 2P', cursive" }}>
            SENTRIX
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-7">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href}
              className={`text-sm font-medium transition-colors duration-200 ${
                location === link.href
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}>
              {link.label}
            </Link>
          ))}
          <a href={INVITE_LINK} target="_blank" rel="noreferrer"
             className="ml-2 px-5 py-2 rounded-md pixel-btn-primary text-sm font-semibold">
            Add to Server
          </a>
        </nav>

        <button className="md:hidden text-muted-foreground hover:text-foreground p-2 transition-colors"
                onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden absolute top-full left-0 w-full bg-[hsl(150_20%_7%/0.97)] backdrop-blur-xl border-b border-[hsl(142_76%_45%/0.12)] flex flex-col p-4 gap-1">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} onClick={() => setOpen(false)}
              className={`text-sm font-medium px-3 py-2.5 rounded-md transition-colors ${
                location === link.href
                  ? 'text-primary bg-[hsl(142_76%_45%/0.1)]'
                  : 'text-muted-foreground hover:text-foreground hover:bg-[hsl(142_76%_45%/0.05)]'
              }`}>
              {link.label}
            </Link>
          ))}
          <a href={INVITE_LINK} target="_blank" rel="noreferrer"
             className="mt-3 text-center px-5 py-2.5 rounded-md pixel-btn-primary text-sm font-semibold">
            Add to Server
          </a>
        </div>
      )}
    </header>
  );
}

import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Menu, X } from 'lucide-react';

const INVITE_LINK = "https://discord.com/oauth2/authorize?client_id=1521797977478271056";

export function Navbar() {
  const [location] = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '/', label: 'HOME' },
    { href: '/about', label: 'ABOUT' },
    { href: '/developer', label: 'DEVELOPER' },
    { href: '/commands', label: 'COMMANDS' },
    { href: '/status', label: 'STATUS' },
  ];

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'py-2 bg-[#050f05]/80 backdrop-blur-md border-b border-primary/20' : 'py-4 bg-transparent'}`}>
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 relative flex items-center justify-center">
            <div className="absolute inset-0 border-2 border-primary rounded-sm transform rotate-45 group-hover:rotate-90 transition-transform duration-500" />
            <div className="w-3 h-3 bg-primary rounded-sm" />
          </div>
          <span className="font-pixel text-xl tracking-tighter text-white group-hover:text-primary transition-colors">SENTRIX</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.filter(l => l.href !== '/').map((link) => (
            <Link 
              key={link.href} 
              href={link.href}
              className={`text-sm font-bold tracking-widest transition-all ${location === link.href ? 'text-primary drop-shadow-[0_0_8px_rgba(0,255,65,0.8)]' : 'text-gray-400 hover:text-white'}`}
            >
              {link.label}
            </Link>
          ))}
          <a 
            href={INVITE_LINK} 
            target="_blank" 
            rel="noreferrer"
            className="ml-4 px-6 py-2 bg-primary/10 border border-primary text-primary font-bold text-sm tracking-widest hover:bg-primary hover:text-black transition-all neon-box-shadow"
          >
            ADD TO SERVER
          </a>
        </nav>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden text-primary p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-[#050f05]/95 backdrop-blur-xl border-b border-primary/20 flex flex-col p-4 gap-4 animate-in slide-in-from-top-2">
          {navLinks.map((link) => (
            <Link 
              key={link.href} 
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`text-sm font-bold tracking-widest p-2 ${location === link.href ? 'text-primary bg-primary/10' : 'text-gray-400'}`}
            >
              {link.label}
            </Link>
          ))}
          <a 
            href={INVITE_LINK} 
            target="_blank" 
            rel="noreferrer"
            className="text-center mt-4 px-6 py-3 bg-primary text-black font-bold text-sm tracking-widest"
          >
            ADD TO SERVER
          </a>
        </div>
      )}
    </header>
  );
}

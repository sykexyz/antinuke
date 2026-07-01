import React from 'react';
import { Link } from 'wouter';

export function Footer() {
  return (
    <footer className="w-full border-t border-primary/20 bg-[#050f05]/50 backdrop-blur-sm mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-3 group mb-4">
              <div className="w-6 h-6 relative flex items-center justify-center">
                <div className="absolute inset-0 border border-primary rounded-sm transform rotate-45" />
                <div className="w-2 h-2 bg-primary rounded-sm" />
              </div>
              <span className="font-pixel text-lg text-white">SENTRIX</span>
            </Link>
            <p className="text-gray-400 text-sm max-w-sm mb-6">
              Military-grade Discord moderation and utility system.
              Protect your server with next-generation anti-nuke technology.
            </p>
          </div>
          
          <div>
            <h4 className="font-pixel text-xs text-primary mb-4">Links</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/about" className="hover:text-primary transition-colors">About</Link></li>
              <li><Link href="/commands" className="hover:text-primary transition-colors">Commands</Link></li>
              <li><Link href="/status" className="hover:text-primary transition-colors">Status</Link></li>
              <li><a href="https://discord.com/oauth2/authorize?client_id=1521797977478271056" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">Add Bot</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-pixel text-xs text-primary mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/tos" className="hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="/developer" className="hover:text-primary transition-colors">Developer</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-primary/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500 font-mono">
            © {new Date().getFullYear()} Sentrix Bot. All rights reserved.
          </p>
          <div className="flex gap-2">
            <div className="w-1 h-1 bg-primary rounded-full opacity-50" />
            <div className="w-1 h-1 bg-primary rounded-full opacity-75" />
            <div className="w-1 h-1 bg-primary rounded-full" />
          </div>
        </div>
      </div>
    </footer>
  );
}

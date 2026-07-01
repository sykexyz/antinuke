import React from 'react';

export default function About() {
  return (
    <div className="pt-32 pb-20 px-4 max-w-4xl mx-auto">
      <h1 className="text-4xl md:text-6xl font-pixel text-gradient mb-12">ABOUT SENTRIX</h1>
      
      <div className="glass-panel p-8 md:p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[50px] rounded-full" />
        
        <div className="prose prose-invert prose-green max-w-none font-mono text-gray-300 space-y-6 leading-relaxed">
          <p className="text-lg text-white border-l-2 border-primary pl-4">
            Sentrix is not just another Discord bot. It is a guardian — built from the ground up with a single obsession: keeping servers safe without compromise.
          </p>
          
          <p>
            While other bots offer surface-level moderation, Sentrix operates at a level most bots cannot reach. Its anti-nuke engine monitors every action in real time — webhook spam, bot infiltration, selfbot activity, mass bans, mass kicks, mass channel deletion, mass role destruction — and responds in milliseconds. Not seconds. Milliseconds. Before damage can spread.
          </p>
          
          <p>
            The architecture is designed around absolute zero-trust. Trust nobody. Not even administrators whose accounts may have been compromised. The Sentrix Bypass Role System ensures that dangerous commands and actions are strictly gated, preventing rogue mods from turning a server to ash. 
          </p>
          
          <p>
            Beyond military-grade security, Sentrix acts as a complete ecosystem for community growth. It features a seamless welcomer, an advanced leveling system that rewards genuine engagement, and an economy framework that turns a static chat into a breathing digital city. Every feature is interlocked, optimized, and engineered for high-concurrency environments.
          </p>

          <p>
            We didn't build this to be ordinary. We built it to be invincible. Welcome to Sentrix.
          </p>
        </div>
      </div>
    </div>
  );
}

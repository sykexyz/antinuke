import React from 'react';

export default function Privacy() {
  return (
    <div className="pt-32 pb-20 px-4 max-w-4xl mx-auto w-full">
      <h1 className="text-4xl md:text-6xl font-pixel text-gradient mb-12">PRIVACY POLICY</h1>
      
      <div className="glass-panel p-8 md:p-12 relative overflow-hidden text-gray-300 font-mono space-y-8">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[50px] rounded-full" />
        
        <p className="text-sm text-primary mb-8 border-l-2 border-primary pl-4">Last Updated: October 2024</p>
        
        <section>
          <h2 className="text-xl font-bold text-white mb-4 uppercase">Data Minimization Principle</h2>
          <p>Sentrix operates on a strict data minimization principle. We only collect, process, and store data that is absolutely necessary for the bot's core functions (anti-nuke, moderation, leveling, and economy).</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-4 uppercase">What Data We Collect</h2>
          <ul className="list-disc list-inside pl-4 space-y-2 text-gray-400">
            <li><strong>Server IDs and Configuration:</strong> To store your custom prefix, anti-nuke thresholds, and logging channels.</li>
            <li><strong>User IDs:</strong> To track warnings, strikes, leveling XP, and economy balances.</li>
            <li><strong>Message Content (Ephemeral):</strong> Messages are scanned in real-time for anti-spam and malicious links, but the content is NOT stored permanently unless explicitly logged in a strike/warning context.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-4 uppercase">How We Use Your Data</h2>
          <p>Data is used exclusively to provide the services offered by Sentrix. We do not sell, rent, or share your data with third parties. Your data is your data.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-4 uppercase">Data Deletion</h2>
          <p>If you remove Sentrix from your server, your server's configuration data is marked for deletion and purged during our routine database sweeps. Individual users can request a full data wipe of their economy/leveling data by contacting support.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-4 uppercase">Security Measures</h2>
          <p>All stored data is encrypted at rest. Our infrastructure is fortified against external access, and access to the production database is strictly limited to core developers.</p>
        </section>
      </div>
    </div>
  );
}

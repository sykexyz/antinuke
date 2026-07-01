import React from 'react';

export default function TOS() {
  return (
    <div className="pt-32 pb-20 px-4 max-w-4xl mx-auto w-full">
      <h1 className="text-4xl md:text-6xl font-pixel text-gradient mb-12">TERMS OF SERVICE</h1>
      
      <div className="glass-panel p-8 md:p-12 relative overflow-hidden text-gray-300 font-mono space-y-8">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[50px] rounded-full" />
        
        <p className="text-sm text-primary mb-8 border-l-2 border-primary pl-4">Last Updated: October 2024</p>
        
        <section>
          <h2 className="text-xl font-bold text-white mb-4 uppercase">1. Acceptance of Terms</h2>
          <p>By inviting Sentrix Bot to your Discord server, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you must immediately kick the bot from all your servers.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-4 uppercase">2. Bot Usage and Restrictions</h2>
          <p className="mb-2">You agree NOT to use Sentrix for any of the following:</p>
          <ul className="list-disc list-inside pl-4 space-y-2 text-gray-400">
            <li>Violating Discord's Terms of Service or Community Guidelines.</li>
            <li>Attempting to bypass, exploit, or reverse-engineer the bot's security features.</li>
            <li>Using the bot to facilitate malicious attacks, raiding, or nuking of other servers.</li>
            <li>Spamming bot commands or intentionally attempting to cause rate limits.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-4 uppercase">3. Data Collection and Privacy</h2>
          <p>We take data privacy seriously. Sentrix only stores the minimum amount of data required to function effectively. Please refer to our Privacy Policy for detailed information on what data we collect and how it is protected.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-4 uppercase">4. Service Availability</h2>
          <p>We strive to maintain 99.9% uptime. However, we do not guarantee continuous, uninterrupted access to the bot. We reserve the right to temporarily suspend service for maintenance, updates, or in response to security threats without prior notice.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-4 uppercase">5. Termination</h2>
          <p>We reserve the right to terminate or suspend your access to Sentrix Bot at any time, for any reason, including but not limited to violations of these Terms of Service or Discord's Terms of Service.</p>
        </section>
      </div>
    </div>
  );
}

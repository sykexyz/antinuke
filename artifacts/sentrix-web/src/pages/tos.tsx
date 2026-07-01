import React from 'react';

const SECTIONS = [
  {
    title: '1. Acceptance of Terms',
    body: 'By adding Sentrix to your Discord server, you agree to these Terms of Service. If you disagree with any part, remove the bot from your server.',
  },
  {
    title: '2. Allowed Use',
    body: null,
    list: [
      "Don't use Sentrix to violate Discord's Terms of Service or Community Guidelines.",
      "Don't attempt to exploit, bypass, or reverse-engineer any bot features.",
      "Don't use the bot to harm, raid, or attack other Discord servers.",
      "Don't spam commands or deliberately trigger rate limits.",
    ],
  },
  {
    title: '3. Data and Privacy',
    body: 'Sentrix only stores data needed to function — server config, user IDs for moderation and leveling, and economy balances. We do not sell or share your data. See the Privacy Policy for full details.',
  },
  {
    title: '4. Availability',
    body: 'We aim for high uptime but do not guarantee uninterrupted access. The bot may go offline for maintenance or updates without prior notice.',
  },
  {
    title: '5. Termination',
    body: 'We may remove access to Sentrix at any time if these terms or Discord\'s guidelines are violated.',
  },
];

export default function TOS() {
  return (
    <div className="pt-32 pb-24 px-4 max-w-3xl mx-auto w-full">

      <div className="mb-12">
        <h1
          className="text-3xl md:text-4xl font-pixel text-gradient mb-4"
          style={{ fontFamily: "'Press Start 2P', cursive" }}
        >
          Terms of Service
        </h1>
        <p className="text-sm text-muted-foreground">Last updated: October 2024</p>
      </div>

      <div className="space-y-5">
        {SECTIONS.map((s) => (
          <div key={s.title} className="pixel-card rounded-xl p-6 md:p-8">
            <h2 className="font-semibold text-foreground mb-3 text-sm">{s.title}</h2>
            {s.body && (
              <p className="text-sm text-muted-foreground leading-relaxed">{s.body}</p>
            )}
            {s.list && (
              <ul className="space-y-2 mt-1">
                {s.list.map((item, i) => (
                  <li key={i} className="flex gap-3 text-sm text-muted-foreground">
                    <span className="text-primary mt-0.5 flex-shrink-0">•</span>
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>

    </div>
  );
}

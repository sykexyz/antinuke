import React from 'react';

const COLLECTED = [
  { label: 'Server IDs & config',   desc: 'Stores your prefix settings, anti-nuke thresholds, and logging channels.' },
  { label: 'User IDs',              desc: 'Used to track warnings, strikes, XP, levels, and economy balances.' },
  { label: 'Message content',       desc: 'Scanned in real time for spam and links. Content is not stored unless it creates a moderation case.' },
];

const SECTIONS = [
  {
    title: 'How we use your data',
    body: 'Data is used only to run Sentrix features. We do not sell, rent, or share data with third parties.',
  },
  {
    title: 'Deleting your data',
    body: "Removing Sentrix from your server marks your server's config for deletion in the next cleanup cycle. Individual users can request a full wipe of their economy and leveling data by contacting us.",
  },
  {
    title: 'Security',
    body: 'Stored data is encrypted at rest. Database access is restricted to core developers only.',
  },
];

export default function Privacy() {
  return (
    <div className="pt-32 pb-24 px-4 max-w-3xl mx-auto w-full">

      <div className="mb-12">
        <h1
          className="text-3xl md:text-4xl font-pixel text-gradient mb-4"
          style={{ fontFamily: "'Press Start 2P', cursive" }}
        >
          Privacy Policy
        </h1>
        <p className="text-sm text-muted-foreground">Last updated: October 2024</p>
      </div>

      <div className="pixel-card rounded-xl p-6 md:p-8 mb-5">
        <p className="text-sm text-muted-foreground leading-relaxed border-l-2 border-primary pl-4">
          Sentrix only collects what it needs. Nothing more.
        </p>
      </div>

      <div className="pixel-card rounded-xl p-6 md:p-8 mb-5">
        <h2 className="font-semibold text-foreground text-sm mb-5">What we collect</h2>
        <div className="space-y-4">
          {COLLECTED.map((item) => (
            <div key={item.label} className="flex gap-4">
              <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-foreground mb-0.5">{item.label}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-5">
        {SECTIONS.map((s) => (
          <div key={s.title} className="pixel-card rounded-xl p-6 md:p-8">
            <h2 className="font-semibold text-foreground text-sm mb-3">{s.title}</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">{s.body}</p>
          </div>
        ))}
      </div>

    </div>
  );
}

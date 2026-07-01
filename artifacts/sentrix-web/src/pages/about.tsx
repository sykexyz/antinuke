import React from 'react';
import { Link } from 'wouter';

const INVITE_LINK = "https://discord.com/oauth2/authorize?client_id=1521797977478271056";

const PILLARS = [
  {
    color: '#818cf8',
    title: 'Protection first',
    body: 'Sentrix watches every administrative action in your server. The moment something looks wrong — mass bans, channel deletions, bot raids, webhook spam — it acts. Not in seconds. In milliseconds.',
  },
  {
    color: '#4ade80',
    title: 'Smart moderation',
    body: "Built-in warn systems, auto-mod filters, timed mutes, and a full case history. Every action is logged so your team always knows what happened and who did it.",
  },
  {
    color: '#fbbf24',
    title: 'Community growth',
    body: "XP, leveling, role rewards, an economy system with shops and coins — tools that make your members want to stick around and stay active.",
  },
  {
    color: '#f472b6',
    title: 'Reliable by design',
    body: "74 commands across moderation, anti-nuke, economy, tickets, and utilities. Each one is built to work every time without breaking or causing issues.",
  },
];

export default function About() {
  return (
    <div className="pt-32 pb-24 px-4 max-w-4xl mx-auto">

      <div className="mb-14">
        <h1
          className="text-3xl md:text-4xl font-pixel text-gradient mb-5"
          style={{ fontFamily: "'Press Start 2P', cursive" }}
        >
          About Sentrix
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl leading-relaxed">
          Sentrix is a Discord bot built with one goal: making server management less stressful and more reliable.
        </p>
      </div>

      <div className="pixel-card rounded-xl p-8 md:p-10 mb-10">
        <p className="text-foreground leading-loose text-sm md:text-base border-l-2 border-primary pl-5 mb-8">
          Most bots handle one thing well. Sentrix handles everything — protection, moderation, leveling, economy, tickets — without the juggling act of managing five different bots.
        </p>
        <p className="text-muted-foreground leading-loose text-sm">
          The anti-nuke system is the heart of it. It monitors every action an admin or bot takes inside your server, and if something spikes — too many bans, too many deletions, too much webhook activity — Sentrix steps in immediately. The person responsible gets stripped of permissions and the damage gets reversed, all before most members even notice something happened.
        </p>
        <p className="text-muted-foreground leading-loose text-sm mt-4">
          Beyond protection, Sentrix turns a Discord server into a living community. Members earn XP by chatting, level up to unlock roles, spend coins in a server shop, and join giveaways — all without leaving Discord. Your moderators get a full set of tools to keep things clean, and your members get reasons to come back.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-14">
        {PILLARS.map((p) => (
          <div key={p.title} className="pixel-card rounded-xl p-6">
            <div
              className="w-1.5 h-6 rounded-full mb-4"
              style={{ background: p.color }}
            />
            <h3 className="font-semibold text-foreground mb-2">{p.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{p.body}</p>
          </div>
        ))}
      </div>

      <div className="text-center">
        <a
          href={INVITE_LINK}
          target="_blank"
          rel="noreferrer"
          className="inline-block px-8 py-3 rounded-md pixel-btn-primary text-sm font-semibold mr-3"
        >
          Add to Server
        </a>
        <Link
          href="/commands"
          className="inline-block px-8 py-3 rounded-md pixel-btn-secondary text-sm"
        >
          Browse Commands
        </Link>
      </div>

    </div>
  );
}

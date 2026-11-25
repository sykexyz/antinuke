import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/rizesec")({
  head: () => ({
    meta: [
      { title: "Rize Security Bot" },
      { name: "description", content: "Who built Rize, what it does, what it needs, and why it's safe to run in your server." },
      { property: "og:title", content: "Rize Security Bot" },
      { property: "og:description", content: "Who built Rize, what it does, what it needs, and why it's safe to run in your server." },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: RizeSec,
});

const sections = [
  {
    label: "Developer",
    title: "Kyle Gaspari",
    body: [
      "Rize is built and run by Kyle Gaspari. One developer, no investors, no growth team asking for your data.",
      "It started as a bot for a few friends' servers that kept getting hit. It works well enough now that anyone can use it, free.",
    ],
    link: { href: "https://kxle.ct.ws", text: "kxle.ct.ws" },
  },
  {
    label: "Capabilities",
    title: "What she does",
    body: [
      "Most protection bots watch the server. Rize watches people. Every member gets tracked on their own: how fast they type, where they talk, when they hop into voice, what threads they open. When one person starts behaving like a raid, she sees it.",
      "Thirteen protections, each one switched on by you: spam, links, raids, nukes, threads, mentions, caps, zalgo, emoji floods, ghost pings, webhooks, unapproved bots and vanity changes. Each has its own punishment. Kick, ban, or xtimeout.",
      "xtimeout is the one you'll like. Five hours muted. Join a voice channel, get pulled out. Open a thread, it's gone. Leave and rejoin, it comes back. It survives restarts, and only someone ranked above the punished member can lift it.",
    ],
  },
  {
    label: "Permissions",
    title: "What she needs, and why",
    body: [
      "Manage Messages to delete spam and links. Manage Channels to create #rize-logs and remove threads. Moderate Members for timeouts. Kick and Ban Members for the obvious. View Audit Log to know who deleted that channel.",
      "Her role has to sit above anyone she should be able to punish. That's also how authority works: the server owner, the whitelist role, or anyone ranked above Rize. Nobody outside your server has a say.",
    ],
  },
  {
    label: "Safety",
    title: "Safe to run",
    body: [
      "Your settings stay with the bot. No data sold, no third-party calls, no analytics companies. Message content is checked as it arrives and never stored. She keeps counts, not words.",
      "Logs go to a private #rize-logs channel only your staff can see. Remove the bot and your server's config goes with it.",
    ],
  },
];

function RizeSec() {
  return (
    <main className="mx-auto max-w-3xl px-6 pb-24 pt-16">
      <p className="font-display text-[11px] uppercase tracking-[0.5em] text-muted-foreground">RizeSec</p>
      <h1 className="mt-2 font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
        The part you read <span className="text-blood-sheen">before</span> you add her.
      </h1>
      <div className="mt-12 space-y-6">
        {sections.map((s) => (
          <section key={s.label} className="glass shine rounded-3xl p-7 sm:p-10">
            <p className="font-script text-3xl text-blood">{s.label}</p>
            <h2 className="mt-1 font-display text-xl font-bold">{s.title}</h2>
            <div className="mt-4 space-y-4 leading-relaxed text-muted-foreground">
              {s.body.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
            {s.link && (
              <a href={s.link.href} target="_blank" rel="noreferrer" className="mt-5 inline-block font-mono text-sm text-blood underline-offset-4 hover:underline">
                DEV &gt;&gt; {s.link.text}
              </a>
            )}
          </section>
        ))}
      </div>
    </main>
  );
}

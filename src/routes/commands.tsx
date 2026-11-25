import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/commands")({
  head: () => ({
    meta: [
      { title: "Rize — protections and commands" },
      { name: "description", content: "All 13 protections Rize can run, what sets each one off, and every slash command you need to steer her." },
      { property: "og:title", content: "Rize — protections and commands" },
      { property: "og:description", content: "All 13 protections Rize can run, what sets each one off, and every slash command you need to steer her." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Commands,
});

const protections = [
  { name: "spam", trigger: "6 messages from one person inside 5 seconds" },
  { name: "link", trigger: "an invite link, or one of the flagged domains — grabify, iplogger, dlscord.gg and the rest" },
  { name: "raid", trigger: "6 joins in 10 seconds. everyone in the burst is handled" },
  { name: "nuke", trigger: "3 channel, role or ban deletions in 15 seconds by the same person" },
  { name: "thread", trigger: "anyone outside the whitelist opens a thread. deleted on sight" },
  { name: "mention", trigger: "5 mentions in one message. @everyone counts as 5" },
  { name: "caps", trigger: "12 or more letters with over 75% of them uppercase" },
  { name: "zalgo", trigger: "10 or more combining marks in one message" },
  { name: "emoji", trigger: "10 emoji in one message" },
  { name: "ghostping", trigger: "pings you, then deletes or edits the message out inside a minute" },
  { name: "webhook", trigger: "a webhook appears in a channel. theirs get pulled, they get punished" },
  { name: "botadd", trigger: "a bot joins that isn't whitelisted. kicked, and the adder is found in the audit log" },
  { name: "vanity", trigger: "the server's vanity URL changes" },
];

const groups = [
  {
    label: "Configure",
    lines: [
      ["/setup", "make or fix #rize-logs"],
      ["/prefix set <new>", "change the message prefix, 1–5 characters"],
      ["/anti <module> <on|off>", "arm or disarm one protection"],
      ["/punishment <module> <kick|ban|xtimeout>", "what happens when that rule trips"],
      ["/antinuke stats", "see what is armed and what each one does"],
      ["/whitelist role add|remove", "the role that can configure Rize"],
      ["/whitelist bot add|remove", "bots she leaves alone"],
      ["/whitelist user add|remove", "people she leaves alone"],
      ["/whitelist list", "show the whole whitelist"],
    ],
  },
  {
    label: "Punish",
    lines: [
      ["/kick <user> [reason]", "kick someone"],
      ["/ban <user> [reason]", "ban someone"],
      ["/xtimeout <user> [reason]", "5h mute, no voice, no threads"],
      ["/unpunish <username>", "lift an xtimeout. needs a higher role than theirs"],
    ],
  },
  {
    label: "Watch",
    lines: [
      ["/userinfo [user]", "account age, join date, top role, violations"],
      ["/monitor <user>", "messages per minute, voice time, threads made, recent violations"],
    ],
  },
  {
    label: "Help",
    lines: [["/help", "the full list, in Discord"]],
  },
];

function Commands() {
  return (
    <main className="mx-auto max-w-5xl px-6 pb-24 pt-16">
      <p className="font-display text-[11px] uppercase tracking-[0.5em] text-muted-foreground">the full list</p>
      <h1 className="mt-2 font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
        Thirteen protections. <span className="text-blood-sheen">Every command.</span>
      </h1>
      <p className="mt-4 max-w-2xl text-balance text-muted-foreground">
        Nothing here is on by default. You arm what you want, you pick what each one does to someone, and she does the rest.
      </p>

      <section className="mt-14">
        <h2 className="font-script text-3xl text-blood">Protections</h2>
        <p className="mt-1 font-mono text-xs text-muted-foreground">
          each one: kick, ban or xtimeout · set with <span className="text-blood">/punishment</span>
        </p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {protections.map((p) => (
            <article key={p.name} className="glass shine rounded-2xl p-5">
              <h3 className="font-display text-sm font-bold uppercase tracking-[0.2em] text-blood">{p.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.trigger}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-16">
        <h2 className="font-script text-3xl text-blood">Commands</h2>
        <p className="mt-1 font-mono text-xs text-muted-foreground">
          slash always works · the same names work as message commands behind your prefix
        </p>
        <div className="mt-6 space-y-8">
          {groups.map((g) => (
            <div key={g.label} className="glass rounded-3xl p-6 sm:p-8">
              <h3 className="font-display text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground">{g.label}</h3>
              <ul className="mt-4 divide-y divide-border">
                {g.lines.map(([cmd, desc]) => (
                  <li key={cmd} className="flex flex-wrap items-baseline gap-x-4 gap-y-1 py-2.5">
                    <code className="font-mono text-sm text-blood">{cmd}</code>
                    <span className="text-sm text-muted-foreground">{desc}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-14 flex flex-wrap items-center gap-4">
        <Link
          to="/rizesec"
          className="glass shine inline-flex items-center rounded-full px-6 py-3 font-display text-xs font-bold uppercase tracking-[0.3em] transition hover:scale-[1.03]"
        >
          Read RizeSec first
        </Link>
        <a
          href="https://discord.com/oauth2/authorize?client_id=1574970846311620608"
          className="font-mono text-sm text-blood underline-offset-4 hover:underline"
        >
          or add her now &gt;&gt;
        </a>
      </div>
    </main>
  );
}

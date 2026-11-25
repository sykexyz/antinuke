import { createFileRoute } from "@tanstack/react-router";
import { HoldButton } from "@/components/HoldButton";
import { PlayingCards } from "@/components/PlayingCards";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Rize Security Bot" },
      { name: "description", content: "Add Rize to your Discord server. Anti-nuke, anti-raid, xtimeout and per-member monitoring." },
      { property: "og:title", content: "Rize Security Bot" },
      { property: "og:description", content: "Add Rize to your Discord server. Anti-nuke, anti-raid, xtimeout and per-member monitoring." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="mx-auto flex max-w-5xl flex-col items-center px-6 pb-24 pt-16 text-center">
      <p className="font-display text-[11px] uppercase tracking-[0.5em] text-muted-foreground">security for discord</p>
      <h1 className="text-blood-sheen mt-3 font-script text-7xl leading-[1.1] sm:text-8xl">Rize</h1>
      <p className="mt-4 max-w-md text-balance text-muted-foreground">
        She watches every member. Raids, nukes, spam, ghost pings. Handled before you notice.
      </p>
      <div className="mt-10">
        <HoldButton />
      </div>
      <p className="mt-3 font-mono text-xs text-muted-foreground">free. no owner ids. one token.</p>
      <div className="mt-16 w-full">
        <PlayingCards />
      </div>
    </main>
  );
}

import React, { useState, useMemo } from 'react';
import {
  useGetCommands,
  getGetCommandsQueryKey,
  useGetCommandsByCategory,
  getGetCommandsByCategoryQueryKey,
} from '@workspace/api-client-react';
import { Search } from 'lucide-react';

const CATEGORY_COLORS: Record<string, string> = {
  moderation:  '#818cf8',
  antinuke:    '#f472b6',
  economy:     '#fbbf24',
  leveling:    '#4ade80',
  utility:     '#c084fc',
  admin:       '#f87171',
  fun:         '#fb923c',
  tickets:     '#38bdf8',
};

function categoryColor(cat: string): string {
  return CATEGORY_COLORS[cat.toLowerCase()] ?? '#818cf8';
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    });
  };
  return (
    <button
      onClick={copy}
      className="text-muted-foreground hover:text-primary transition-colors p-1 rounded"
      title="Copy usage"
    >
      {copied ? (
        <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="2 8 6 12 14 4" />
        </svg>
      ) : (
        <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="6" y="6" width="8" height="8" rx="1" />
          <path d="M4 10H3a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v1" />
        </svg>
      )}
    </button>
  );
}

export default function Commands() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const { data: allCommands, isLoading: loadingAll } = useGetCommands({
    query: { queryKey: getGetCommandsQueryKey() },
  });

  const { data: catCommands, isLoading: loadingCat } = useGetCommandsByCategory(
    activeCategory ?? '',
    {
      query: {
        queryKey: getGetCommandsByCategoryQueryKey(activeCategory ?? ''),
        enabled: !!activeCategory,
      },
    },
  );

  const commands = activeCategory ? catCommands : allCommands;
  const isLoading = activeCategory ? loadingCat : loadingAll;

  const categories = useMemo(
    () => (allCommands ? Array.from(new Set(allCommands.map((c) => c.category))) : []),
    [allCommands],
  );

  const filtered = useMemo(() => {
    if (!commands) return [];
    const q = search.toLowerCase().trim();
    if (!q) return commands;
    return commands.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q),
    );
  }, [commands, search]);

  return (
    <div className="pt-32 pb-24 px-4 max-w-6xl mx-auto w-full">

      <div className="mb-10">
        <h1
          className="text-3xl md:text-4xl font-pixel text-gradient mb-3"
          style={{ fontFamily: "'Press Start 2P', cursive" }}
        >
          Commands
        </h1>
        <p className="text-muted-foreground">
          {allCommands ? `${allCommands.length} commands` : 'Loading…'}
          {activeCategory && ` in ${activeCategory}`}
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-7">

        {/* Sidebar */}
        <aside className="w-full md:w-52 flex-shrink-0">
          <div className="pixel-card rounded-xl p-4 md:sticky md:top-28">

            <div className="relative mb-4">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-[hsl(240_28%_9%)] border border-[hsl(239_84%_73%/0.15)] rounded-md py-2 pl-8 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[hsl(239_84%_73%/0.45)] transition-colors"
              />
            </div>

            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-3">Categories</p>
            <div className="flex flex-col gap-0.5">
              <button
                onClick={() => setActiveCategory(null)}
                className={`text-left text-sm px-3 py-2 rounded-md transition-colors ${
                  activeCategory === null
                    ? 'bg-[hsl(239_84%_73%/0.12)] text-foreground font-medium'
                    : 'text-muted-foreground hover:text-foreground hover:bg-[hsl(239_84%_73%/0.05)]'
                }`}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`text-left text-sm px-3 py-2 rounded-md transition-colors flex items-center gap-2 ${
                    activeCategory === cat
                      ? 'bg-[hsl(239_84%_73%/0.12)] text-foreground font-medium'
                      : 'text-muted-foreground hover:text-foreground hover:bg-[hsl(239_84%_73%/0.05)]'
                  }`}
                >
                  <div
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ background: categoryColor(cat) }}
                  />
                  <span className="capitalize">{cat}</span>
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Commands grid */}
        <div className="flex-grow">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4 text-muted-foreground">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <span className="text-sm">Loading commands…</span>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-24 text-muted-foreground">
              <p className="text-4xl mb-4">🌿</p>
              <p className="font-medium">No commands found</p>
              <p className="text-sm mt-1">Try a different search or category</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filtered.map((cmd) => {
                const color = categoryColor(cmd.category);
                return (
                  <div key={cmd.name} className="pixel-card rounded-xl p-5">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <div
                          className="w-1 h-5 rounded-full flex-shrink-0"
                          style={{ background: color }}
                        />
                        <h3 className="font-semibold text-foreground text-sm truncate">
                          /{cmd.name}
                        </h3>
                      </div>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        {cmd.ownerOnly && (
                          <span className="text-[10px] bg-[hsl(0_72%_58%/0.15)] text-[#f87171] px-1.5 py-0.5 rounded font-medium">
                            Owner
                          </span>
                        )}
                        <span
                          className="text-[10px] px-1.5 py-0.5 rounded font-medium capitalize"
                          style={{ background: `${color}18`, color }}
                        >
                          {cmd.category}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-muted-foreground leading-relaxed mb-3 line-clamp-2">
                      {cmd.description}
                    </p>

                    {cmd.usage && (
                      <div className="flex items-center justify-between bg-[hsl(240_28%_9%)] rounded-md px-3 py-1.5 border border-[hsl(239_84%_73%/0.08)]">
                        <code className="text-xs text-muted-foreground font-mono truncate">{cmd.usage}</code>
                        <CopyButton text={cmd.usage} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

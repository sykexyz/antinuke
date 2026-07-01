import React, { useState } from 'react';
import { useGetCommands, getGetCommandsQueryKey, useGetCommandsByCategory, getGetCommandsByCategoryQueryKey } from '@workspace/api-client-react';

export default function Commands() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const { data: allCommands, isLoading: isLoadingAll } = useGetCommands({
    query: { queryKey: getGetCommandsQueryKey() }
  });

  const { data: categoryCommands, isLoading: isLoadingCategory } = useGetCommandsByCategory(
    activeCategory || "", 
    { query: { queryKey: getGetCommandsByCategoryQueryKey(activeCategory || ""), enabled: !!activeCategory } }
  );

  const commands = activeCategory ? categoryCommands : allCommands;
  const isLoading = activeCategory ? isLoadingCategory : isLoadingAll;

  // Compute unique categories from all commands
  const categories = allCommands ? Array.from(new Set(allCommands.map(c => c.category))) : [];

  const filteredCommands = commands?.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="pt-32 pb-20 px-4 max-w-6xl mx-auto w-full">
      <h1 className="text-4xl md:text-6xl font-pixel text-gradient mb-8">COMMAND DIRECTORY</h1>
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="glass-panel p-4 sticky top-32">
            <input 
              type="text"
              placeholder="Search commands..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#050f05] border border-primary/30 text-white p-2 mb-4 font-mono text-sm focus:outline-none focus:border-primary"
            />
            
            <h3 className="font-pixel text-xs text-primary mb-3">CATEGORIES</h3>
            <div className="flex flex-col gap-2">
              <button 
                onClick={() => setActiveCategory(null)}
                className={`text-left font-mono text-sm px-3 py-2 transition-colors border-l-2 ${activeCategory === null ? 'border-primary text-white bg-primary/10' : 'border-transparent text-gray-400 hover:text-white'}`}
              >
                All Commands
              </button>
              {categories.map(cat => (
                <button 
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`text-left font-mono text-sm px-3 py-2 transition-colors border-l-2 ${activeCategory === cat ? 'border-primary text-white bg-primary/10' : 'border-transparent text-gray-400 hover:text-white hover:border-primary/50'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-grow">
          {isLoading ? (
            <div className="flex justify-center py-20">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredCommands?.map(cmd => (
                <div key={cmd.name} className="glass-panel p-6 hover:border-primary/50 transition-colors group">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-pixel text-sm text-primary mb-1">/{cmd.name}</h3>
                    {cmd.ownerOnly && <span className="text-[10px] bg-red-500/20 text-red-400 px-2 py-1 rounded font-mono">OWNER</span>}
                  </div>
                  <p className="text-sm text-gray-300 mb-4 font-mono line-clamp-2">{cmd.description}</p>
                  <div className="bg-[#050f05] p-2 border border-primary/20 text-xs font-mono text-gray-400 flex justify-between items-center">
                    <code>{cmd.usage}</code>
                    <button className="text-primary hover:text-white p-1" title="Copy">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

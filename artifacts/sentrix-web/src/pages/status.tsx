import React from 'react';
import { useGetBotStats, useGetBotStatus } from '@workspace/api-client-react';

export default function Status() {
  const { data: stats, isLoading: statsLoading } = useGetBotStats();
  const { data: status, isLoading: statusLoading } = useGetBotStatus();

  const isOnline = status?.online ?? true;
  const statusColor = isOnline ? 'text-primary border-primary bg-primary/10' : 'text-red-500 border-red-500 bg-red-500/10';
  const statusText = isOnline ? 'SYSTEM OPERATIONAL' : 'SYSTEM OFFLINE';

  const formatUptime = (seconds: number) => {
    const d = Math.floor(seconds / (3600*24));
    const h = Math.floor(seconds % (3600*24) / 3600);
    const m = Math.floor(seconds % 3600 / 60);
    return `${d}d ${h}h ${m}m`;
  };

  return (
    <div className="pt-32 pb-20 px-4 max-w-4xl mx-auto w-full">
      <h1 className="text-4xl md:text-6xl font-pixel text-gradient mb-12">SYSTEM STATUS</h1>

      <div className={`mb-12 border p-6 flex items-center gap-4 ${statusColor} neon-box-shadow`}>
        <div className={`w-4 h-4 rounded-full ${isOnline ? 'bg-primary status-dot-pulse' : 'bg-red-500'}`} />
        <span className="font-pixel text-xl">{statusLoading ? 'SCANNING...' : statusText}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-panel p-8">
          <h3 className="font-pixel text-xs text-gray-400 mb-4">NETWORK LATENCY</h3>
          <div className="text-4xl font-mono text-white mb-2">
            {statsLoading ? '--' : stats?.ping} <span className="text-primary text-xl">ms</span>
          </div>
          <div className="w-full bg-[#050f05] h-2 border border-primary/20 overflow-hidden">
            <div className="bg-primary h-full w-[15%]" />
          </div>
        </div>

        <div className="glass-panel p-8">
          <h3 className="font-pixel text-xs text-gray-400 mb-4">UPTIME</h3>
          <div className="text-4xl font-mono text-white mb-2">
            {statsLoading ? '--' : formatUptime(stats?.uptime || 0)}
          </div>
          <div className="w-full bg-[#050f05] h-2 border border-primary/20 overflow-hidden">
            <div className="bg-primary h-full w-[99.9%]" />
          </div>
        </div>

        <div className="glass-panel p-8">
          <h3 className="font-pixel text-xs text-gray-400 mb-4">ACTIVE SHARDS</h3>
          <div className="text-4xl font-mono text-white">1 / 1</div>
        </div>

        <div className="glass-panel p-8">
          <h3 className="font-pixel text-xs text-gray-400 mb-4">BOT STATUS</h3>
          <div className="text-4xl font-mono text-white uppercase">{statsLoading ? '--' : stats?.status}</div>
        </div>
      </div>
    </div>
  );
}

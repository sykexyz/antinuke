import React from 'react';
import { useGetBotStats, useGetBotStatus } from '@workspace/api-client-react';

function formatUptime(seconds: number): string {
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (d > 0) return `${d}d ${h}h ${m}m`;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

function PingBar({ ping }: { ping: number }) {
  const pct = Math.min(100, Math.max(0, 100 - (ping / 5)));
  const color = ping < 100 ? '#4ade80' : ping < 250 ? '#fbbf24' : '#f472b6';
  return (
    <div className="w-full h-1.5 rounded-full bg-[hsl(239_84%_73%/0.08)] overflow-hidden mt-3">
      <div
        className="h-full rounded-full transition-all duration-700"
        style={{ width: `${pct}%`, background: color }}
      />
    </div>
  );
}

function StatCard({ label, value, sub, color = '#818cf8' }: {
  label: string; value: React.ReactNode; sub?: React.ReactNode; color?: string;
}) {
  return (
    <div className="pixel-card rounded-xl p-7">
      <p className="text-xs text-muted-foreground font-medium tracking-wide uppercase mb-3">{label}</p>
      <div className="text-3xl font-semibold text-foreground mb-0.5" style={{ color }}>
        {value}
      </div>
      {sub}
    </div>
  );
}

export default function Status() {
  const { data: stats, isLoading: statsLoading } = useGetBotStats();
  const { data: status, isLoading: statusLoading } = useGetBotStatus();

  const isOnline = status?.online ?? false;
  const ping = stats?.ping ?? 0;
  const uptime = stats?.uptime ?? 0;

  return (
    <div className="pt-32 pb-24 px-4 max-w-4xl mx-auto w-full">

      <div className="mb-12">
        <h1
          className="text-3xl md:text-4xl font-pixel text-gradient mb-4"
          style={{ fontFamily: "'Press Start 2P', cursive" }}
        >
          Status
        </h1>
        <p className="text-muted-foreground">Live health info for the Sentrix bot.</p>
      </div>

      {/* Overall status banner */}
      <div
        className={`pixel-card rounded-xl p-5 flex items-center gap-4 mb-8 ${
          isOnline ? 'border-[hsl(142_71%_58%/0.3)]' : 'border-[hsl(0_72%_58%/0.3)]'
        }`}
      >
        <div
          className={`w-3 h-3 rounded-full flex-shrink-0 ${isOnline ? 'bg-[#4ade80] status-pulse' : 'bg-[#f87171]'}`}
        />
        <div>
          <p className="font-semibold text-foreground text-sm">
            {statusLoading ? 'Checking…' : isOnline ? 'All good' : 'Offline'}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {statusLoading ? '' : isOnline ? 'Sentrix is online and running normally.' : 'Sentrix is currently offline.'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <StatCard
          label="Ping"
          color={ping < 100 ? '#4ade80' : ping < 250 ? '#fbbf24' : '#f87171'}
          value={
            statsLoading
              ? '—'
              : <>{ping} <span className="text-lg text-muted-foreground font-normal">ms</span></>
          }
          sub={!statsLoading && <PingBar ping={ping} />}
        />

        <StatCard
          label="Uptime"
          value={statsLoading ? '—' : formatUptime(uptime)}
          sub={
            !statsLoading && (
              <div className="w-full h-1.5 rounded-full bg-[hsl(239_84%_73%/0.08)] overflow-hidden mt-3">
                <div className="h-full rounded-full bg-[#818cf8]" style={{ width: '99.9%' }} />
              </div>
            )
          }
        />

        <StatCard
          label="Shards"
          value="1 / 1"
          color="#c084fc"
          sub={<p className="text-xs text-muted-foreground mt-1">Single shard</p>}
        />

        <StatCard
          label="Bot status"
          color={isOnline ? '#4ade80' : '#f87171'}
          value={statsLoading ? '—' : stats?.status ?? 'unknown'}
          sub={
            <p className="text-xs text-muted-foreground mt-1">
              {isOnline ? 'Responding to commands' : 'Not responding'}
            </p>
          }
        />
      </div>

      <div className="mt-10 pixel-card rounded-xl p-6">
        <h3 className="font-semibold text-foreground text-sm mb-5">Services</h3>
        <div className="space-y-4">
          {[
            { name: 'Discord Gateway',   ok: isOnline },
            { name: 'Database',          ok: true     },
            { name: 'Command handler',   ok: isOnline },
            { name: 'Anti-nuke engine',  ok: isOnline },
          ].map((svc) => (
            <div key={svc.name} className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{svc.name}</span>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${svc.ok ? 'bg-[#4ade80]' : 'bg-[#f87171]'}`} />
                <span className={`text-xs font-medium ${svc.ok ? 'text-[#4ade80]' : 'text-[#f87171]'}`}>
                  {svc.ok ? 'Running' : 'Down'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

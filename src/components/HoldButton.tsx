import { useEffect, useRef, useState } from "react";

const HOLD_MS = 1600;
const ADD_URL = "https://discord.com/oauth2/authorize?client_id=1574970846311620608";

// blood in water: a few blobs grow under a turbulence + displacement filter
const blobs = [
  { x: 50, y: 50, r: 1 },
  { x: 22, y: 60, r: 0.7 },
  { x: 78, y: 40, r: 0.8 },
  { x: 40, y: 30, r: 0.55 },
  { x: 65, y: 72, r: 0.6 },
];

export function HoldButton() {
  const [p, setP] = useState(0);
  const [seed, setSeed] = useState(0);
  const raf = useRef(0);
  const start = useRef(0);
  const done = useRef(false);

  const tick = (t: number) => {
    const v = Math.min(1, (t - start.current) / HOLD_MS);
    setP(v);
    setSeed(t / 900);
    if (v >= 1 && !done.current) {
      done.current = true;
      window.location.href = ADD_URL;
      return;
    }
    raf.current = requestAnimationFrame(tick);
  };

  const down = () => {
    done.current = false;
    start.current = performance.now();
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(tick);
  };

  // let go early and the ink pulls back
  const up = () => {
    if (done.current) return;
    cancelAnimationFrame(raf.current);
    const from = p;
    const t0 = performance.now();
    const back = (t: number) => {
      const v = Math.max(0, from - (t - t0) / 400);
      setP(v);
      if (v > 0) raf.current = requestAnimationFrame(back);
    };
    raf.current = requestAnimationFrame(back);
  };

  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  const ease = 1 - Math.pow(1 - p, 2.2);

  return (
    <button
      onPointerDown={down}
      onPointerUp={up}
      onPointerLeave={up}
      onPointerCancel={up}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && !e.repeat && down()}
      onKeyUp={up}
      onContextMenu={(e) => e.preventDefault()}
      aria-label="Hold to add Rize to your server"
      className="shine relative h-16 w-72 select-none overflow-hidden rounded-full border border-border shadow-[var(--shadow-glass)] touch-none"
      style={{ background: "var(--metal)" }}
    >
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
        <defs>
          <filter id="ink" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency={0.035 + Math.sin(seed) * 0.008} numOctaves="3" seed="7" result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale={18 + ease * 14} xChannelSelector="R" yChannelSelector="G" result="d" />
            <feGaussianBlur in="d" stdDeviation={1.2 - ease * 0.8} />
          </filter>
          <radialGradient id="ink-fill">
            <stop offset="0%" stopColor="var(--blood-deep)" />
            <stop offset="70%" stopColor="var(--blood)" />
            <stop offset="100%" stopColor="var(--blood)" stopOpacity="0.6" />
          </radialGradient>
        </defs>
        <g filter="url(#ink)">
          {blobs.map((b, i) => (
            <circle key={i} cx={b.x} cy={b.y} r={Math.max(0, ease * 95 * b.r - i * 4 * (1 - ease))} fill="url(#ink-fill)" />
          ))}
        </g>
      </svg>
      <span
        className="relative z-10 font-display text-sm font-bold uppercase tracking-[0.3em] transition-colors"
        style={{ color: ease > 0.45 ? "var(--primary-foreground)" : "var(--blood-deep)" }}
      >
        {p > 0 ? (p >= 1 ? "opening…" : "keep holding") : "hold to add Rize"}
      </span>
    </button>
  );
}

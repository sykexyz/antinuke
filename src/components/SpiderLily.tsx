// hand-tuned petals. 6 curled petals + long stamens, the classic higanbana shape
const petals = [0, 60, 120, 180, 240, 300];
const stamens = [-75, -50, -25, 0, 25, 50, 75, 100, 130, 160, 200, 230];

export function SpiderLily({ size = 28, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="-50 -50 100 100" className={className} aria-hidden>
      <defs>
        <radialGradient id="lily-petal" cx="0" cy="0" r="1" gradientUnits="objectBoundingBox">
          <stop offset="0%" stopColor="var(--blood-deep)" />
          <stop offset="60%" stopColor="var(--blood)" />
          <stop offset="100%" stopColor="var(--blood)" stopOpacity="0.85" />
        </radialGradient>
      </defs>
      {stamens.map((a) => (
        <g key={a} transform={`rotate(${a})`}>
          <path d="M0 0 C 8 -18, 20 -30, 34 -40" stroke="var(--blood)" strokeWidth="1.2" fill="none" strokeLinecap="round" />
          <circle cx="34" cy="-40" r="1.8" fill="var(--blood-deep)" />
        </g>
      ))}
      {petals.map((a) => (
        <path
          key={a}
          transform={`rotate(${a})`}
          d="M0 0 C 4 -8, 10 -16, 6 -26 C 3 -31, -4 -28, -2 -22 C 0 -16, -3 -8, 0 0 Z"
          fill="url(#lily-petal)"
        />
      ))}
      <circle r="3" fill="var(--blood-deep)" />
    </svg>
  );
}

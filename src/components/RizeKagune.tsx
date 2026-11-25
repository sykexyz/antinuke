import { useEffect, useRef, type ReactNode } from "react";

interface Point {
  x: number;
  y: number;
}

interface KaguneDef {
  id: string;
  name: string;
  isLong: boolean;
  litSide: "left" | "right";
  baseSpine: Point[];
  widths: number[];
  freq: { f1: number; f2: number; f3: number; f4: number };
  phase: { p1: number; p2: number; p3: number; p4: number };
  amp: { a1: number; a2: number; a3: number; a4: number };
  flickInterval: number;
}

// 4 distinct Kagune tentacles
const KAGUNE_CONFIGS: KaguneDef[] = [
  // 1. Upper-Left (Shorter): arches up-left, curls inward cradling upper-left edge of player
  {
    id: "ul",
    name: "Upper Left",
    isLong: false,
    litSide: "left",
    baseSpine: [
      { x: 290, y: 220 }, // P0: base behind player
      { x: 220, y: 180 }, // P1: emerges
      { x: 145, y: 130 }, // P2: arching up-left
      { x: 80, y: 105 },  // P3: apex
      { x: 55, y: 145 },  // P4: curl
      { x: 125, y: 185 }, // P5: pre-tip
      { x: 222, y: 180 }, // P6: claw tip gripping card edge
    ],
    widths: [48, 42, 34, 26, 18, 14, 0],
    freq: { f1: 0.95, f2: 1.65, f3: 0.85, f4: 1.45 },
    phase: { p1: 0.4, p2: 1.9, p3: 2.7, p4: 0.8 },
    amp: { a1: 14, a2: 8, a3: 16, a4: 9 },
    flickInterval: 5.2,
  },
  // 2. Lower-Left (Longer): sweeps menacingly down-left, curls up to lower-left edge
  {
    id: "ll",
    name: "Lower Left",
    isLong: true,
    litSide: "right",
    baseSpine: [
      { x: 300, y: 310 }, // P0: base behind player
      { x: 220, y: 340 }, // P1: emerges
      { x: 140, y: 415 }, // P2: sweep down-left
      { x: 60, y: 430 },  // P3: wide lower apex
      { x: 20, y: 360 },  // P4: bend up
      { x: 45, y: 290 },  // P5: curl up
      { x: 125, y: 265 }, // P6: pre-tip
      { x: 222, y: 260 }, // P7: claw tip gripping card edge
    ],
    widths: [58, 52, 44, 36, 26, 18, 14, 0],
    freq: { f1: 0.75, f2: 1.35, f3: 0.65, f4: 1.2 },
    phase: { p1: 1.8, p2: 3.4, p3: 0.9, p4: 2.2 },
    amp: { a1: 18, a2: 10, a3: 20, a4: 11 },
    flickInterval: 6.8,
  },
  // 3. Upper-Right (Shorter): arches up-right, curls inward cradling upper-right edge of player
  {
    id: "ur",
    name: "Upper Right",
    isLong: false,
    litSide: "right",
    baseSpine: [
      { x: 470, y: 220 }, // P0: base behind player
      { x: 540, y: 180 }, // P1: emerges
      { x: 615, y: 130 }, // P2: arching up-right
      { x: 680, y: 105 }, // P3: apex
      { x: 705, y: 145 }, // P4: curl
      { x: 635, y: 185 }, // P5: pre-tip
      { x: 538, y: 180 }, // P6: claw tip gripping card edge
    ],
    widths: [48, 42, 34, 26, 18, 14, 0],
    freq: { f1: 1.05, f2: 1.75, f3: 0.9, f4: 1.55 },
    phase: { p1: 2.6, p2: 0.7, p3: 3.8, p4: 1.4 },
    amp: { a1: 13, a2: 7, a3: 15, a4: 8 },
    flickInterval: 4.8,
  },
  // 4. Lower-Right (Longer): sweeps menacingly down-right, curls up to lower-right edge
  {
    id: "lr",
    name: "Lower Right",
    isLong: true,
    litSide: "left",
    baseSpine: [
      { x: 460, y: 310 }, // P0: base behind player
      { x: 540, y: 340 }, // P1: emerges
      { x: 620, y: 415 }, // P2: sweep down-right
      { x: 700, y: 430 }, // P3: wide lower apex
      { x: 740, y: 360 }, // P4: bend up
      { x: 715, y: 290 }, // P5: curl up
      { x: 635, y: 265 }, // P6: pre-tip
      { x: 538, y: 260 }, // P7: claw tip gripping card edge
    ],
    widths: [58, 52, 44, 36, 26, 18, 14, 0],
    freq: { f1: 0.7, f2: 1.25, f3: 0.6, f4: 1.15 },
    phase: { p1: 3.9, p2: 1.2, p3: 2.1, p4: 0.5 },
    amp: { a1: 17, a2: 9, a3: 19, a4: 10 },
    flickInterval: 7.2,
  },
];

// Catmull-Rom cubic bezier spline generator for smooth organic tentacle outlines
function pointsToSpline(pts: Point[]): string {
  if (pts.length < 2) return "";
  let d = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(i - 1, 0)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(i + 2, pts.length - 1)];

    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    d += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  }
  return d;
}

// Generate closed contour from left side and right side points
function buildContourPath(leftPts: Point[], rightPts: Point[]): string {
  if (leftPts.length < 2 || rightPts.length < 2) return "";
  const reversedRight = [...rightPts].reverse();
  const d = pointsToSpline(leftPts);
  let rightSpline = "";
  for (let i = 0; i < reversedRight.length - 1; i++) {
    const p0 = reversedRight[Math.max(i - 1, 0)];
    const p1 = reversedRight[i];
    const p2 = reversedRight[i + 1];
    const p3 = reversedRight[Math.min(i + 2, reversedRight.length - 1)];

    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    rightSpline += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  }
  return `${d} ${rightSpline} Z`;
}

// Compute normal and edge offsets along spine
function computeTentacleGeom(spine: Point[], widths: number[]) {
  const n = spine.length;
  const leftPts: Point[] = [];
  const rightPts: Point[] = [];
  const midPts: Point[] = [];
  const normals: { nx: number; ny: number }[] = [];

  for (let i = 0; i < n; i++) {
    const p = spine[i];
    let tx = 0;
    let ty = 0;
    if (i === 0) {
      tx = spine[1].x - spine[0].x;
      ty = spine[1].y - spine[0].y;
    } else if (i === n - 1) {
      tx = spine[n - 1].x - spine[n - 2].x;
      ty = spine[n - 1].y - spine[n - 2].y;
    } else {
      tx = spine[i + 1].x - spine[i - 1].x;
      ty = spine[i + 1].y - spine[i - 1].y;
    }

    const len = Math.hypot(tx, ty) || 1;
    const nx = -ty / len;
    const ny = tx / len;
    normals.push({ nx, ny });

    let w = widths[i];
    // Anime petal / claw flare before needle tip
    if (i === n - 2) {
      w = Math.max(w, 15);
    }

    const halfW = w / 2;
    leftPts.push({ x: p.x + nx * halfW, y: p.y + ny * halfW });
    rightPts.push({ x: p.x - nx * halfW, y: p.y - ny * halfW });
    // Mid cel-shaded boundary (~45% of width towards lit side)
    midPts.push({ x: p.x + nx * (halfW * 0.1), y: p.y + ny * (halfW * 0.1) });
  }

  return { leftPts, rightPts, midPts, normals };
}

export function RizeKaguneContainer({ children }: { children: ReactNode }) {
  const behindSvgRef = useRef<SVGSVGElement>(null);
  const frontSvgRef = useRef<SVGSVGElement>(null);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const behindSvg = behindSvgRef.current;
    const frontSvg = frontSvgRef.current;
    if (!behindSvg) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = window.innerWidth < 640;
    const ampScale = isMobile ? 0.6 : 1.0;

    // Independent state per kagune: random phases, frequencies, and flick spikes
    const kaguneStates = KAGUNE_CONFIGS.map((cfg, idx) => ({
      flickTimer: cfg.flickInterval * (0.6 + Math.random() * 0.8),
      flicking: false,
      flickProgress: 0,
      flickDir: idx % 2 === 0 ? -1 : 1,
    }));

    let lastTime = performance.now();
    let totalSec = 0;

    const renderFrame = (now: number) => {
      // 60fps capping with max deltaTime step to prevent jumps
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
      totalSec += dt;

      KAGUNE_CONFIGS.forEach((cfg, kIdx) => {
        const state = kaguneStates[kIdx];

        // Random whip flick spikes (every 4-8s, randomized per kagune; disabled on mobile/reduced-motion)
        let flickOffsetMag = 0;
        if (!prefersReduced && !isMobile) {
          state.flickTimer -= dt;
          if (state.flickTimer <= 0 && !state.flicking) {
            state.flicking = true;
            state.flickProgress = 0;
            state.flickTimer = cfg.flickInterval * (0.7 + Math.random() * 0.6);
          }

          if (state.flicking) {
            state.flickProgress += dt;
            if (state.flickProgress < 0.4) {
              // Rapid outward snap over ~0.4s
              flickOffsetMag = Math.sin((state.flickProgress / 0.4) * (Math.PI / 2)) * 32;
            } else if (state.flickProgress < 1.6) {
              // Smooth return over ~1.2s
              const recoverT = (state.flickProgress - 0.4) / 1.2;
              flickOffsetMag = (1 - recoverT) * 32;
            } else {
              state.flicking = false;
            }
          }
        }

        // Animate backbone spine points
        const spine: Point[] = cfg.baseSpine.map((basePt, sIdx) => {
          if (prefersReduced) return { ...basePt };

          const n = cfg.baseSpine.length;
          // Whip effect: delay propagates down the kagune (+0.35 phase per segment)
          const segDelay = sIdx * 0.35;
          // Anchor weight: base stays anchored behind player, wave amplifies toward tip
          const weight = Math.pow(sIdx / (n - 1), 1.25);

          // Multi-frequency layered drift (never repeats exactly)
          const dx =
            (Math.sin(totalSec * cfg.freq.f1 + cfg.phase.p1 + segDelay) * cfg.amp.a1 +
              Math.sin(totalSec * cfg.freq.f2 + cfg.phase.p2 + segDelay * 1.3) * cfg.amp.a2) *
            weight *
            ampScale;

          const dy =
            (Math.cos(totalSec * cfg.freq.f3 + cfg.phase.p3 + segDelay) * cfg.amp.a3 +
              Math.sin(totalSec * cfg.freq.f4 + cfg.phase.p4 + segDelay * 1.2) * cfg.amp.a4) *
            weight *
            ampScale;

          // Apply whip flick to outer segments
          let flickX = 0;
          let flickY = 0;
          if (flickOffsetMag > 0 && sIdx >= n - 3) {
            const flickWeight = (sIdx - (n - 4)) / 3;
            flickX = state.flickDir * flickOffsetMag * flickWeight;
            flickY = (sIdx % 2 === 0 ? -1 : 1) * flickOffsetMag * 0.4 * flickWeight;
          }

          return {
            x: basePt.x + dx + flickX,
            y: basePt.y + dy + flickY,
          };
        });

        // Compute contour geometry
        const { leftPts, rightPts, midPts } = computeTentacleGeom(spine, cfg.widths);
        const mainContour = buildContourPath(leftPts, rightPts);

        // Update behind SVG elements
        const bodyEl = behindSvg.querySelector<SVGPathElement>(`#kagune-body-${cfg.id}`);
        const glowEl = behindSvg.querySelector<SVGPathElement>(`#kagune-glow-${cfg.id}`);
        const celEl = behindSvg.querySelector<SVGPathElement>(`#kagune-cel-${cfg.id}`);
        const highlightEl = behindSvg.querySelector<SVGPathElement>(`#kagune-highlight-${cfg.id}`);

        if (bodyEl) bodyEl.setAttribute("d", mainContour);
        if (glowEl) glowEl.setAttribute("d", mainContour);

        // Cel-shaded mid layer on lit side
        if (celEl) {
          const litPts = cfg.litSide === "left" ? leftPts : rightPts;
          const celContour = buildContourPath(litPts, midPts);
          celEl.setAttribute("d", celContour);
        }

        // Highlight streak along lit crest (single crisp anime streak)
        if (highlightEl) {
          const litPts = cfg.litSide === "left" ? leftPts : rightPts;
          const hPts = litPts.slice(1, litPts.length - 1);
          highlightEl.setAttribute("d", pointsToSpline(hPts));
        }

        // Front claw tip (overlapping the player card edges)
        if (frontSvg) {
          const tipEl = frontSvg.querySelector<SVGPathElement>(`#kagune-tip-${cfg.id}`);
          if (tipEl) {
            const clawLeft = leftPts.slice(-3);
            const clawRight = rightPts.slice(-3);
            tipEl.setAttribute("d", buildContourPath(clawLeft, clawRight));
          }
        }

        // Stylized cartoon scales (rounded diamond shapes on outer curve)
        const n = spine.length;
        for (let s = 1; s <= 4; s++) {
          const scaleEl = behindSvg.querySelector<SVGPolygonElement>(`#scale-${cfg.id}-${s}`);
          if (scaleEl && s < n - 1) {
            const pt = spine[s];
            const w = cfg.widths[s];
            const size = Math.max(w * 0.28, 4);
            const scalePoints = `${pt.x},${pt.y - size} ${pt.x + size * 1.3},${pt.y} ${pt.x},${pt.y + size} ${pt.x - size * 1.3},${pt.y}`;
            scaleEl.setAttribute("points", scalePoints);
          }
        }

        // Muscle striation lines across segments
        for (let st = 1; st <= 3; st++) {
          const lineEl = behindSvg.querySelector<SVGPathElement>(`#striation-${cfg.id}-${st}`);
          if (lineEl && st < n - 1) {
            const lp = leftPts[st];
            const rp = rightPts[st];
            const mx = (lp.x + rp.x) / 2 + (cfg.litSide === "left" ? 3 : -3);
            const my = (lp.y + rp.y) / 2;
            lineEl.setAttribute("d", `M ${lp.x.toFixed(1)} ${lp.y.toFixed(1)} Q ${mx.toFixed(1)} ${my.toFixed(1)} ${rp.x.toFixed(1)} ${rp.y.toFixed(1)}`);
          }
        }
      });

      animFrameRef.current = requestAnimationFrame(renderFrame);
    };

    animFrameRef.current = requestAnimationFrame(renderFrame);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  return (
    <div className="relative flex items-center justify-center">
      {/* 1. Behind Layer: Tentacle bodies, cel-shading, scales, glow aura */}
      <svg
        ref={behindSvgRef}
        viewBox="0 0 760 540"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[480px] w-[660px] sm:h-[540px] sm:w-[760px] z-0 overflow-visible select-none"
      >
        <defs>
          {/* Atmospheric red glow filter: #E01E37, blur(18px), opacity 0.45 */}
          <filter id="kagune-aura-blur" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="18" result="blur" />
          </filter>

          {/* Radial ambient glow tinting surrounding site and card */}
          <radialGradient id="kagune-ambient-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#E01E37" stopOpacity="0.45" />
            <stop offset="55%" stopColor="#8a0018" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#2a0004" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Ambient pulsing red aura behind kagune (~4s heartbeat pulse) */}
        <circle
          cx="380"
          cy="270"
          r="300"
          fill="url(#kagune-ambient-glow)"
          className="kagune-glow-pulse"
        />

        {/* 4 Kagune tentacles */}
        {KAGUNE_CONFIGS.map((cfg) => (
          <g key={cfg.id} id={`kagune-group-${cfg.id}`}>
            {/* Soft red glow duplicate shape */}
            <path
              id={`kagune-glow-${cfg.id}`}
              fill="#E01E37"
              filter="url(#kagune-aura-blur)"
              className="kagune-glow-pulse"
            />

            {/* Base blood red fill (#8a0018) + Bold anime dark outline (#2a0004, 2.5px) */}
            <path
              id={`kagune-body-${cfg.id}`}
              fill="#8a0018"
              stroke="#2a0004"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />

            {/* Mid layer: brighter red #c4001f on lit side (flat anime cel-shading) */}
            <path
              id={`kagune-cel-${cfg.id}`}
              fill="#c4001f"
              opacity="0.95"
            />

            {/* Muscle striations (thin curved darker red lines) */}
            {[1, 2, 3].map((st) => (
              <path
                key={`striation-${cfg.id}-${st}`}
                id={`striation-${cfg.id}-${st}`}
                stroke="#4a0008"
                strokeWidth="1.5"
                strokeLinecap="round"
                opacity="0.75"
              />
            ))}

            {/* Cartoon scales on outer curve (rounded diamonds, scaling down to tip) */}
            {[1, 2, 3, 4].map((s) => (
              <polygon
                key={`scale-${cfg.id}-${s}`}
                id={`scale-${cfg.id}-${s}`}
                fill="#c4001f"
                stroke="#4a0008"
                strokeWidth="1.5"
                strokeLinejoin="round"
                opacity="0.9"
              />
            ))}

            {/* Highlight streak along lit crest (single pale red #ff5a6e anime band) */}
            <path
              id={`kagune-highlight-${cfg.id}`}
              stroke="#ff5a6e"
              strokeWidth="3.2"
              strokeLinecap="round"
              fill="none"
              opacity="0.9"
            />
          </g>
        ))}
      </svg>

      {/* 2. Player card nestled at z-10 */}
      <div className="relative z-10">
        {children}
      </div>

      {/* 3. Front Layer at z-20: Claw tips overlapping the player card edges (gripping effect) */}
      <svg
        ref={frontSvgRef}
        viewBox="0 0 760 540"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[480px] w-[660px] sm:h-[540px] sm:w-[760px] z-20 overflow-visible select-none"
      >
        {KAGUNE_CONFIGS.map((cfg) => (
          <path
            key={`front-tip-${cfg.id}`}
            id={`kagune-tip-${cfg.id}`}
            fill="#c4001f"
            stroke="#2a0004"
            strokeWidth="2.5"
            strokeLinejoin="round"
            className="drop-shadow-[0_2px_8px_rgba(42,0,4,0.7)]"
          />
        ))}
      </svg>
    </div>
  );
}

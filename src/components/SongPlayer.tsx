import { useEffect, useRef, useState, type PointerEvent } from "react";

const TRACK = {
  src: "https://file.garden/aahuG_hIDGRlXD24/Tokyo%20Ghoul%20Opening%20Unravel%20by%20TK%20from%20Ling%20Toshite%20Sigure.mp3",
  title: "Unravel",
  artist: "TK from Ling Tosite Sigure",
  art: "https://file.garden/aahuG_hIDGRlXD24/b189922eab130325a3995bfa1a3021eb.gif",
};

function formatTime(sec: number) {
  if (!isFinite(sec) || isNaN(sec)) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function SongPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [collapsed, setCollapsed] = useState(false);
  const [mutedAutoplay, setMutedAutoplay] = useState(false);

  // Check initial screen width for mobile collapse default
  useEffect(() => {
    const isMobile = window.innerWidth < 640;
    if (isMobile) setCollapsed(true);
  }, []);

  // Autoplay handler: attempt playback, fallback to muted if blocked, unmute on first user interaction
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = volume;

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setPlaying(true);
        })
        .catch(() => {
          // Autoplay blocked: try muted
          audio.muted = true;
          setMutedAutoplay(true);
          audio.play().then(() => setPlaying(true)).catch(() => {});
        });
    }

    const unlock = () => {
      if (audio) {
        audio.muted = false;
        setMutedAutoplay(false);
        audio.volume = volume;
        if (audio.paused) {
          audio.play().catch(() => {});
        }
      }
      cleanupListeners();
    };

    const cleanupListeners = () => {
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
      window.removeEventListener("touchstart", unlock);
    };

    window.addEventListener("pointerdown", unlock, { once: true });
    window.addEventListener("keydown", unlock, { once: true });
    window.addEventListener("touchstart", unlock, { once: true });

    return cleanupListeners;
  }, []);

  useEffect(() => {
    if (audioRef.current && !mutedAutoplay) {
      audioRef.current.volume = volume;
    }
  }, [volume, mutedAutoplay]);

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      audio.muted = false;
      setMutedAutoplay(false);
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setTime(val);
    if (audioRef.current) {
      audioRef.current.currentTime = val;
    }
  };

  const handleCardPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    cardRef.current.style.setProperty("--gx", `${x}%`);
    cardRef.current.style.setProperty("--gy", `${y}%`);
  };

  const progressPct = duration > 0 ? (time / duration) * 100 : 0;

  return (
    <div
      className={`fixed top-1/2 -translate-y-1/2 right-0 z-50 select-none transition-transform duration-500 ease-out font-mono ${
        collapsed ? "translate-x-[calc(100%-2.75rem)] sm:translate-x-[calc(100%-3rem)]" : "translate-x-0"
      }`}
      onPointerDown={(e) => e.stopPropagation()}
    >
      <audio
        ref={audioRef}
        src={TRACK.src}
        loop
        preload="auto"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
      />

      {/* Main wrapper holding Kagune + Player */}
      <div className="relative flex items-center">
        {/* Toggle tab on edge (always accessible to expand/collapse) */}
        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? "Expand music player" : "Collapse music player"}
          className="absolute -left-10 sm:-left-12 top-1/2 -translate-y-1/2 z-30 group flex h-14 w-10 sm:w-12 items-center justify-center rounded-l-2xl border-y border-l border-blood/40 bg-[#0a0a0a]/90 backdrop-blur-md shadow-[-8px_0_20px_rgba(179,0,27,0.35)] transition-all hover:bg-[#150204]"
        >
          {/* Pulsing red bio-core indicator */}
          <div className="relative flex items-center justify-center">
            <span className="absolute size-5 rounded-full bg-blood/20 animate-ping" />
            <span className="relative size-3 rounded-full bg-gradient-to-tr from-blood-deep via-blood to-[#ff5a6e] shadow-[0_0_10px_#B3001B]" />
          </div>
          {/* Chevron icon */}
          <svg
            viewBox="0 0 24 24"
            className={`absolute right-1 size-3.5 text-muted-foreground transition-transform duration-300 group-hover:text-blood ${
              collapsed ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>

        {/* Realistic SVG Kagune wrapping around and gripping the player */}
        <div className="pointer-events-none absolute -left-16 -top-12 sm:-left-20 sm:-top-16 z-20 h-[340px] sm:h-[380px] w-[340px] sm:w-[380px] overflow-visible kagune-breathe">
          <svg
            viewBox="0 0 380 380"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="h-full w-full drop-shadow-[0_12px_24px_rgba(0,0,0,0.85)] filter"
          >
            <defs>
              {/* Kagune scale textures & gradients */}
              <linearGradient id="kagune-deep" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3a0005" />
                <stop offset="35%" stopColor="#5a0008" />
                <stop offset="65%" stopColor="#8a0012" />
                <stop offset="100%" stopColor="#B3001B" />
              </linearGradient>

              <linearGradient id="kagune-crimson" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#5a0008" />
                <stop offset="40%" stopColor="#B3001B" />
                <stop offset="80%" stopColor="#E01E37" />
                <stop offset="100%" stopColor="#ff5a6e" />
              </linearGradient>

              <radialGradient id="kagune-scale-glow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ff5a6e" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#E01E37" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#5a0008" stopOpacity="0" />
              </radialGradient>

              <filter id="kagune-shadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="3" dy="5" stdDeviation="4" floodColor="#000" floodOpacity="0.75" />
              </filter>
            </defs>

            {/* Upper primary kagune tentacle arching over top of the player */}
            <path
              d="M 380 90 C 310 70, 240 60, 160 85 C 100 105, 60 150, 52 210 C 48 240, 55 270, 68 295 C 72 302, 85 295, 80 285 C 68 250, 72 205, 105 165 C 135 128, 195 105, 270 100 C 310 98, 350 105, 380 115 Z"
              fill="url(#kagune-deep)"
              filter="url(#kagune-shadow)"
            />

            {/* Overlapping dorsal scale plates - Segment 1 */}
            <path
              d="M 360 85 C 310 75, 260 75, 210 90 C 235 102, 280 96, 320 92 Z"
              fill="url(#kagune-crimson)"
              opacity="0.95"
            />
            {/* Segment 2 */}
            <path
              d="M 270 82 C 215 90, 160 110, 120 145 C 145 140, 185 125, 230 108 Z"
              fill="url(#kagune-crimson)"
              opacity="0.95"
            />
            {/* Segment 3 - gripping corner */}
            <path
              d="M 160 115 C 115 142, 80 180, 68 230 C 85 210, 115 180, 150 155 Z"
              fill="url(#kagune-crimson)"
              opacity="0.92"
            />
            {/* Claw tendril tip curling around left edge */}
            <path
              d="M 72 225 C 58 260, 62 295, 82 320 C 86 325, 92 318, 90 312 C 78 285, 78 260, 92 235 Z"
              fill="#E01E37"
            />
            {/* Secondary lower claw gripping the bottom edge */}
            <path
              d="M 380 320 C 300 330, 210 325, 140 305 C 115 298, 95 320, 110 335 C 160 365, 260 360, 380 338 Z"
              fill="url(#kagune-deep)"
              filter="url(#kagune-shadow)"
            />
            <path
              d="M 330 322 C 250 332, 175 322, 130 310 C 160 332, 230 338, 300 332 Z"
              fill="url(#kagune-crimson)"
              opacity="0.85"
            />

            {/* Specular ridge highlights giving realistic wet biological sheen */}
            <path
              d="M 350 82 C 280 75, 200 90, 140 128 C 90 162, 68 210, 62 265"
              stroke="#ff5a6e"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray="18 10 35 15"
              opacity="0.75"
            />
            <path
              d="M 310 80 C 250 82, 180 102, 135 135"
              stroke="#ffffff"
              strokeWidth="1.2"
              strokeLinecap="round"
              opacity="0.65"
            />

            {/* Organic scale bumps / bio nodes */}
            <circle cx="280" cy="92" r="5" fill="url(#kagune-scale-glow)" />
            <circle cx="215" cy="105" r="6" fill="url(#kagune-scale-glow)" />
            <circle cx="155" cy="132" r="6.5" fill="url(#kagune-scale-glow)" />
            <circle cx="108" cy="172" r="5.5" fill="url(#kagune-scale-glow)" />
            <circle cx="75" cy="225" r="5" fill="url(#kagune-scale-glow)" />
            <circle cx="78" cy="275" r="4.5" fill="url(#kagune-scale-glow)" />
          </svg>
        </div>

        {/* Player card: Metallic reflective glass panel */}
        <div
          ref={cardRef}
          onPointerMove={handleCardPointerMove}
          className="relative z-10 w-72 sm:w-80 rounded-l-3xl border-y border-l border-blood/30 p-4 pr-5 shadow-[-15px_15px_40px_rgba(0,0,0,0.7)] backdrop-blur-xl transition-all duration-300"
          style={{
            background:
              "linear-gradient(135deg, rgba(20, 2, 5, 0.88) 0%, rgba(10, 10, 10, 0.94) 50%, rgba(30, 2, 6, 0.9) 100%)",
          }}
        >
          {/* Reflective glare following cursor */}
          <div
            className="pointer-events-none absolute inset-0 rounded-l-3xl mix-blend-soft-light opacity-50"
            style={{
              background:
                "radial-gradient(circle at var(--gx, 50%) var(--gy, 50%), rgba(255, 255, 255, 0.4), transparent 60%)",
            }}
          />

          {/* Card header with album art + track info */}
          <div className="flex items-center gap-3">
            {/* Album art thumbnail */}
            <div className="relative size-14 shrink-0 overflow-hidden rounded-xl border border-blood/40 shadow-[0_0_15px_rgba(179,0,27,0.3)]">
              <img
                src={TRACK.art}
                alt="Tokyo Ghoul Unravel"
                className="h-full w-full object-cover"
                loading="eager"
              />
              {/* Playing indicator ring */}
              {playing && (
                <span className="absolute inset-0 border border-blood animate-pulse rounded-xl" />
              )}
            </div>

            {/* Track Title and Artist */}
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline justify-between gap-1">
                <span className="truncate font-script text-2xl text-blood drop-shadow-[0_0_8px_rgba(179,0,27,0.4)]">
                  {TRACK.title}
                </span>
                <span className="text-[9px] uppercase tracking-[0.2em] text-blood-dim">
                  TK
                </span>
              </div>
              <p className="truncate font-display text-[9px] uppercase tracking-[0.2em] text-muted-foreground mt-0.5">
                {TRACK.artist}
              </p>
            </div>

            {/* Play/Pause Button */}
            <button
              type="button"
              onClick={togglePlay}
              aria-label={playing ? "Pause" : "Play"}
              className="relative grid size-11 shrink-0 place-items-center rounded-full bg-gradient-to-tr from-blood-deep via-blood to-[#E01E37] text-white shadow-[0_4px_16px_rgba(179,0,27,0.5)] transition-transform hover:scale-105 active:scale-95"
            >
              <span
                className={`absolute inset-0.5 rounded-full border border-white/30 ${
                  playing ? "animate-[spin_6s_linear_infinite]" : ""
                }`}
              />
              {playing ? (
                <svg viewBox="0 0 24 24" className="size-4 fill-current">
                  <rect x="6" y="5" width="4" height="14" rx="1" />
                  <rect x="14" y="5" width="4" height="14" rx="1" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" className="ml-0.5 size-4 fill-current">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>
          </div>

          {/* Progress bar */}
          <div className="mt-3.5 space-y-1">
            <div className="relative flex items-center">
              <input
                type="range"
                aria-label="Seek track"
                min={0}
                max={duration || 0}
                step={0.1}
                value={time}
                onChange={handleSeek}
                className="h-1.5 w-full cursor-pointer appearance-none rounded-full accent-blood bg-black/40 transition-all hover:h-2"
                style={{
                  background: `linear-gradient(90deg, #E01E37 ${progressPct}%, rgba(255,255,255,0.12) ${progressPct}%)`,
                }}
              />
            </div>
            <div className="flex items-center justify-between text-[10px] text-muted-foreground">
              <span>{formatTime(time)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Volume control & controls row */}
          <div className="mt-2.5 flex items-center justify-between border-t border-white/5 pt-2 text-[10px] text-muted-foreground">
            <div className="flex items-center gap-2">
              <svg
                viewBox="0 0 24 24"
                className="size-3.5 text-blood"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
              >
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                {volume > 0 && <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />}
              </svg>
              <input
                type="range"
                aria-label="Volume slider"
                min={0}
                max={1}
                step={0.01}
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="h-1 w-20 cursor-pointer appearance-none rounded-full accent-blood"
                style={{
                  background: `linear-gradient(90deg, #E01E37 ${volume * 100}%, rgba(255,255,255,0.15) ${volume * 100}%)`,
                }}
              />
            </div>

            <button
              type="button"
              onClick={() => setCollapsed(true)}
              aria-label="Dock player to side"
              className="text-[9px] uppercase tracking-wider text-muted-foreground hover:text-blood transition-colors"
            >
              dock ›
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

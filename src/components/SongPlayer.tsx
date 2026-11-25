import { useEffect, useRef, useState, type PointerEvent } from "react";
import { RizeKaguneContainer } from "./RizeKagune";

const TRACK = {
  src: "https://file.garden/aahuG_hIDGRlXD24/Tokyo%20Ghoul%20Opening%20Unravel%20by%20TK%20from%20Ling%20Toshite%20Sigure.mp3",
  title: "Unravel",
  artist: "TK from Ling Tosite Sigure",
  art: "/rize.gif",
  fallbackArt: "https://file.garden/aahuG_hIDGRlXD24/b189922eab130325a3995bfa1a3021eb.gif",
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

  // Default to collapsed tab on small mobile viewports
  useEffect(() => {
    const isMobile = window.innerWidth < 640;
    if (isMobile) setCollapsed(true);
  }, []);

  // Configure Media Session API for Dynamic Island / Android Now Playing notification
  useEffect(() => {
    if (typeof window !== "undefined" && "mediaSession" in navigator) {
      const origin = window.location.origin;
      try {
        navigator.mediaSession.metadata = new MediaMetadata({
          title: "Rize Security Bot",
          artist: TRACK.artist,
          album: "Tokyo Ghoul — Unravel",
          artwork: [
            {
              src: `${origin}/rize.gif`,
              sizes: "640x360",
              type: "image/gif",
            },
            {
              src: TRACK.fallbackArt,
              sizes: "640x360",
              type: "image/gif",
            },
            {
              src: `${origin}/apple-touch-icon.png`,
              sizes: "512x512",
              type: "image/png",
            },
            {
              src: `${origin}/favicon.ico`,
              sizes: "256x256",
              type: "image/x-icon",
            },
          ],
        });

        navigator.mediaSession.setActionHandler("play", () => {
          if (audioRef.current) {
            audioRef.current.play().catch(() => {});
          }
        });
        navigator.mediaSession.setActionHandler("pause", () => {
          if (audioRef.current) {
            audioRef.current.pause();
          }
        });
        navigator.mediaSession.setActionHandler("seekto", (details) => {
          if (audioRef.current && details.seekTime !== undefined) {
            audioRef.current.currentTime = details.seekTime;
            setTime(details.seekTime);
          }
        });
      } catch (err) {
        console.warn("MediaSession initialization warning:", err);
      }
    }
  }, []);

  // Update Media Session playback state
  useEffect(() => {
    if (typeof window !== "undefined" && "mediaSession" in navigator) {
      navigator.mediaSession.playbackState = playing ? "playing" : "paused";
    }
  }, [playing]);

  // Update Media Session playback position
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      "mediaSession" in navigator &&
      "setPositionState" in navigator.mediaSession &&
      duration > 0 &&
      !isNaN(duration)
    ) {
      try {
        navigator.mediaSession.setPositionState({
          duration: duration,
          playbackRate: 1,
          position: Math.min(time, duration),
        });
      } catch {}
    }
  }, [time, duration]);

  // Autoplay handler: muted fallback if browser blocks, unmuted on first interaction
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
      className={`fixed top-1/2 -translate-y-1/2 right-0 sm:right-3 z-50 select-none transition-transform duration-500 ease-out font-mono ${
        collapsed
          ? "translate-x-[calc(100%-2.75rem)] sm:translate-x-[calc(100%-3rem)]"
          : "translate-x-0"
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

      <div className="relative flex items-center">
        {/* Toggle tab on left edge to expand / collapse */}
        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? "Expand music player" : "Collapse music player"}
          className="absolute -left-10 sm:-left-12 top-1/2 -translate-y-1/2 z-40 group flex h-14 w-10 sm:w-12 items-center justify-center rounded-l-2xl border-y border-l border-blood/40 bg-[#0a0a0a]/90 backdrop-blur-md shadow-[-8px_0_20px_rgba(179,0,27,0.35)] transition-all hover:bg-[#150204]"
        >
          {/* Pulsing red bio-core indicator */}
          <div className="relative flex items-center justify-center">
            <span className="absolute size-5 rounded-full bg-blood/20 animate-ping" />
            <span className="relative size-3 rounded-full bg-gradient-to-tr from-blood-deep via-blood to-[#ff5a6e] shadow-[0_0_10px_#B3001B]" />
          </div>
          {/* Chevron indicator */}
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

        {/* 4 Animated Kagune tentacles (behind + front gripping claws) around Player Card */}
        <RizeKaguneContainer>
          {/* Neutral white/silver metallic glass player card (pops against red kagune) */}
          <div
            ref={cardRef}
            onPointerMove={handleCardPointerMove}
            className="relative w-72 sm:w-80 rounded-2xl sm:rounded-3xl border border-white/60 dark:border-white/15 p-4 pr-5 backdrop-blur-xl transition-all duration-300"
            style={{
              background:
                "linear-gradient(135deg, rgba(255, 255, 255, 0.94) 0%, rgba(245, 245, 248, 0.88) 50%, rgba(235, 235, 242, 0.94) 100%)",
              boxShadow:
                "0 0 30px rgba(224, 30, 55, 0.35), -14px 14px 38px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.9)",
            }}
          >
            {/* Reflective shine tracking pointer */}
            <div
              className="pointer-events-none absolute inset-0 rounded-2xl sm:rounded-3xl mix-blend-soft-light opacity-50"
              style={{
                background:
                  "radial-gradient(circle at var(--gx, 50%) var(--gy, 50%), rgba(255, 255, 255, 0.6), transparent 60%)",
              }}
            />

            {/* Track info header */}
            <div className="flex items-center gap-3">
              {/* Album art thumbnail with live playing indicator */}
              <div className="relative size-14 shrink-0 overflow-hidden rounded-xl border border-blood/30 shadow-[0_0_15px_rgba(179,0,27,0.25)]">
                <img
                  src={TRACK.art}
                  alt="Tokyo Ghoul Unravel"
                  className="h-full w-full object-cover"
                  loading="eager"
                  onError={(e) => {
                    // Fallback to external garden url if local file fails
                    e.currentTarget.src = TRACK.fallbackArt;
                  }}
                />
                {playing && (
                  <span className="absolute inset-0 border border-blood animate-pulse rounded-xl" />
                )}
              </div>

              {/* Title & Artist */}
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-1">
                  <span className="truncate font-script text-2xl text-blood drop-shadow-[0_0_8px_rgba(179,0,27,0.35)]">
                    {TRACK.title}
                  </span>
                  <span className="text-[9px] uppercase tracking-[0.2em] text-blood-deep font-display font-semibold">
                    TK
                  </span>
                </div>
                <p className="truncate font-display text-[9px] uppercase tracking-[0.2em] text-[#4a4042] dark:text-[#a09496] mt-0.5">
                  {TRACK.artist}
                </p>
              </div>

              {/* Metallic blood play/pause button */}
              <button
                type="button"
                onClick={togglePlay}
                aria-label={playing ? "Pause" : "Play"}
                className="relative grid size-11 shrink-0 place-items-center rounded-full bg-gradient-to-tr from-blood-deep via-blood to-[#E01E37] text-white shadow-[0_4px_16px_rgba(179,0,27,0.45)] transition-transform hover:scale-105 active:scale-95"
              >
                <span
                  className={`absolute inset-0.5 rounded-full border border-white/40 ${
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

            {/* Seek & progress bar */}
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
                  className="h-1.5 w-full cursor-pointer appearance-none rounded-full accent-blood bg-black/15 dark:bg-black/40 transition-all hover:h-2"
                  style={{
                    background: `linear-gradient(90deg, #E01E37 ${progressPct}%, rgba(0,0,0,0.12) ${progressPct}%)`,
                  }}
                />
              </div>
              <div className="flex items-center justify-between text-[10px] text-[#554a4c] dark:text-[#998b8e]">
                <span>{formatTime(time)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Volume & dock controls */}
            <div className="mt-2.5 flex items-center justify-between border-t border-black/10 dark:border-white/10 pt-2 text-[10px] text-[#554a4c] dark:text-[#998b8e]">
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
                    background: `linear-gradient(90deg, #E01E37 ${volume * 100}%, rgba(0,0,0,0.15) ${volume * 100}%)`,
                  }}
                />
              </div>

              <button
                type="button"
                onClick={() => setCollapsed(true)}
                aria-label="Dock player to side"
                className="text-[9px] uppercase tracking-wider text-[#665a5c] dark:text-[#998b8e] hover:text-blood transition-colors"
              >
                dock ›
              </button>
            </div>
          </div>
        </RizeKaguneContainer>
      </div>
    </div>
  );
}

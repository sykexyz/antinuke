import { useEffect, useRef, useState } from "react";

const SRC =
  "https://file.garden/aahuG_hIDGRlXD24/Tokyo%20Ghoul%20Opening%20Unravel%20by%20TK%20from%20Ling%20Toshite%20Sigure.mp3";

function fmt(s: number) {
  if (!isFinite(s)) return "0:00";
  const m = Math.floor(s / 60);
  return `${m}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
}

export function SongPlayer() {
  const audio = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [dur, setDur] = useState(0);
  const [vol, setVol] = useState(0.5);
  const [open, setOpen] = useState(true);

  // Autoplay: try right away; browsers often block sound until the first tap/key, so retry then.
  useEffect(() => {
    const a = audio.current;
    if (!a) return;
    a.volume = 0.5;
    const start = () => {
      a.play().then(cleanup).catch(() => {});
    };
    const cleanup = () => {
      window.removeEventListener("pointerdown", start);
      window.removeEventListener("keydown", start);
      window.removeEventListener("touchstart", start);
    };
    window.addEventListener("pointerdown", start);
    window.addEventListener("keydown", start);
    window.addEventListener("touchstart", start);
    start();
    return cleanup;
  }, []);

  useEffect(() => {
    if (audio.current) audio.current.volume = vol;
  }, [vol]);

  const toggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    const a = audio.current;
    if (!a) return;
    if (a.paused) a.play().catch(() => {});
    else a.pause();
  };

  const pct = dur ? (time / dur) * 100 : 0;

  return (
    <div className="fixed bottom-4 left-4 z-50 font-mono" onPointerDown={(e) => e.stopPropagation()}>
      <audio
        ref={audio}
        src={SRC}
        loop
        preload="auto"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDur(e.currentTarget.duration)}
      />
      <div className="glass shine flex items-center gap-3 rounded-full p-2 pr-4">
        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? "Pause song" : "Play song"}
          className="relative grid size-11 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-105 active:scale-95"
        >
          <span
            className={`absolute inset-1 rounded-full border border-dashed border-primary-foreground/40 ${playing ? "animate-[spin_6s_linear_infinite]" : ""}`}
          />
          {playing ? (
            <svg viewBox="0 0 24 24" className="size-4 fill-current"><rect x="6" y="5" width="4" height="14" rx="1" /><rect x="14" y="5" width="4" height="14" rx="1" /></svg>
          ) : (
            <svg viewBox="0 0 24 24" className="ml-0.5 size-4 fill-current"><path d="M8 5v14l11-7z" /></svg>
          )}
        </button>

        {open && (
          <div className="flex w-44 flex-col gap-1 sm:w-56">
            <div className="flex items-baseline justify-between gap-2">
              <span className="truncate font-display text-sm font-bold text-blood-sheen">Unravel</span>
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground">TK</span>
            </div>
            <input
              type="range"
              aria-label="Seek"
              min={0}
              max={dur || 0}
              step={0.1}
              value={time}
              onChange={(e) => {
                if (audio.current) audio.current.currentTime = Number(e.target.value);
              }}
              className="h-1 w-full cursor-pointer appearance-none rounded-full accent-primary"
              style={{ background: `linear-gradient(90deg, var(--blood) ${pct}%, var(--border) ${pct}%)` }}
            />
            <div className="flex items-center justify-between gap-2 text-[10px] text-muted-foreground">
              <span>{fmt(time)} / {fmt(dur)}</span>
              <input
                type="range"
                aria-label="Volume"
                min={0}
                max={1}
                step={0.01}
                value={vol}
                onChange={(e) => setVol(Number(e.target.value))}
                className="h-1 w-16 cursor-pointer appearance-none rounded-full accent-primary"
                style={{ background: `linear-gradient(90deg, var(--blood) ${vol * 100}%, var(--border) ${vol * 100}%)` }}
              />
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? "Collapse player" : "Expand player"}
          className="text-xs text-muted-foreground transition-colors hover:text-primary"
        >
          {open ? "‹" : "›"}
        </button>
      </div>
    </div>
  );
}

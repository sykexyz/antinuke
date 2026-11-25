import { useEffect, useRef, useState } from "react";
import { SpiderLily } from "./SpiderLily";

const INTERACTIVE = "a, button, input, textarea, select, [role=button], [data-interactive]";

export function LilyCursor() {
  const ref = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [hot, setHot] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)");
    if (!fine.matches) return;
    setEnabled(true);
    document.body.classList.add("lily-cursor");
    let last = 0;

    const move = (e: PointerEvent) => {
      if (ref.current) ref.current.style.transform = `translate(${e.clientX - 18}px, ${e.clientY - 18}px)`;
      const t = e.target as Element | null;
      setHot(!!t?.closest?.(INTERACTIVE));
      const now = performance.now();
      if (now - last > 55) {
        last = now;
        const p = document.createElement("span");
        p.className = "petal";
        p.style.left = `${e.clientX}px`;
        p.style.top = `${e.clientY + 8}px`;
        p.style.setProperty("--dx", `${(Math.random() - 0.5) * 30}px`);
        document.body.appendChild(p);
        setTimeout(() => p.remove(), 1200);
      }
    };
    window.addEventListener("pointermove", move);
    return () => {
      window.removeEventListener("pointermove", move);
      document.body.classList.remove("lily-cursor");
    };
  }, []);

  if (!enabled) return null;
  return (
    <div ref={ref} className="pointer-events-none fixed left-0 top-0 z-[9999]">
      <div
        className="transition-[transform,filter] duration-300"
        style={{ transform: `scale(${hot ? 1.4 : 1})`, filter: hot ? "drop-shadow(0 0 10px var(--blood))" : "none" }}
      >
        <SpiderLily size={36} className="lily-sway" />
      </div>
    </div>
  );
}

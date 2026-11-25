import { useRef, type PointerEvent } from "react";

const cards = [
  { img: "https://file.garden/aahuG_hIDGRlXD24/ffe291e880084cd78fa5b8d99102f09b~tplv-photomode-image.jpeg", rank: "A", suit: "♥", rot: -11, x: -58 },
  { img: "https://file.garden/aahuG_hIDGRlXD24/ssstik.io_1795574337689.webp", rank: "Q", suit: "♦", rot: 9, x: 58 },
];

function Card({ img, rank, suit, rot, x }: (typeof cards)[number]) {
  const el = useRef<HTMLDivElement>(null);
  const base = `translateX(${x}px) rotate(${rot}deg)`;

  const move = (e: PointerEvent) => {
    const r = el.current!.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    el.current!.style.transform = `${base} perspective(900px) rotateY(${(px - 0.5) * 22}deg) rotateX(${(0.5 - py) * 22}deg) translateY(-12px) scale(1.04)`;
    el.current!.style.setProperty("--gx", `${px * 100}%`);
    el.current!.style.setProperty("--gy", `${py * 100}%`);
    el.current!.style.zIndex = "5";
  };
  const leave = () => {
    el.current!.style.transform = base;
    el.current!.style.zIndex = "";
  };

  return (
    <div
      ref={el}
      onPointerMove={move}
      onPointerLeave={leave}
      data-interactive
      className="absolute left-1/2 top-0 -ml-[85px] w-[170px] rounded-[14px] p-[3px] transition-transform duration-300 ease-out sm:-ml-[100px] sm:w-[200px]"
      style={{
        transform: base,
        aspectRatio: "2.5 / 3.5",
        // diamond edge: conic sweep of reds and whites
        background: "conic-gradient(from 210deg, var(--sheen), var(--blood), oklch(1 0 0), var(--blood-deep), var(--sheen), var(--blood), oklch(1 0 0))",
        boxShadow: "var(--shadow-glass)",
      }}
    >
      <div className="relative h-full w-full overflow-hidden rounded-[11px] bg-card">
        <img src={img} alt="" className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
        {/* shade the corners so the rank sits inside the photo */}
        <div className="absolute inset-0" style={{ background: "radial-gradient(120% 70% at 0% 0%, oklch(0.2 0.08 20 / 70%), transparent 45%), radial-gradient(120% 70% at 100% 0%, oklch(0.2 0.08 20 / 55%), transparent 40%), linear-gradient(to top, oklch(0.36 0.14 20 / 45%), transparent 40%)" }} />
        <span className="absolute left-3 top-1 font-script text-5xl leading-none" style={{ color: "oklch(1 0 0 / 85%)", mixBlendMode: "overlay", textShadow: "0 0 18px var(--blood)" }}>
          {rank}
        </span>
        <span className="absolute left-3 top-1 font-script text-5xl leading-none" style={{ color: "var(--blood)", mixBlendMode: "soft-light" }}>
          {rank}
        </span>
        <span className="absolute right-3 top-2 text-2xl" style={{ color: "oklch(0.75 0.2 22)", mixBlendMode: "screen", opacity: 0.9 }}>
          {suit}
        </span>
        {/* glare follows the pointer */}
        <div className="pointer-events-none absolute inset-0 mix-blend-soft-light" style={{ background: "radial-gradient(circle at var(--gx,50%) var(--gy,30%), oklch(1 0 0 / 75%), transparent 45%)" }} />
        <div className="pointer-events-none absolute inset-0 rounded-[11px] ring-1 ring-inset" style={{ boxShadow: "inset 0 0 0 1px oklch(1 0 0 / 35%)" }} />
      </div>
    </div>
  );
}

export function PlayingCards() {
  return (
    <div className="relative mx-auto h-[290px] w-full max-w-md sm:h-[330px]">
      {cards.map((c) => (
        <Card key={c.rank} {...c} />
      ))}
    </div>
  );
}

import { Link } from "@tanstack/react-router";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { SpiderLily } from "./SpiderLily";

function ThemeToggle() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const d = localStorage.getItem("rize-theme") === "dark";
    setDark(d);
    document.documentElement.classList.toggle("dark", d);
  }, []);
  const flip = () => {
    const d = !dark;
    setDark(d);
    document.documentElement.classList.toggle("dark", d);
    localStorage.setItem("rize-theme", d ? "dark" : "light");
  };
  return (
    <button onClick={flip} aria-label="Switch theme" className="glass grid h-9 w-9 place-items-center rounded-full text-blood transition hover:scale-105">
      {dark ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}

const item = "flex items-center gap-2 rounded-full px-4 py-2 font-display text-xs uppercase tracking-[0.2em] transition hover:bg-accent";

export function Nav() {
  return (
    <header className="sticky top-0 z-50 px-4 pt-4">
      <nav className="glass mx-auto flex max-w-5xl items-center justify-between rounded-full px-2 py-1.5">
        <div className="flex items-center gap-1">
          <Link to="/" className={item} activeProps={{ className: "bg-accent text-blood" }} activeOptions={{ exact: true }}>
            <SpiderLily size={22} className="lily-sway" />
            <span className="hidden sm:inline">Application</span>
          </Link>
          <Link to="/commands" className={item} activeProps={{ className: "bg-accent text-blood" }}>
            <span className="font-mono text-sm font-bold">/</span>
            <span>Commands</span>
          </Link>
          <Link to="/rizesec" className={item} activeProps={{ className: "bg-accent text-blood" }}>
            <span className="text-shift font-mono text-sm font-bold">&lt; \ &gt;</span>
            <span>RizeSec</span>
          </Link>
        </div>
        <ThemeToggle />
      </nav>
    </header>
  );
}

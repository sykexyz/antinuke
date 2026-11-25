import { Link } from "@tanstack/react-router";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { SpiderLily } from "./SpiderLily";

function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const isDark = localStorage.getItem("rize-theme") === "dark";
    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  const toggle = () => {
    const nextDark = !dark;
    setDark(nextDark);
    document.documentElement.classList.toggle("dark", nextDark);
    localStorage.setItem("rize-theme", nextDark ? "dark" : "light");
  };

  return (
    <button
      onClick={toggle}
      aria-label="Switch theme"
      className="glass grid h-9 w-9 place-items-center rounded-full text-blood transition hover:scale-105 active:scale-95"
    >
      {dark ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}

const navItemClass =
  "flex items-center gap-2 rounded-full px-4 py-2 font-display text-xs uppercase tracking-[0.2em] transition hover:bg-accent/70";

export function Nav() {
  return (
    <header className="sticky top-0 z-40 px-4 pt-4">
      <nav className="glass mx-auto flex max-w-4xl items-center justify-between rounded-full px-3 py-2">
        <div className="flex items-center gap-2">
          {/* 1. Application: animated red spider lily */}
          <Link
            to="/"
            className={navItemClass}
            activeProps={{ className: "bg-accent/80 text-blood" }}
            activeOptions={{ exact: true }}
          >
            <SpiderLily size={22} className="lily-sway" />
            <span className="font-semibold">Application</span>
          </Link>

          {/* 2. RizeSec: < \ > icon with shifting reflective color white -> red */}
          <Link
            to="/rizesec"
            className={navItemClass}
            activeProps={{ className: "bg-accent/80 text-blood" }}
          >
            <span className="text-shift font-mono text-sm font-bold tracking-normal">
              &lt; \ &gt;
            </span>
            <span className="font-semibold">RizeSec</span>
          </Link>
        </div>

        {/* Theme toggle (sun/moon) on the right */}
        <ThemeToggle />
      </nav>
    </header>
  );
}

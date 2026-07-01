import React, { useEffect, useState } from "react";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState("dark"); // Default to dark

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
  }, [theme]);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/30">
      {children}
    </div>
  );
}

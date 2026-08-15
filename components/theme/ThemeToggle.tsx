"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/theme/ThemeProvider";

type ThemeToggleProps = {
  className?: string;
};

export default function ThemeToggle({ className = "" }: ThemeToggleProps) {
  const { theme, toggleTheme, mounted } = useTheme();
  const isDark = mounted ? theme === "dark" : false;

  return (
    <button
      type="button"
      onClick={toggleTheme}
<<<<<<< HEAD
      className={`notif-trigger theme-toggle ${className}`.trim()}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      title={isDark ? "Light mode" : "Dark mode"}
    >
      {isDark ? (
        <Sun className="h-[1.15rem] w-[1.15rem]" strokeWidth={2.25} />
      ) : (
        <Moon className="h-[1.15rem] w-[1.15rem]" strokeWidth={2.25} />
      )}
=======
      className={`theme-toggle inline-flex h-10 w-10 items-center justify-center rounded-full border border-navy/10 bg-surface text-ink transition-colors hover:border-primary hover:text-primary ${className}`}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      title={isDark ? "Light mode" : "Dark mode"}
    >
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
>>>>>>> 9fbe6272ae14926655cd6155816221b0eb2ae799
    </button>
  );
}

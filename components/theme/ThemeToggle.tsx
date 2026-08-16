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
      className={`notif-trigger theme-toggle ${className}`.trim()}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      title={isDark ? "Light mode" : "Dark mode"}
    >
      {isDark ? (
        <Sun className="h-[1.15rem] w-[1.15rem]" strokeWidth={2.25} />
      ) : (
        <Moon className="h-[1.15rem] w-[1.15rem]" strokeWidth={2.25} />
      )}
    </button>
  );
}

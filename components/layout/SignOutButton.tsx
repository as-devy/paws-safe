"use client";

import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

type SignOutButtonProps = {
  variant?: "icon" | "full";
  className?: string;
};

export default function SignOutButton({
  variant = "icon",
  className = "",
}: SignOutButtonProps) {
  async function handleSignOut() {
    await signOut({ callbackUrl: "/login" });
  }

  if (variant === "full") {
    return (
      <button
        type="button"
        className={className}
        onClick={handleSignOut}
      >
        <LogOut className="h-4 w-4" />
        Sign out
      </button>
    );
  }

  return (
    <button
      type="button"
      className={`notif-trigger notif-trigger--exit ${className}`.trim()}
      aria-label="Sign out"
      title="Sign out"
      onClick={handleSignOut}
    >
      <LogOut className="h-[1.15rem] w-[1.15rem]" strokeWidth={2.25} />
    </button>
  );
}

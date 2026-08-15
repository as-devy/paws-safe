<<<<<<< HEAD
import { auth } from "@/auth";
import HeaderClient from "@/components/layout/HeaderClient";
import { prisma } from "@/lib/prisma";

type HeaderProps = {
  activeHref?: string;
};

export default async function Header({ activeHref }: HeaderProps = {}) {
  const session = await auth();
  let isAdmin = session?.user?.role === "admin";

  if (session?.user?.id && !isAdmin) {
    try {
      const row = await prisma.users.findUnique({
        where: { id: session.user.id },
        select: { role: true },
      });
      isAdmin = row?.role === "admin";
    } catch {
      isAdmin = false;
    }
  }

  return (
    <HeaderClient
      isLoggedIn={Boolean(session?.user)}
      emailVerified={Boolean(session?.user?.isEmailVerified)}
      isAdmin={isAdmin}
      activeHref={activeHref}
    />
=======
"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Home,
  Menu,
  PawPrint,
  HeartHandshake,
  Upload,
  Phone,
  X,
} from "lucide-react";
import ThemeToggle from "@/components/theme/ThemeToggle";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/foster", label: "Foster", icon: PawPrint },
  { href: "/adoption", label: "Adoption", icon: HeartHandshake },
  { href: "/post-pet", label: "Post Pet", icon: Upload },
  { href: "/contact", label: "Contact Us", icon: Phone },
];

function isActivePath(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="site-header fixed inset-x-0 top-0 z-50">
      <div className="mx-auto flex w-[min(1200px,92%)] items-center justify-between gap-2 py-2 sm:gap-4">
        <Link href="/" className="flex min-w-0 shrink-0 items-center gap-1 text-primary">
          <Image
            src="/imgs/logo.png"
            alt="Paws Safe"
            width={72}
            height={72}
            className="h-12 w-12 object-contain sm:h-16 sm:w-16"
            priority
          />
          <span className="font-display truncate text-base font-bold tracking-tight sm:text-xl">
            Paws Safe
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = isActivePath(pathname, href);
            return (
              <Link
                key={label}
                href={href}
                className={`nav-link flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-bold text-ink ${
                  active ? "is-active" : ""
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />

          <div className="hidden items-center gap-3 md:flex">
            <Link
              href="/login"
              className="text-sm font-bold text-ink transition-colors hover:text-primary"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="rounded-lg border-2 border-primary px-3 py-1.5 text-sm font-bold text-ink transition-colors hover:bg-primary hover:text-white"
            >
              Sign Up
            </Link>
          </div>

          <button
            type="button"
            className="inline-flex items-center justify-center rounded-lg border border-[color:var(--card-border)] bg-surface p-2 text-heading lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="mobile-drawer max-h-[calc(100dvh-4.5rem)] overflow-y-auto border-t px-[4%] py-4 lg:hidden">
          <nav className="flex flex-col gap-1" aria-label="Mobile">
            {navItems.map(({ href, label, icon: Icon }) => {
              const active = isActivePath(pathname, href);
              return (
                <Link
                  key={label}
                  href={href}
                  onClick={() => setOpen(false)}
                  className={`nav-link flex items-center gap-2 rounded-lg px-3 py-3 text-sm font-bold text-ink ${
                    active ? "is-active" : ""
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              );
            })}
          </nav>
          <div className="mt-4 flex gap-3 border-t border-[color:var(--card-border)] pt-4 md:hidden">
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="flex-1 rounded-lg border border-[color:var(--card-border)] py-2 text-center text-sm font-bold text-ink"
            >
              Login
            </Link>
            <Link
              href="/signup"
              onClick={() => setOpen(false)}
              className="flex-1 rounded-lg bg-primary py-2 text-center text-sm font-bold text-white"
            >
              Sign Up
            </Link>
          </div>
        </div>
      )}
    </header>
>>>>>>> 9fbe6272ae14926655cd6155816221b0eb2ae799
  );
}

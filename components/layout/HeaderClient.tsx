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
  ShieldCheck,
  X,
} from "lucide-react";
import ThemeToggle from "@/components/theme/ThemeToggle";
import NotificationBell from "./NotificationBell";
import SignOutButton from "./SignOutButton";
import PetOwnerIcon from "./PetOwnerIcon";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/foster", label: "Foster", icon: PawPrint },
  { href: "/adoption", label: "Adoption", icon: HeartHandshake },
  { href: "/post-pet", label: "Post Pet", icon: Upload },
  { href: "/contact", label: "Contact", icon: Phone },
];

function isActivePath(pathname: string, href: string, activeHref?: string) {
  if (activeHref) return href === activeHref;
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

type HeaderClientProps = {
  isLoggedIn: boolean;
  emailVerified?: boolean;
  isAdmin?: boolean;
  activeHref?: string;
};

export default function HeaderClient({
  isLoggedIn,
  emailVerified = true,
  isAdmin = false,
  activeHref,
}: HeaderClientProps) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const profileHref = emailVerified ? "/profile" : "/verify-email";

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 10);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`site-header${scrolled ? " is-scrolled" : ""}${open ? " is-menu-open" : ""}`}
    >
      <div className="site-header__inner">
        <Link href="/" className="site-brand">
          <Image
            src="/imgs/logo.png"
            alt=""
            width={72}
            height={72}
            className="site-brand__mark"
            priority
          />
          <span className="site-brand__name">
            Paws <em>Safe</em>
          </span>
        </Link>

        <nav className="site-header__nav" aria-label="Main">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = isActivePath(pathname, href, activeHref);
            return (
              <Link
                key={label}
                href={href}
                className={`nav-link${active ? " is-active" : ""}`}
              >
                <Icon className="h-3.5 w-3.5" strokeWidth={2.25} />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="header-tools">
          <ThemeToggle />

          {isLoggedIn ? (
            <div className="header-account">
              <NotificationBell />
              {isAdmin ? (
                <Link
                  href="/admin"
                  className={`notif-trigger${isActivePath(pathname, "/admin") ? " is-open" : ""}`}
                  aria-label="Admin dashboard"
                  title="Admin"
                >
                  <ShieldCheck className="h-5 w-5" />
                </Link>
              ) : null}
              <Link
                href={profileHref}
                className={`notif-trigger${isActivePath(pathname, "/profile") || pathname.startsWith("/verify-email") ? " is-open" : ""}`}
                aria-label={emailVerified ? "Your profile" : "Verify your email to open profile"}
                title={emailVerified ? "Profile" : "Verify email to open profile"}
              >
                <PetOwnerIcon className="h-5 w-5" />
              </Link>
              <SignOutButton />
            </div>
          ) : (
            <div className="header-auth">
              <Link href="/login" className="site-header__login">
                Login
              </Link>
              <Link href="/signup" className="site-header__cta">
                Sign up
              </Link>
            </div>
          )}

          <button
            type="button"
            className="site-header__menu-btn"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <div className={`site-header__sheet${open ? " is-open" : ""}`} aria-hidden={!open}>
        <button
          type="button"
          className="site-header__scrim"
          tabIndex={open ? 0 : -1}
          aria-label="Close menu"
          onClick={() => setOpen(false)}
        />
        <div className="mobile-drawer" id="mobile-nav">
          <nav className="mobile-drawer__nav" aria-label="Mobile">
            {navItems.map(({ href, label, icon: Icon }) => {
              const active = isActivePath(pathname, href, activeHref);
              return (
                <Link
                  key={label}
                  href={href}
                  onClick={() => setOpen(false)}
                  className={`mobile-drawer__link${active ? " is-active" : ""}`}
                >
                  <span className="mobile-drawer__icon" aria-hidden>
                    <Icon className="h-4 w-4" />
                  </span>
                  {label}
                </Link>
              );
            })}
          </nav>
          {!isLoggedIn ? (
            <div className="mobile-drawer__auth">
              <Link href="/login" onClick={() => setOpen(false)} className="site-header__login">
                Login
              </Link>
              <Link href="/signup" onClick={() => setOpen(false)} className="site-header__cta">
                Sign up
              </Link>
            </div>
          ) : (
            <div className="mobile-drawer__account">
              {isAdmin ? (
                <Link
                  href="/admin"
                  onClick={() => setOpen(false)}
                  className={`mobile-drawer__link${isActivePath(pathname, "/admin") ? " is-active" : ""}`}
                >
                  <span className="mobile-drawer__icon" aria-hidden>
                    <ShieldCheck className="h-4 w-4" />
                  </span>
                  Admin
                </Link>
              ) : null}
              <Link
                href={profileHref}
                onClick={() => setOpen(false)}
                className={`mobile-drawer__link${isActivePath(pathname, "/profile") || pathname.startsWith("/verify-email") ? " is-active" : ""}`}
              >
                <span className="mobile-drawer__icon" aria-hidden>
                  <PetOwnerIcon className="h-4 w-4" />
                </span>
                {emailVerified ? "Profile" : "Verify email"}
              </Link>
              <SignOutButton
                variant="full"
                className="mobile-drawer__signout"
              />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

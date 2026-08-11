import Image from "next/image";
import Link from "next/link";
import { HeartHandshake, Mail, MapPin, PawPrint } from "lucide-react";

const pages = [
  { href: "/", label: "Home" },
  { href: "/foster", label: "Foster" },
  { href: "/adoption", label: "Adoption" },
  { href: "/post-pet", label: "Post Pet" },
];

const support = [
  { href: "/#donation", label: "Make A Donation" },
  { href: "/community-support", label: "Community Support" },
  { href: "/terms", label: "Terms & Conditions" },
  { href: "/contact", label: "Contact Us" },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer mt-auto border-t-4 border-primary/50">
      <div className="mx-auto grid w-[min(1200px,92%)] gap-10 py-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr] lg:gap-12 lg:py-14">
        <div className="max-w-md">
          <Link href="/" className="inline-flex items-center gap-1 text-primary">
            <Image
              src="/imgs/logo.png"
              alt="Paws Safe"
              width={72}
              height={72}
              className="h-14 w-14 object-contain sm:h-16 sm:w-16"
            />
            <span className="font-display text-xl font-bold sm:text-2xl">
              Paws Safe
            </span>
          </Link>
          <p className="mt-4 text-sm leading-relaxed text-zinc-400 sm:text-[0.95rem]">
            Connecting pets with loving homes through adoption, fostering, and
            trusted rehoming—built for owners, adopters, and communities.
          </p>
          <div className="mt-5 flex flex-col gap-2 text-sm text-zinc-400">
            <p className="inline-flex items-center gap-2">
              <Mail className="h-4 w-4 shrink-0 text-primary" aria-hidden />
              <span className="break-all">support@pawssafe.org</span>
            </p>
            <p className="inline-flex items-center gap-2">
              <MapPin className="h-4 w-4 shrink-0 text-primary" aria-hidden />
              Helping pets nationwide
            </p>
          </div>
          <div className="mt-6 flex gap-3">
            <Link
              href="/adoption"
              className="site-footer__social"
              aria-label="Browse adoption"
            >
              <HeartHandshake className="h-4 w-4" />
            </Link>
            <Link
              href="/foster"
              className="site-footer__social"
              aria-label="Browse foster"
            >
              <PawPrint className="h-4 w-4" />
            </Link>
            <Link
              href="/contact"
              className="site-footer__social"
              aria-label="Contact us"
            >
              <Mail className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div>
          <h2 className="mb-4 font-display text-lg font-semibold text-zinc-100">
            Pages
          </h2>
          <ul className="space-y-2.5">
            {pages.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className="site-footer__link inline-block text-sm"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="mb-4 font-display text-lg font-semibold text-zinc-100">
            Help & Support
          </h2>
          <ul className="space-y-2.5">
            {support.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className="site-footer__link inline-block text-sm"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex w-[min(1200px,92%)] flex-col items-center justify-between gap-3 py-4 text-center text-sm text-zinc-500 sm:flex-row sm:text-left">
          <p>&copy; {year} Paws Safe. All rights reserved.</p>
          <p className="text-zinc-600">Adopt · Foster · Rehome with care</p>
        </div>
      </div>
    </footer>
  );
}

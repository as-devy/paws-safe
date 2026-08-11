import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { HeartHandshake, Home, PawPrint } from "lucide-react";

type AuthShellProps = {
  children: ReactNode;
  mode: "login" | "signup";
};

const copy = {
  login: {
    headline: "Welcome back home",
    support:
      "Pick up where you left off—requests, pets, and homes waiting for care.",
  },
  signup: {
    headline: "A safer path to a loving home",
    support:
      "Create your place in the Paws Safe community to adopt, foster, or rehome with trust.",
  },
} as const;

const pillars = [
  { icon: HeartHandshake, label: "Adopt" },
  { icon: PawPrint, label: "Foster" },
  { icon: Home, label: "Rehome" },
];

export default function AuthShell({ children, mode }: AuthShellProps) {
  const { headline, support } = copy[mode];

  return (
    <section className={`auth-stage auth-stage--${mode}`}>
      <div className="auth-stage__glow" aria-hidden />
      <div className="auth-stage__pattern" aria-hidden />

      <div className="auth-stage__frame">
        <div className="auth-stage__intro auth-rise">
          <Link href="/" className="auth-stage__brand">
            <Image
              src="/imgs/logo.png"
              alt=""
              width={72}
              height={72}
              className="auth-stage__logo"
              priority
            />
            <span>Paws Safe</span>
          </Link>

          <h1 className="auth-stage__headline">{headline}</h1>
          <p className="auth-stage__support">{support}</p>

          <ul className="auth-stage__pillars">
            {pillars.map(({ icon: Icon, label }) => (
              <li key={label}>
                <Icon className="h-4 w-4" aria-hidden />
                {label}
              </li>
            ))}
          </ul>

          <div className="auth-stage__pets" aria-hidden>
            <Image src="/imgs/dog.png" alt="" width={56} height={60} />
            <Image src="/imgs/cat.png" alt="" width={50} height={62} />
            <Image src="/imgs/rabbit.png" alt="" width={40} height={60} />
            <Image src="/imgs/bird.png" alt="" width={56} height={50} />
          </div>
        </div>

        <div className="auth-stage__panel auth-rise auth-rise--delay">
          {children}
        </div>
      </div>
    </section>
  );
}

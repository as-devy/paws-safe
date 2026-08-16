import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { HeartHandshake, Home, PawPrint } from "lucide-react";

type AuthShellProps = {
  children: ReactNode;
  mode: "login" | "signup" | "complete" | "verify";
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
  complete: {
    headline: "Finish your profile",
    support:
      "Add your phone and location so adopters and owners can reach you safely.",
  },
  verify: {
    headline: "Confirm it is really you",
    support:
      "We email a verification link so only you can send foster and adoption requests.",
  },
} as const;

const pillars = [
  { icon: HeartHandshake, label: "Adopt" },
  { icon: PawPrint, label: "Foster" },
  { icon: Home, label: "Rehome" },
];

const journey = {
  login: [
    { step: "01", title: "Pick up", note: "Saved pets & requests" },
    { step: "02", title: "Respond", note: "Messages from owners" },
    { step: "03", title: "Connect", note: "When both sides agree" },
  ],
  signup: [
    { step: "01", title: "Join", note: "Create your profile" },
    { step: "02", title: "Trust", note: "Verify when you post" },
    { step: "03", title: "Care", note: "Adopt, foster, or rehome" },
  ],
  complete: [
    { step: "01", title: "Signed in", note: "Google connected" },
    { step: "02", title: "Details", note: "Phone & location" },
    { step: "03", title: "Ready", note: "Start helping pets" },
  ],
  verify: [
    { step: "01", title: "Inbox", note: "Open the email" },
    { step: "02", title: "Confirm", note: "Tap the link" },
    { step: "03", title: "Request", note: "Adopt or foster" },
  ],
} as const;

export default function AuthShell({ children, mode }: AuthShellProps) {
  const { headline, support } = copy[mode];
  const steps = journey[mode];

  return (
    <section className={`auth-stage auth-stage--${mode === "complete" || mode === "verify" ? "signup" : mode}`}>
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

          <ol className="auth-stage__journey" aria-label="How Paws Safe works">
            {steps.map((item, index) => (
              <li key={item.step} className="auth-stage__journey-item">
                {index > 0 && (
                  <span className="auth-stage__journey-line" aria-hidden />
                )}
                <span className="auth-stage__journey-step">{item.step}</span>
                <span className="auth-stage__journey-title">{item.title}</span>
                <span className="auth-stage__journey-note">{item.note}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="auth-stage__panel auth-rise auth-rise--delay">
          {children}
        </div>
      </div>
    </section>
  );
}

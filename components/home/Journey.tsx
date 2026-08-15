import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  ClipboardList,
  HeartHandshake,
  ImagePlus,
  Inbox,
  PawPrint,
  Search,
  ShieldCheck,
  Siren,
  Timer,
} from "lucide-react";

const ownerSteps = [
  {
    icon: ImagePlus,
    title: "Create your pet’s profile",
    text: "Share photos, personality, and care details so the right home can find them.",
  },
  {
    icon: Siren,
    title: "Use emergency when it matters",
    text: "Urgent rehoming gets a visibility boost so help can arrive faster.",
  },
  {
    icon: Inbox,
    title: "Review incoming requests",
    text: "Read each application and choose the person who feels like the best fit.",
  },
  {
    icon: HeartHandshake,
    title: "Approve and meet safely",
    text: "Contact details are shared only after you approve, then you arrange a meet-up.",
  },
];

const seekerSteps = [
  {
    icon: Search,
    title: "Find a pet you love",
    text: "Browse adoption and foster listings until one feels like family.",
  },
  {
    icon: ClipboardList,
    title: "Send a request",
    text: "Fill in a short form from the pet’s page so the owner can learn about your home.",
  },
  {
    icon: Timer,
    title: "Wait for a decision",
    text: "The owner reviews your application and decides if you’re the right match.",
  },
  {
    icon: PawPrint,
    title: "Connect with the owner",
    text: "If approved, you both get contact details to plan a safe meet-up.",
  },
];

function JourneySteps({
  steps,
}: {
  steps: typeof ownerSteps;
}) {
  return (
    <ol className="journey-steps">
      {steps.map((step) => {
        const Icon = step.icon;
        return (
          <li key={step.title} className="journey-step">
            <span className="journey-step__index" aria-hidden>
              <Icon className="h-4 w-4" />
            </span>
            <div>
              <h4>{step.title}</h4>
              <p>{step.text}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

export default function Journey() {
  return (
    <section className="journey">
      <div className="section-pattern section-pattern--flow" aria-hidden />

      <div className="journey__inner">
        <div className="reveal-child journey__intro">
          <span className="journey__kicker">How it works</span>
          <h2>Your journey to adopt, foster, or rehome</h2>
          <p>
            Paws Safe keeps both sides in control. Owners post with care,
            adopters and fosters request with context, and nobody shares contact
            details until a match is approved.
          </p>
        </div>

        <article className="reveal-child journey-path">
          <div className="journey-path__visual">
            <div className="journey-path__orb" aria-hidden />
            <div className="journey-path__frame">
              <Image
                src="/imgs/article1.png"
                alt="Illustrated pet profile card for a puppy named Leo"
                width={480}
                height={380}
              />
            </div>
          </div>

          <div className="journey-path__body">
            <div className="journey-path__meta">
              <span className="journey-path__role">For pet owners</span>
              <span className="journey-path__badge">
                <BadgeCheck className="h-3.5 w-3.5" aria-hidden />
                Verification required to post
              </span>
            </div>
            <h3>Post a listing and choose the right home</h3>
            <JourneySteps steps={ownerSteps} />
            <Link href="/post-pet" className="journey-path__cta">
              Post a pet
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </article>

        <article className="reveal-child journey-path journey-path--reverse">
          <div className="journey-path__visual">
            <div className="journey-path__orb journey-path__orb--warm" aria-hidden />
            <div className="journey-path__frame">
              <Image
                src="/imgs/article2.png"
                alt="Illustrated polaroid of two dogs with a completed request form"
                width={480}
                height={380}
              />
            </div>
          </div>

          <div className="journey-path__body">
            <div className="journey-path__meta">
              <span className="journey-path__role">For adopters & fosters</span>
            </div>
            <h3>Request a pet and meet when you’re approved</h3>
            <JourneySteps steps={seekerSteps} />
            <div className="journey-path__actions">
              <Link href="/adoption" className="journey-path__cta">
                Browse adoption
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
              <Link href="/foster" className="journey-path__cta journey-path__cta--ghost">
                Browse foster
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>
          </div>
        </article>

        <ul className="reveal-child journey-trust">
          <li>
            <ShieldCheck className="h-5 w-5" aria-hidden />
            <span>Listings from verified owners</span>
          </li>
          <li>
            <Inbox className="h-5 w-5" aria-hidden />
            <span>Contact details stay private until approval</span>
          </li>
          <li>
            <HeartHandshake className="h-5 w-5" aria-hidden />
            <span>You arrange the meet-up on your terms</span>
          </li>
        </ul>
      </div>
    </section>
  );
}

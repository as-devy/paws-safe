import Image from "next/image";
import { Globe, HandCoins, Home, PawPrint } from "lucide-react";

const leftBenefits = [
  {
    icon: Home,
    title: "A New Home",
    text: "We ensure pets find safe, loving homes with responsible adopters through a secure and verified process.",
  },
  {
    icon: HandCoins,
    title: "Financial Aid Resources",
    text: "Explore trusted resources offering financial support for pet care, including emergencies and basic needs.",
  },
];

const rightBenefits = [
  {
    icon: Globe,
    title: "Accessible Anywhere",
    text: "PawsSafe connects pet owners, adopters, and fosters nationwide, making it easy to find the right pet or home.",
  },
  {
    icon: PawPrint,
    title: "Pet Care Tips",
    text: "Access expert-backed guides covering nutrition, training, health, and behavior to help pets thrive.",
  },
];

function BenefitItem({
  icon: Icon,
  title,
  text,
}: {
  icon: typeof Home;
  title: string;
  text: string;
}) {
  return (
    <div className="benefit-item">
      <div className="benefit-icon">
        <Icon className="h-7 w-7 sm:h-8 sm:w-8" />
      </div>
      <div>
        <h3 className="mb-1 font-display text-lg font-bold text-heading sm:text-xl">
          {title}
        </h3>
        <p className="max-w-xs text-sm leading-relaxed text-muted">{text}</p>
      </div>
    </div>
  );
}

export default function Benefits() {
  return (
    <section className="benefits">
      <div className="relative z-[1] mx-auto w-[min(1200px,92%)]">
        <div className="reveal-child mx-auto mb-12 max-w-3xl text-center sm:mb-16">
          <span className="text-sm font-bold tracking-wide text-primary uppercase">
            What We Do
          </span>
          <h2 className="mt-2 font-display text-3xl font-extrabold text-heading sm:text-5xl">
            Our Benefits
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted sm:text-base">
            At PawsSafe, we make pet rehoming, adoption, and fostering safe,
            simple, and accessible. Whether you need a new home for your pet or
            want to welcome one, we keep the process trusted and supportive.
          </p>
        </div>

        <div className="grid items-center gap-10 lg:grid-cols-[1fr_minmax(240px,380px)_1fr] lg:gap-8">
          <div className="reveal-child flex flex-col gap-10 lg:items-end">
            {leftBenefits.map((b) => (
              <BenefitItem key={b.title} {...b} />
            ))}
          </div>

          <div className="benefits__stage reveal-child">
            <div className="benefits__orb" aria-hidden />
            <div className="benefits__ring" aria-hidden />
            <Image
              src="/imgs/benefits-natural.jpg"
              alt="A collie and a cat sitting together at home"
              width={640}
              height={640}
              className="benefits__photo"
            />
          </div>

          <div className="reveal-child flex flex-col gap-10">
            {rightBenefits.map((b) => (
              <BenefitItem key={b.title} {...b} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

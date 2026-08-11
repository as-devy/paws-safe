import Image from "next/image";
import Link from "next/link";

export default function AdoptFosterBanners() {
  return (
    <section className="py-12 sm:py-16">
      <div className="mx-auto grid w-[min(1200px,92%)] gap-5 md:grid-cols-2">
        <div className="reveal-child relative overflow-hidden rounded-3xl bg-primary-soft px-5 py-8 sm:px-8 sm:py-10">
          <div className="relative z-10 ml-auto max-w-[70%] text-right">
            <p className="text-sm leading-relaxed font-semibold text-heading sm:text-base">
              Adopting means giving a pet a second chance. Many animals lose
              their homes for reasons they can&apos;t control. When you adopt,
              you save a life—and make room in shelters for others.
            </p>
            <Link
              href="/adoption"
              className="mt-5 inline-block rounded-full bg-ink px-5 py-2.5 text-sm font-bold text-white transition-opacity hover:opacity-90 dark:bg-heading dark:text-cream"
            >
              Adopt a Pet →
            </Link>
          </div>
          <Image
            src="/imgs/banner.jpg"
            alt="Woman with adopted dog"
            width={140}
            height={160}
            className="absolute bottom-0 left-3 h-auto w-20 object-contain sm:left-4 sm:w-32"
          />
        </div>

        <div className="reveal-child relative overflow-hidden rounded-3xl bg-[color-mix(in_srgb,#ffdcdc_88%,var(--card))] px-5 py-8 sm:px-8 sm:py-10 dark:bg-[color-mix(in_srgb,#7a3b3b_35%,var(--card))]">
          <div className="relative z-10 max-w-[70%]">
            <p className="text-sm leading-relaxed font-semibold text-heading sm:text-base">
              Fostering means giving a pet a temporary home. It helps animals
              feel safe, loved, and ready for adoption—perfect if you can&apos;t
              commit long-term but still want to help.
            </p>
            <Link
              href="/foster"
              className="mt-5 inline-block rounded-full bg-ink px-5 py-2.5 text-sm font-bold text-white transition-opacity hover:opacity-90 dark:bg-heading dark:text-cream"
            >
              Foster a Pet →
            </Link>
          </div>
          <Image
            src="/imgs/banner2.jpg"
            alt="Dog and cat foster friends"
            width={140}
            height={160}
            className="absolute right-4 bottom-0 h-auto w-20 object-contain sm:right-6 sm:w-32"
          />
        </div>
      </div>
    </section>
  );
}

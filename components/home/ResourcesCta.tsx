import Link from "next/link";
<<<<<<< HEAD
import { ArrowRight } from "lucide-react";

export default function ResourcesCta() {
  return (
    <section className="resources-band">
      <div className="resources-band__media" aria-hidden>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/imgs/adop.jpg" alt="" />
      </div>
      <div className="resources-band__tint" aria-hidden />
      <div className="resources-band__overlay" aria-hidden />

      <div className="reveal-child resources-band__content">
        <h2>Pet Support & Resources</h2>
        <p>
          Struggling with pet care costs or need advice? Find trusted financial
          aid programs, care tips, and join our community forum.
        </p>
        <Link href="/community-support" className="resources-band__cta">
          Explore Resources
          <ArrowRight className="h-4 w-4" aria-hidden />
=======

export default function ResourcesCta() {
  return (
    <section className="resources-band flex min-h-[280px] items-center justify-center px-4 py-16 sm:min-h-[320px]">
      <div className="reveal-child mx-auto max-w-3xl text-center text-white">
        <h2 className="font-display text-3xl font-extrabold sm:text-5xl">
          Pet Support & Resources
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-sm font-semibold leading-relaxed sm:text-lg">
          Struggling with pet care costs or need advice? Find trusted financial
          aid programs, care tips, and join our community forum.
        </p>
        <Link
          href="/community-support"
          className="mt-8 inline-flex items-center justify-center rounded-full bg-primary px-8 py-3.5 text-base font-bold text-white transition-colors hover:bg-primary-dark"
        >
          Explore Resources
>>>>>>> 9fbe6272ae14926655cd6155816221b0eb2ae799
        </Link>
      </div>
    </section>
  );
}

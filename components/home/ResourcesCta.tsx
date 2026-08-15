import Link from "next/link";
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
        </Link>
      </div>
    </section>
  );
}

import Image from "next/image";
import { BadgeCheck } from "lucide-react";

export default function Journey() {
  return (
    <section className="py-16 sm:py-20">
      <div className="reveal-child mx-auto mb-12 w-[min(800px,92%)] text-center">
        <h2 className="font-display text-2xl font-extrabold text-heading sm:text-4xl">
          Your Journey to Adopt, Foster, or Rehome a Pet
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-muted sm:text-base">
          At PawsSafe, every pet deserves a safe, loving home. Whether you want
          to adopt, foster, or find a new home for your pet, we make the process
          smooth, supportive, and full of heart.
        </p>
      </div>

      <div className="mx-auto flex w-[min(1100px,92%)] flex-col gap-10">
        <article className="reveal-child journey-card grid items-center gap-6 rounded-3xl p-5 md:grid-cols-[minmax(0,320px)_1fr] md:p-8">
          <Image
            src="/imgs/article1.png"
            alt="Pet owner creating a profile"
            width={400}
            height={320}
            className="mx-auto h-auto w-full max-w-[300px] object-contain"
          />
          <div>
            <div className="mb-4 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h3 className="font-display text-xl font-bold text-primary">
                For Pet Owners: Post and Connect
              </h3>
              <span className="inline-flex items-center gap-1.5 rounded-md bg-navy px-2.5 py-1 text-[11px] font-semibold text-white">
                <BadgeCheck className="h-3.5 w-3.5" />
                Get Verified To Access This Process
              </span>
            </div>
            <ol className="list-decimal space-y-2 pl-5 text-sm leading-relaxed text-ink/90">
              <li>
                <b>Create Your Pet&apos;s Profile:</b> Share your pet&apos;s
                story, photos, and important details.
              </li>
              <li>
                <b>Activate the Emergency Button:</b> Boost visibility for urgent
                rehoming cases.
              </li>
              <li>
                <b>Receive and Review Requests:</b> Review applications and
                choose the best fit.
              </li>
              <li>
                <b>Approve and Connect:</b> Contact the approved user through the
                platform and arrange a safe meet-up.
              </li>
            </ol>
          </div>
        </article>

        <article className="reveal-child journey-card grid items-center gap-6 rounded-3xl p-5 md:grid-cols-[1fr_minmax(0,320px)] md:p-8">
          <div className="md:order-1">
            <h3 className="mb-4 font-display text-xl font-bold text-primary">
              For Adopters and Fosters: Request and Meet
            </h3>
            <ol className="list-decimal space-y-2 pl-5 text-sm leading-relaxed text-ink/90">
              <li>
                <b>Find a Pet You Love:</b> Browse pets looking for a permanent
                or temporary home.
              </li>
              <li>
                <b>Submit a Request Form:</b> Fill out a simple form from the
                pet&apos;s profile page.
              </li>
              <li>
                <b>Wait for Approval:</b> The pet owner reviews your application.
              </li>
              <li>
                <b>Connect with the Owner:</b> Once approved, arrange a safe
                meet-up and complete the process.
              </li>
            </ol>
          </div>
          <Image
            src="/imgs/article2.png"
            alt="Adopter meeting a pet"
            width={400}
            height={320}
            className="mx-auto h-auto w-full max-w-[300px] object-contain md:order-2"
          />
        </article>
      </div>
    </section>
  );
}

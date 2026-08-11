import Image from "next/image";

export default function Donation() {
  return (
    <section id="donation" className="bg-donation py-12 sm:py-16">
      <div className="mx-auto flex w-[min(1100px,92%)] flex-col-reverse items-center gap-8 md:flex-row-reverse md:justify-between md:gap-12">
        <div className="reveal-child w-full max-w-lg">
          <h2 className="font-display text-3xl font-bold text-heading sm:text-5xl">
            Make a Donation
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted sm:text-base">
            Support our work by bank transfer. Your donation helps more pets
            find safe homes, supports pet owners in need, and keeps community
            resources running. Every contribution makes a difference.
          </p>
          <div className="mt-5 w-full max-w-md rounded-xl bg-navy-soft px-4 py-3 text-sm text-[#eaccad] sm:w-fit">
            <p>
              <strong>Bank Name:</strong> Animal Welfare Bank
            </p>
            <p>
              <strong>Account Name:</strong> PawsSafe Donations
            </p>
            <p>
              <strong>Account Number:</strong> 12345678
            </p>
            <p>
              <strong>Sort Code:</strong> 00-00-00
            </p>
            <p>
              <strong>Reference:</strong> YourName-Donation
            </p>
          </div>
        </div>

        <Image
          src="/imgs/donate.png"
          alt="Support pets with a donation"
          width={360}
          height={320}
          className="reveal-child h-auto w-56 object-contain sm:w-72 md:w-80"
        />
      </div>
    </section>
  );
}

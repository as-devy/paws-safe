import Image from "next/image";
<<<<<<< HEAD
import { Building2, Hash, HeartHandshake, Landmark, UserRound } from "lucide-react";

const details = [
  { icon: Landmark, label: "Bank name", value: "Animal Welfare Bank" },
  { icon: UserRound, label: "Account name", value: "PawsSafe Donations" },
  { icon: Hash, label: "Account number", value: "12345678" },
  { icon: Building2, label: "Sort code", value: "00-00-00" },
  { icon: HeartHandshake, label: "Reference", value: "YourName-Donation" },
];

export default function Donation() {
  return (
    <section id="donation" className="donation">
      <div className="section-pattern section-pattern--paws" aria-hidden />

      <div className="donation__inner">
        <div className="donation__stage reveal-child">
          <div className="donation__orb" aria-hidden />
          <Image
            src="/imgs/donate.png"
            alt="A happy dog waiting for community support"
            width={420}
            height={380}
            className="donation__photo"
          />
        </div>

        <div className="donation__copy reveal-child">
          <p className="donation__kicker">
            <HeartHandshake className="h-4 w-4" aria-hidden />
            Give a home a chance
          </p>
          <h2>Make a Donation</h2>
          <p className="donation__lead">
=======

export default function Donation() {
  return (
    <section id="donation" className="bg-donation py-12 sm:py-16">
      <div className="mx-auto flex w-[min(1100px,92%)] flex-col-reverse items-center gap-8 md:flex-row-reverse md:justify-between md:gap-12">
        <div className="reveal-child w-full max-w-lg">
          <h2 className="font-display text-3xl font-bold text-heading sm:text-5xl">
            Make a Donation
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted sm:text-base">
>>>>>>> 9fbe6272ae14926655cd6155816221b0eb2ae799
            Support our work by bank transfer. Your donation helps more pets
            find safe homes, supports pet owners in need, and keeps community
            resources running. Every contribution makes a difference.
          </p>
<<<<<<< HEAD

          <div className="donation__card">
            <p className="donation__card-kicker">Bank transfer</p>
            <ul className="donation__list">
              {details.map(({ icon: Icon, label, value }) => (
                <li key={label}>
                  <span className="donation__icon">
                    <Icon className="h-4 w-4" aria-hidden />
                  </span>
                  <span>
                    <b>{label}</b>
                    <span>{value}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
=======
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
>>>>>>> 9fbe6272ae14926655cd6155816221b0eb2ae799
      </div>
    </section>
  );
}

import Image from "next/image";
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
            Support our work by bank transfer. Your donation helps more pets
            find safe homes, supports pet owners in need, and keeps community
            resources running. Every contribution makes a difference.
          </p>

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
      </div>
    </section>
  );
}

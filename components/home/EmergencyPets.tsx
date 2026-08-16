import Link from "next/link";
import PetCard from "@/components/pets/PetCard";
import { fetchEmergencyPets } from "@/lib/pets-server";

export default async function EmergencyPets() {
  const pets = await fetchEmergencyPets(3);

  return (
    <section className="emergency-pets">
      <div className="relative z-[1] mx-auto w-[min(1200px,92%)]">
        <div className="reveal-child mb-12 text-center">
          <span className="text-sm font-bold tracking-wide text-primary uppercase">
            Pets Need You Now – Adopt or Foster Today
          </span>
          <h2 className="mt-2 font-display text-3xl font-extrabold text-heading sm:text-5xl">
            Emergency Pet Rehoming
          </h2>
        </div>

        {pets.length === 0 ? (
          <p className="reveal-child mx-auto max-w-lg text-center text-muted">
            No urgent listings right now. Browse{" "}
            <Link href="/adoption" className="font-bold text-primary">
              adoption
            </Link>{" "}
            or{" "}
            <Link href="/foster" className="font-bold text-primary">
              foster
            </Link>{" "}
            to find a pet who needs you.
          </p>
        ) : (
          <div className="emergency-pets__grid">
            {pets.map((pet) => (
              <div className="reveal-child" key={String(pet.id)}>
                <PetCard pet={pet} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

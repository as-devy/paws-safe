<<<<<<< HEAD
import Link from "next/link";
import PetCard from "@/components/pets/PetCard";
import { fetchEmergencyPets } from "@/lib/pets-server";

export default async function EmergencyPets() {
  const pets = await fetchEmergencyPets(3);

  return (
    <section className="emergency-pets">
      <div className="relative z-[1] mx-auto w-[min(1200px,92%)]">
=======
import Image from "next/image";
import Link from "next/link";
import { MapPin, Siren } from "lucide-react";

const samplePets = [
  {
    id: "1",
    name: "Luna",
    age: "2 Years Old",
    location: "Cairo, Egypt",
    description:
      "Gentle rescue dog looking for a quiet home. Good with kids and already house-trained.",
    category: "Adopt",
    img: "/imgs/banner.jpg",
  },
  {
    id: "2",
    name: "Milo",
    age: "1 Year Old",
    location: "Giza, Egypt",
    description:
      "Playful cat who needs temporary foster care while recovering. Loves sunny windowsills.",
    category: "Foster",
    img: "/imgs/banner2.jpg",
  },
  {
    id: "3",
    name: "Coco",
    age: "3 Years Old",
    location: "Alexandria, Egypt",
    description:
      "Friendly rabbit seeking a calm forever home. Enjoys fresh greens and gentle handling.",
    category: "Adopt",
    img: "/imgs/adop.jpg",
  },
];

export default function EmergencyPets() {
  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto w-[min(1200px,92%)]">
>>>>>>> 9fbe6272ae14926655cd6155816221b0eb2ae799
        <div className="reveal-child mb-12 text-center">
          <span className="text-sm font-bold tracking-wide text-primary uppercase">
            Pets Need You Now – Adopt or Foster Today
          </span>
          <h2 className="mt-2 font-display text-3xl font-extrabold text-heading sm:text-5xl">
            Emergency Pet Rehoming
          </h2>
        </div>

<<<<<<< HEAD
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
=======
        <div className="flex flex-wrap justify-center gap-6">
          {samplePets.map((pet) => (
            <article
              key={pet.id}
              className="reveal-child pet-card w-full max-w-[340px] overflow-hidden rounded-2xl bg-card pb-6 text-center"
            >
              <div className="relative h-56 w-full">
                <Image
                  src={pet.img}
                  alt={pet.name}
                  fill
                  className="object-cover"
                  sizes="340px"
                />
                <span className="absolute top-0 left-0 inline-flex items-center gap-1 rounded-br-lg bg-primary px-2.5 py-1 text-xs font-bold tracking-wide text-white uppercase">
                  <Siren className="h-3.5 w-3.5 text-amber-300" />
                  {pet.category}
                </span>
              </div>
              <div className="flex flex-col gap-2 px-4 pt-5">
                <h3 className="font-display text-2xl font-bold text-heading">
                  {pet.name}
                </h3>
                <span className="text-sm font-bold tracking-wide text-danger uppercase">
                  {pet.age}
                </span>
                <p className="flex items-center justify-center gap-1 text-sm text-muted">
                  <MapPin className="h-4 w-4" />
                  {pet.location}
                </p>
                <p className="line-clamp-3 text-sm leading-relaxed text-muted">
                  {pet.description}
                </p>
              </div>
              <Link
                href={`/pets/${pet.id}`}
                className="mt-4 inline-block rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-primary-dark"
              >
                More info
              </Link>
            </article>
          ))}
        </div>
>>>>>>> 9fbe6272ae14926655cd6155816221b0eb2ae799
      </div>
    </section>
  );
}

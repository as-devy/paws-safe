import Link from "next/link";
import { MapPin, Siren } from "lucide-react";
import { getRequestCount, isTruthy, type Pet } from "@/lib/pets";

type PetCardProps = {
  pet: Pet;
};

export default function PetCard({ pet }: PetCardProps) {
  const requestCount = getRequestCount(pet);
  const tags = [
    isTruthy(pet.foster) ? "Foster" : null,
    isTruthy(pet.rehoming) ? "Adopt" : null,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <article className="pet-listing-card">
      <div className="pet-listing-card__img">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={pet.img} alt={pet.name} />
        <span className="pet-listing-card__badge">
          {isTruthy(pet.emergency) && (
            <Siren className="pet-listing-card__emg" aria-hidden />
          )}
          {tags}
        </span>
      </div>
      <div className="pet-listing-card__text">
        <p className="pet-listing-card__requests">
          {requestCount === null ? "Requested" : `${requestCount} Requests`}
        </p>
        <h2 className="pet-listing-card__name">{pet.name}</h2>
        <span className="pet-listing-card__age">{pet.age} Years Old</span>
        <p className="pet-listing-card__location">
          <MapPin className="h-4 w-4 shrink-0" aria-hidden />
          <span>
            {pet.country} , {pet.city}
          </span>
        </p>
        <p className="pet-listing-card__desc">{pet.description}</p>
      </div>
      <Link href={`/pets/${pet.id}`} className="pet-listing-card__link">
        more info
      </Link>
    </article>
  );
}

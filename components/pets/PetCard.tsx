import Link from "next/link";
<<<<<<< HEAD
import { ArrowUpRight, MapPin, Siren } from "lucide-react";
import {
  getRequestCount,
  isTruthy,
  normalizeCategory,
  petDetailHref,
  petModeLabel,
  type Pet,
} from "@/lib/pets";
=======
import { MapPin, Siren } from "lucide-react";
import { getRequestCount, isTruthy, type Pet } from "@/lib/pets";
>>>>>>> 9fbe6272ae14926655cd6155816221b0eb2ae799

type PetCardProps = {
  pet: Pet;
};

export default function PetCard({ pet }: PetCardProps) {
  const requestCount = getRequestCount(pet);
<<<<<<< HEAD
  const statusLabel = petModeLabel(pet);
  const category = normalizeCategory(pet.category);
  const ageLabel =
    pet.age === "" || pet.age == null ? "Age unknown" : `${pet.age} yrs`;

  return (
    <Link href={petDetailHref(pet)} className="pet-card">
      <div className="pet-card__media">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={pet.img} alt={pet.name} loading="lazy" />
        <div className="pet-card__shade" aria-hidden />

        <div className="pet-card__chips">
          <span className={`pet-card__status pet-card__status--${pet.status}`}>
            {statusLabel}
          </span>
          {isTruthy(pet.emergency) && (
            <span className="pet-card__urgent">
              <Siren aria-hidden />
              Urgent
            </span>
          )}
        </div>
      </div>

      <div className="pet-card__body">
        <div className="pet-card__top">
          <h2 className="pet-card__name">{pet.name}</h2>
          <span className="pet-card__requests">
            {requestCount === null
              ? "Matched"
              : `${requestCount} request${requestCount === 1 ? "" : "s"}`}
          </span>
        </div>

        <p className="pet-card__meta">
          <span>{ageLabel}</span>
          <span aria-hidden>·</span>
          <span className="pet-card__category">{category}</span>
        </p>

        <p className="pet-card__location">
          <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden />
          <span>
            {pet.city}
            {pet.city && pet.country ? ", " : ""}
            {pet.country}
          </span>
        </p>

        {pet.description ? (
          <p className="pet-card__desc">{pet.description}</p>
        ) : null}

        <span className="pet-card__cta">
          View profile
          <ArrowUpRight className="h-4 w-4" aria-hidden />
        </span>
      </div>
    </Link>
=======
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
>>>>>>> 9fbe6272ae14926655cd6155816221b0eb2ae799
  );
}

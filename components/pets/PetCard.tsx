import Link from "next/link";
import { ArrowUpRight, MapPin, Siren } from "lucide-react";
import {
  getRequestCount,
  isTruthy,
  normalizeCategory,
  petDetailHref,
  petModeLabel,
  type Pet,
} from "@/lib/pets";

type PetCardProps = {
  pet: Pet;
};

function titleCase(value: string) {
  return value
    .trim()
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

function ownerInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase() || "PS";
}

export default function PetCard({ pet }: PetCardProps) {
  const requestCount = getRequestCount(pet);
  const statusLabel = petModeLabel(pet);
  const category = normalizeCategory(pet.category);
  const ageLabel =
    pet.age === "" || pet.age == null ? "Age unknown" : `${pet.age} yrs`;
  const ownerName = pet.ownerName?.trim()
    ? titleCase(pet.ownerName)
    : null;

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

        <div className="pet-card__foot">
          {ownerName ? (
            <span className="pet-card__owner" title={`Listed by ${ownerName}`}>
              <span className="pet-card__owner-avatar" aria-hidden>
                {ownerInitials(ownerName)}
              </span>
              <span className="pet-card__owner-text">
                <em>Listed by</em>
                <strong>{ownerName}</strong>
              </span>
            </span>
          ) : (
            <span />
          )}
          <span className="pet-card__cta">
            View profile
            <ArrowUpRight className="h-4 w-4" aria-hidden />
          </span>
        </div>
      </div>
    </Link>
  );
}

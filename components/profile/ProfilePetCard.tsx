import Link from "next/link";
import { Pencil } from "lucide-react";
import {
  getRequestCount,
  isTruthy,
  normalizeCategory,
  petDetailHref,
  petEditHref,
  petModeLabel,
  type Pet,
} from "@/lib/pets";
import DeletePetButton from "@/components/pets/DeletePetButton";

type ProfilePetCardProps = {
  pet: Pet;
  variant?: "manage" | "view";
};

export default function ProfilePetCard({
  pet,
  variant = "manage",
}: ProfilePetCardProps) {
  const requestCount = getRequestCount(pet);
  const statusLabel = petModeLabel(pet);
  const category = normalizeCategory(pet.category);
  const ageLabel =
    pet.age === "" || pet.age == null ? "Age unknown" : `${pet.age} yrs`;
  const isView = variant === "view";

  return (
    <article className="profile-pet">
      <Link href={petDetailHref(pet)} className="profile-pet__media">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={pet.img} alt={pet.name} />
        <div className="pet-card__chips">
          <span className={`pet-card__status pet-card__status--${pet.status}`}>
            {statusLabel}
          </span>
          {isTruthy(pet.emergency) && (
            <span className="pet-card__urgent">Urgent</span>
          )}
        </div>
      </Link>

      <div className="profile-pet__body">
        <h3 className="profile-pet__name">
          <Link href={petDetailHref(pet)}>{pet.name}</Link>
        </h3>
        <p className="pet-card__meta">
          <span>{ageLabel}</span>
          <span aria-hidden>·</span>
          <span className="pet-card__category">{category}</span>
          {!isView ? (
            <>
              <span aria-hidden>·</span>
              <span>
                {requestCount === null
                  ? "Matched"
                  : `${requestCount} request${requestCount === 1 ? "" : "s"}`}
              </span>
            </>
          ) : isTruthy(pet.requested) ? (
            <>
              <span aria-hidden>·</span>
              <span>Matched</span>
            </>
          ) : null}
        </p>
        <p className="pet-card__location">
          {pet.city}
          {pet.city && pet.country ? ", " : ""}
          {pet.country}
        </p>

        {isView ? (
          <div className="profile-pet__actions">
            <Link href={petDetailHref(pet)} className="profile-pet__btn">
              View listing
            </Link>
          </div>
        ) : (
          <div className="profile-pet__actions">
            <Link href={petEditHref(pet)} className="profile-pet__btn">
              <Pencil className="h-4 w-4" aria-hidden />
              Edit
            </Link>
            <DeletePetButton
              petId={String(pet.id)}
              petName={pet.name}
              redirectTo="/profile"
              variant="card"
            />
          </div>
        )}
      </div>
    </article>
  );
}

import Link from "next/link";
import { MapPin, Siren, Pencil } from "lucide-react";
import {
  getRequestCount,
  isTruthy,
  petDetailHref,
  petEditHref,
  petListingHref,
  petModeLabel,
  type Pet,
} from "@/lib/pets";
import DeletePetButton from "@/components/pets/DeletePetButton";
import RequestPetButton from "@/components/pets/RequestPetButton";
import PetPosterCard from "@/components/pets/PetPosterCard";
import type { PetPoster } from "@/lib/pets-server";

type PetDetailProps = {
  pet: Pet;
  isLoggedIn?: boolean;
  isOwner?: boolean;
  requestStatus?: string | null;
  requestId?: string | null;
  emailVerified?: boolean;
  viewerId?: string | null;
  poster?: PetPoster | null;
};

function DetailRow({
  label,
  value,
  variant = "care",
}: {
  label: string;
  value?: string | null;
  variant?: "care" | "about";
}) {
  const text = value?.trim() || "Not provided";
  return (
    <div
      className={
        variant === "about" ? "pet-detail__qa pet-detail__qa--about" : "pet-detail__qa"
      }
    >
      <p>{label}</p>
      <span>{text}</span>
    </div>
  );
}

export default function PetDetail({
  pet,
  isLoggedIn = false,
  isOwner = false,
  requestStatus = null,
  requestId = null,
  emailVerified = true,
  viewerId = null,
  poster = null,
}: PetDetailProps) {
  const requestCount = getRequestCount(pet);
  const modeLabel = petModeLabel(pet);
  const listingHref = petListingHref(pet);
  const isFoster = pet.status === "foster";
  const alreadyMatched = isTruthy(pet.requested);

  return (
    <main className="pet-detail">
      <div className="pet-detail__frame">
        <nav className="pet-detail__breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span aria-hidden> &gt; </span>
          <Link href={listingHref}>{isFoster ? "Foster" : "Adopt"}</Link>
          <span aria-hidden> &gt; </span>
          <span>{pet.name}</span>
        </nav>

        <div className="pet-detail__layout">
          <div className="pet-detail__media">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={pet.img} alt={pet.name} />
            <span className="pet-detail__badge">
              {isTruthy(pet.emergency) && (
                <Siren className="pet-detail__emg" aria-hidden />
              )}
              {modeLabel}
            </span>
          </div>

          <div className="pet-detail__info">
            <header className="pet-detail__head">
              <h1>{pet.name}</h1>
              <p className="pet-detail__age">{pet.age} years old</p>
            </header>

            <ul className="pet-detail__meta">
              <li>
                <MapPin className="h-4 w-4 shrink-0" aria-hidden />
                <span>
                  {pet.city}
                  {pet.city && pet.country ? ", " : ""}
                  {pet.country}
                </span>
              </li>
              <li>
                <span className="pet-detail__label">Category</span>
                <span className="pet-detail__value">{pet.category}</span>
              </li>
              {pet.gender ? (
                <li>
                  <span className="pet-detail__label">Gender</span>
                  <span className="pet-detail__value">{pet.gender}</span>
                </li>
              ) : null}
              <li>
                <span className="pet-detail__label">Status</span>
                <span className="pet-detail__value">{modeLabel}</span>
              </li>
              <li>
                <span className="pet-detail__label">Requests</span>
                <span className="pet-detail__value">
                  {requestCount === null
                    ? "Already matched"
                    : `${requestCount} pending`}
                </span>
              </li>
            </ul>

            {pet.description ? (
              <DetailRow
                label={`About ${pet.name}`}
                value={pet.description}
                variant="about"
              />
            ) : null}

            <section className="pet-detail__medical">
              <h3>Medical & care history</h3>
              <div className="pet-detail__medical-grid">
                <DetailRow
                  label="Vaccinations"
                  value={pet.vaccines_prevention}
                />
                <DetailRow
                  label="Medical conditions"
                  value={pet.health_history}
                />
                <DetailRow label="Diet" value={pet.diet} />
                <DetailRow label="Behavior" value={pet.behavior} />
              </div>
            </section>

            {poster ? (
              <PetPosterCard
                poster={poster}
                petName={pet.name}
                canSeeContact={isOwner || requestStatus === "approved"}
                isOwner={isOwner}
                alreadyMatched={alreadyMatched}
                showChat={!isOwner && isLoggedIn && emailVerified}
                viewerId={viewerId}
                petId={String(pet.id)}
              />
            ) : null}

            <div className="pet-detail__actions">
              <div className="pet-detail__action-row">
                {!isOwner && !alreadyMatched && (
                  <RequestPetButton
                    petId={String(pet.id)}
                    petName={pet.name}
                    isFoster={isFoster}
                    isLoggedIn={isLoggedIn}
                    emailVerified={emailVerified}
                    loginHref={`/login?callbackUrl=${encodeURIComponent(petDetailHref(pet))}`}
                    requestStatus={requestStatus}
                  />
                )}
                {isOwner && (
                  <>
                    <Link href={petEditHref(pet)} className="pet-detail__edit">
                      <Pencil className="h-5 w-5" aria-hidden />
                      Edit
                    </Link>
                    <DeletePetButton
                      petId={String(pet.id)}
                      petName={pet.name}
                      redirectTo="/profile"
                    />
                  </>
                )}
              </div>
              {!isLoggedIn && !isOwner && !alreadyMatched && (
                <p className="pet-detail__cta-note">
                  Sign in to send a request. Contact details are shared only after
                  the owner approves.
                </p>
              )}
              {isLoggedIn && !emailVerified && !isOwner && !alreadyMatched && (
                <p className="pet-detail__cta-note">
                  Verify your email before sending a foster or adoption request.
                </p>
              )}
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}

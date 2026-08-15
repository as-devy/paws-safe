import {
  BadgeCheck,
  CalendarDays,
  Mail,
  MapPin,
  PawPrint,
  Phone,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import type { PetPoster } from "@/lib/pets-server";
import { userProfileHref } from "@/lib/pets";
import ChatOwnerButton from "@/components/chat/ChatOwnerButton";

type PetPosterCardProps = {
  poster: PetPoster;
  petName: string;
  canSeeContact?: boolean;
  isOwner?: boolean;
  alreadyMatched?: boolean;
  showChat?: boolean;
  viewerId?: string | null;
  petId?: string;
};

function titleCase(value: string) {
  return value
    .trim()
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase() || "PS";
}

export default function PetPosterCard({
  poster,
  petName,
  canSeeContact = false,
  isOwner = false,
  alreadyMatched = false,
  showChat = false,
  viewerId = null,
  petId,
}: PetPosterCardProps) {
  const displayName = titleCase(poster.name);
  const location = [poster.city, poster.country]
    .filter(Boolean)
    .map((part) => titleCase(String(part)))
    .join(", ");
  const memberSince = poster.memberSince.toLocaleDateString("en-GB", {
    month: "short",
    year: "numeric",
  });
  const listingLabel =
    poster.listingCount === 1
      ? "1 listing"
      : `${poster.listingCount} listings`;
  const profileHref = isOwner ? "/profile" : userProfileHref(poster.id);

  return (
    <section className="pet-poster" aria-label="Poster details">
      <div className="pet-poster__head">
        <div className="pet-poster__identity">
          <Link
            href={profileHref}
            className="pet-poster__avatar"
            aria-label={`${displayName}'s profile`}
          >
            {initials(displayName)}
          </Link>
          <div className="pet-poster__who">
            <p className="pet-poster__kicker">Posted by</p>
            <h3>
              <Link href={profileHref} className="pet-poster__name">
                {displayName}
              </Link>
              {poster.verified ? (
                <span className="pet-poster__verified" title="Verified poster">
                  <BadgeCheck className="h-4 w-4" aria-hidden />
                  Verified
                </span>
              ) : null}
            </h3>
            <p className="pet-poster__belongs">
              {isOwner
                ? `This is your listing for ${petName}.`
                : `This pet belongs to ${displayName}.`}
            </p>
            {!isOwner ? (
              <Link href={profileHref} className="pet-poster__profile">
                View profile
              </Link>
            ) : null}
          </div>
        </div>
        {showChat && viewerId ? (
          <div className="pet-poster__chat">
            <ChatOwnerButton
              ownerId={poster.id}
              visitorId={viewerId}
              petId={petId}
              petName={petName}
              peerName={displayName}
            />
          </div>
        ) : null}
      </div>

      <ul className="pet-poster__facts">
        {location ? (
          <li>
            <MapPin className="h-4 w-4" aria-hidden />
            <span>{location}</span>
          </li>
        ) : null}
        <li>
          <CalendarDays className="h-4 w-4" aria-hidden />
          <span>Member since {memberSince}</span>
        </li>
        <li>
          <PawPrint className="h-4 w-4" aria-hidden />
          <span>{listingLabel} on Paws Safe</span>
        </li>
      </ul>

      {canSeeContact && (poster.email || poster.phone) ? (
        <ul className="pet-poster__contact">
          {poster.email ? (
            <li>
              <Mail className="h-4 w-4" aria-hidden />
              <a href={`mailto:${poster.email}`}>{poster.email}</a>
            </li>
          ) : null}
          {poster.phone ? (
            <li>
              <Phone className="h-4 w-4" aria-hidden />
              <a href={`tel:${poster.phone}`}>{poster.phone}</a>
            </li>
          ) : null}
        </ul>
      ) : alreadyMatched ? null : (
        <p className="pet-poster__note">
          <ShieldCheck className="h-4 w-4" aria-hidden />
          {isOwner
            ? "Your email and phone stay private until you approve a request."
            : "Contact details are shared only after the owner approves your request."}
        </p>
      )}
    </section>
  );
}

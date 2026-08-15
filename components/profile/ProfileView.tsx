import Link from "next/link";
import {
  CalendarDays,
  Mail,
  MapPin,
  PawPrint,
  Phone,
  Plus,
  ShieldCheck,
  Upload,
} from "lucide-react";
import type { ProfileUser } from "@/lib/pets-server";
import type { Pet } from "@/lib/pets";
import ProfilePetCard from "./ProfilePetCard";
import IncomingRequests from "./IncomingRequests";
import RequestedPets from "./RequestedPets";
import ChatOwnerButton, { ChatInboxButton } from "@/components/chat/ChatOwnerButton";
import type { IncomingPetRequest, OutgoingPetRequest } from "@/lib/requests";

type ProfileViewProps = {
  user: ProfileUser;
  pets: Pet[];
  incomingRequests?: IncomingPetRequest[];
  outgoingRequests?: OutgoingPetRequest[];
  highlightRequestId?: string | null;
  variant?: "own" | "public";
  canSeeContact?: boolean;
  showChat?: boolean;
  chatVisitorId?: string | null;
  chatOwnerId?: string | null;
};

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase() || "PS";
}

function titleCase(value: string) {
  return value
    .trim()
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

export default function ProfileView({
  user,
  pets,
  incomingRequests = [],
  outgoingRequests = [],
  highlightRequestId,
  variant = "own",
  canSeeContact = true,
  showChat = false,
  chatVisitorId = null,
  chatOwnerId = null,
}: ProfileViewProps) {
  const isOwn = variant === "own";
  const adoptionCount = pets.filter((pet) => pet.status === "adoption").length;
  const fosterCount = pets.filter((pet) => pet.status === "foster").length;
  const memberSince = user.memberSince.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const displayName = titleCase(user.name);
  const location = [user.city, user.country]
    .filter(Boolean)
    .map((part) => titleCase(String(part)))
    .join(", ");
  const showContact = canSeeContact && Boolean(user.email || user.phone);

  return (
    <main className="profile">
      <section className="profile__hero">
        <div className="profile__hero-inner">
          <p className="profile__kicker">{isOwn ? "Your space" : "Poster"}</p>
          <h1>{isOwn ? "Profile" : displayName}</h1>
          <p className="profile__crumb">
            <Link href="/">Home</Link>
            <span aria-hidden> &gt; </span>
            {isOwn ? "Profile" : "Poster profile"}
          </p>
        </div>
      </section>

      <div className="profile__frame">
        <section className="profile__identity">
          <div className="profile__avatar" aria-hidden>
            {initials(displayName)}
          </div>

          <div className="profile__who-copy">
            <h2 className="profile__name">
              {displayName}
              {user.verified ? (
                <span className="profile__verified">Verified</span>
              ) : null}
            </h2>
            <ul className="profile__meta">
              {location ? (
                <li>
                  <MapPin className="h-3.5 w-3.5" aria-hidden />
                  <span>{location}</span>
                </li>
              ) : null}
              {showContact && user.email ? (
                <li>
                  <Mail className="h-3.5 w-3.5" aria-hidden />
                  <span>{user.email}</span>
                </li>
              ) : null}
              {showContact && user.phone ? (
                <li>
                  <Phone className="h-3.5 w-3.5" aria-hidden />
                  <span>{user.phone}</span>
                </li>
              ) : null}
              <li>
                <CalendarDays className="h-3.5 w-3.5" aria-hidden />
                <span>Member since {memberSince}</span>
              </li>
            </ul>
            {!isOwn && !showContact ? (
              <p className="profile__privacy">
                <ShieldCheck className="h-4 w-4" aria-hidden />
                Contact details are shared only after this poster approves your
                request.
              </p>
            ) : null}
            {isOwn ? (
              <ChatInboxButton />
            ) : showChat && chatOwnerId && chatVisitorId ? (
              <ChatOwnerButton
                ownerId={chatOwnerId}
                visitorId={chatVisitorId}
                peerName={displayName}
                label="Chat owner"
              />
            ) : null}
          </div>

          <div className="profile__stats" aria-label="Listing stats">
            <div className="profile__stat">
              <strong>{pets.length}</strong>
              <span>Listings</span>
            </div>
            <div className="profile__stat">
              <strong>{adoptionCount}</strong>
              <span>Adoption</span>
            </div>
            <div className="profile__stat">
              <strong>{fosterCount}</strong>
              <span>Foster</span>
            </div>
          </div>
        </section>

        {isOwn && (pets.length > 0 || incomingRequests.length > 0) ? (
          <IncomingRequests
            requests={incomingRequests}
            highlightId={highlightRequestId}
            ownerId={user.id}
          />
        ) : null}

        <section className="profile__listings">
          <div className="profile__listings-head">
            <div>
              <p className="profile__listings-kicker">
                {isOwn ? "Your pets" : "Posted pets"}
              </p>
              <h2>
                {pets.length === 0
                  ? isOwn
                    ? "No listings yet"
                    : "No pets posted yet"
                  : `${pets.length} posted pet${pets.length === 1 ? "" : "s"}`}
              </h2>
            </div>
            {isOwn ? (
              <Link href="/post-pet" className="profile__post">
                <Plus className="h-4 w-4" aria-hidden />
                Post a pet
              </Link>
            ) : null}
          </div>

          {pets.length === 0 ? (
            <div className="profile-empty">
              <div className="profile-empty__icon">
                <PawPrint className="h-6 w-6" aria-hidden />
              </div>
              {isOwn ? (
                <>
                  <h3>Share a pet who needs a home</h3>
                  <p>
                    When you post for adoption or foster, they&apos;ll show up
                    here so you can edit details or take a listing down.
                  </p>
                  <Link href="/post-pet" className="profile__post">
                    <Upload className="h-4 w-4" aria-hidden />
                    Post your first pet
                  </Link>
                </>
              ) : (
                <>
                  <h3>No listings right now</h3>
                  <p>
                    {displayName} hasn&apos;t posted any pets yet. Check back
                    later or browse open listings.
                  </p>
                </>
              )}
            </div>
          ) : (
            <div className="profile__grid">
              {pets.map((pet) => (
                <ProfilePetCard
                  key={String(pet.id)}
                  pet={pet}
                  variant={isOwn ? "manage" : "view"}
                />
              ))}
            </div>
          )}
        </section>

        {isOwn ? (
          <RequestedPets requests={outgoingRequests} visitorId={user.id} />
        ) : null}
      </div>
    </main>
  );
}

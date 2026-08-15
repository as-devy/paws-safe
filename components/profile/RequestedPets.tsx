"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Undo2 } from "lucide-react";
import { withdrawPetRequest, type ReviewRequestState } from "@/lib/actions";
import { formatRelativeTime } from "@/lib/notifications";
import {
  normalizeCategory,
  petDetailHref,
  petModeLabel,
  type Pet,
} from "@/lib/pets";
import type { OutgoingPetRequest } from "@/lib/requests";
import ChatOwnerButton from "@/components/chat/ChatOwnerButton";

const initialState: ReviewRequestState = { message: null };

function statusLabel(status: OutgoingPetRequest["status"]) {
  if (status === "approved") return "Approved";
  if (status === "rejected") return "Declined";
  if (status === "withdrawn") return "Withdrawn";
  return "Pending";
}

function WithdrawButton({
  requestId,
  petName,
}: {
  requestId: string;
  petName: string;
}) {
  const [state, formAction, pending] = useActionState(
    withdrawPetRequest,
    initialState,
  );

  return (
    <form
      action={formAction}
      className="profile-pet__delete"
      onSubmit={(event) => {
        const confirmed = window.confirm(
          `Withdraw your request for ${petName}?`,
        );
        if (!confirmed) event.preventDefault();
      }}
    >
      <input type="hidden" name="requestId" value={requestId} />
      <button
        type="submit"
        className="profile-pet__btn"
        disabled={pending}
      >
        <Undo2 className="h-4 w-4" aria-hidden />
        {pending ? "Withdrawing…" : "Withdraw"}
      </button>
      {state.message ? (
        <p className="profile-pet__error" role="alert">
          {state.message}
        </p>
      ) : null}
    </form>
  );
}

function RequestedPetCard({
  request,
  visitorId,
}: {
  request: OutgoingPetRequest;
  visitorId: string;
}) {
  const pet: Pet = request.pet;
  const category = normalizeCategory(pet.category);
  const ageLabel =
    pet.age === "" || pet.age == null ? "Age unknown" : `${pet.age} yrs`;

  return (
    <article className="profile-pet">
      <Link href={petDetailHref(pet)} className="profile-pet__media">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={pet.img} alt={pet.name} />
        <div className="pet-card__chips">
          <span className={`pet-card__status pet-card__status--${pet.status}`}>
            {petModeLabel(pet)}
          </span>
          <span className={`profile-request__status is-${request.status}`}>
            {statusLabel(request.status)}
          </span>
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
          <span aria-hidden>·</span>
          <time dateTime={request.createdAt}>
            {formatRelativeTime(request.createdAt)}
          </time>
        </p>
        <p className="pet-card__location">
          {pet.city}
          {pet.city && pet.country ? ", " : ""}
          {pet.country}
        </p>

        <div className="profile-pet__actions">
          <Link href={petDetailHref(pet)} className="profile-pet__btn">
            View listing
          </Link>
          {request.status === "pending" ? (
            <WithdrawButton requestId={request.id} petName={pet.name} />
          ) : null}
          {request.status === "approved" || request.status === "pending" ? (
            <ChatOwnerButton
              ownerId={String(pet.owner_id ?? pet.ownerId ?? "")}
              visitorId={visitorId}
              petId={String(pet.id)}
              petName={pet.name}
            />
          ) : null}
        </div>
      </div>
    </article>
  );
}

export default function RequestedPets({
  requests,
  visitorId,
}: {
  requests: OutgoingPetRequest[];
  visitorId: string;
}) {
  return (
    <section className="profile__listings" id="requested-pets">
      <div className="profile__listings-head">
        <div>
          <p className="profile__listings-kicker">Requested pets</p>
          <h2>
            {requests.length === 0
              ? "No requests sent"
              : `${requests.length} requested pet${requests.length === 1 ? "" : "s"}`}
          </h2>
        </div>
      </div>

      {requests.length === 0 ? (
        <div className="profile-empty">
          <h3>Pets you request will live here</h3>
          <p>
            When you send an adoption or foster request, that pet is saved to
            this list so you can track what happens next.
          </p>
        </div>
      ) : (
        <div className="profile__grid">
          {requests.map((request) => (
            <RequestedPetCard
              key={request.id}
              request={request}
              visitorId={visitorId}
            />
          ))}
        </div>
      )}
    </section>
  );
}

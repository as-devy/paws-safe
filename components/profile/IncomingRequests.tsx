"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Check,
  Mail,
  MapPin,
  Phone,
  X,
} from "lucide-react";
import { reviewPetRequest, type ReviewRequestState } from "@/lib/actions";
import { formatRelativeTime } from "@/lib/notifications";
import { petDetailHref, userProfileHref } from "@/lib/pets";
import type { IncomingPetRequest } from "@/lib/requests";
import ChatOwnerButton from "@/components/chat/ChatOwnerButton";
import ConfirmModal from "@/components/ui/ConfirmModal";

const initialState: ReviewRequestState = { message: null };

function titleCase(value: string) {
  return value
    .trim()
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

function statusLabel(status: IncomingPetRequest["status"]) {
  if (status === "approved") return "Approved";
  if (status === "rejected") return "Declined";
  if (status === "withdrawn") return "Withdrawn";
  return "Pending";
}

function IncomingRequestActions({
  requestId,
  petName,
  disabled,
}: {
  requestId: string;
  petName: string;
  disabled: boolean;
}) {
  const [state, formAction, pending] = useActionState(
    reviewPetRequest,
    initialState,
  );
  const [confirm, setConfirm] = useState<"approved" | "rejected" | null>(null);
  const approveFormRef = useRef<HTMLFormElement>(null);
  const declineFormRef = useRef<HTMLFormElement>(null);

  return (
    <div className="profile-request__actions">
      <form ref={approveFormRef} action={formAction}>
        <input type="hidden" name="requestId" value={requestId} />
        <input type="hidden" name="action" value="approved" />
        <button
          type="button"
          className="profile-request__btn profile-request__btn--approve"
          disabled={disabled || pending}
          onClick={() => setConfirm("approved")}
        >
          <Check className="h-4 w-4" aria-hidden />
          {pending && confirm === "approved" ? "Saving…" : "Approve"}
        </button>
      </form>
      <form ref={declineFormRef} action={formAction}>
        <input type="hidden" name="requestId" value={requestId} />
        <input type="hidden" name="action" value="rejected" />
        <button
          type="button"
          className="profile-request__btn profile-request__btn--decline"
          disabled={disabled || pending}
          onClick={() => setConfirm("rejected")}
        >
          <X className="h-4 w-4" aria-hidden />
          Decline
        </button>
      </form>
      {state.message ? (
        <p className="profile-request__error" role="alert">
          {state.message}
        </p>
      ) : null}

      {confirm === "approved" ? (
        <ConfirmModal
          title={`Approve this request?`}
          description={`Approve ${petName}? Other pending requests for this pet will be declined.`}
          confirmLabel="Approve"
          tone="approve"
          icon={<Check className="h-5 w-5" />}
          pending={pending}
          onCancel={() => setConfirm(null)}
          onConfirm={() => approveFormRef.current?.requestSubmit()}
        />
      ) : null}
      {confirm === "rejected" ? (
        <ConfirmModal
          title="Decline this request?"
          description={`Decline the request for ${petName}? You can still review other pending applications.`}
          confirmLabel="Decline"
          tone="danger"
          icon={<X className="h-5 w-5" />}
          pending={pending}
          onCancel={() => setConfirm(null)}
          onConfirm={() => declineFormRef.current?.requestSubmit()}
        />
      ) : null}
    </div>
  );
}

function IncomingRequestCard({
  request,
  highlighted,
  ownerId,
}: {
  request: IncomingPetRequest;
  highlighted: boolean;
  ownerId: string;
}) {
  const cardRef = useRef<HTMLElement>(null);
  const location = [request.requester.city, request.requester.country]
    .filter(Boolean)
    .map((part) => titleCase(String(part)))
    .join(", ");
  const canReview = request.status === "pending" && !request.pet.requested;

  useEffect(() => {
    if (!highlighted || !cardRef.current) return;
    cardRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [highlighted]);

  return (
    <article
      ref={cardRef}
      id={`request-${request.id}`}
      className={`profile-request${highlighted ? " is-highlight" : ""}`}
    >
      <div className="profile-request__top">
        <Link href={petDetailHref(request.pet.id)} className="profile-request__pet">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={request.pet.img} alt="" />
          <span>
            <strong>{request.pet.name}</strong>
            <em>{request.pet.status === "foster" ? "Foster" : "Adoption"}</em>
          </span>
        </Link>
        <div className="profile-request__flags">
          <span className={`profile-request__status is-${request.status}`}>
            {statusLabel(request.status)}
          </span>
          <time dateTime={request.createdAt}>
            {formatRelativeTime(request.createdAt)}
          </time>
        </div>
      </div>

      <div className="profile-request__who">
        <h3>
          <Link href={userProfileHref(request.requester.id)}>
            {titleCase(request.requester.name)}
          </Link>
        </h3>
        <ul>
          {location ? (
            <li>
              <MapPin className="h-3.5 w-3.5" aria-hidden />
              {location}
            </li>
          ) : null}
          {request.requester.email ? (
            <li>
              <Mail className="h-3.5 w-3.5" aria-hidden />
              {request.requester.email}
            </li>
          ) : null}
          {request.requester.phone ? (
            <li>
              <Phone className="h-3.5 w-3.5" aria-hidden />
              {request.requester.phone}
            </li>
          ) : null}
        </ul>
      </div>

      {request.details.length > 0 ? (
        <dl className="profile-request__details">
          {request.details.map((detail) => (
            <div key={detail.label}>
              <dt>{detail.label}</dt>
              <dd>{detail.value}</dd>
            </div>
          ))}
        </dl>
      ) : null}

      {canReview ? (
        <IncomingRequestActions
          requestId={request.id}
          petName={request.pet.name}
          disabled={false}
        />
      ) : null}
      {request.status === "approved" || request.status === "pending" ? (
        <div className="profile-request__actions">
          <ChatOwnerButton
            ownerId={ownerId}
            visitorId={request.requester.id}
            petId={request.pet.id}
            petName={request.pet.name}
            peerName={titleCase(request.requester.name)}
            label="Chat"
          />
        </div>
      ) : null}
    </article>
  );
}

type IncomingRequestsProps = {
  requests: IncomingPetRequest[];
  highlightId?: string | null;
  ownerId: string;
};

export default function IncomingRequests({
  requests,
  highlightId,
  ownerId,
}: IncomingRequestsProps) {
  const pendingCount = requests.filter((item) => item.status === "pending").length;

  return (
    <section className="profile__listings" id="requests">
      <div className="profile__listings-head">
        <div>
          <p className="profile__listings-kicker">Incoming</p>
          <h2>
            {requests.length === 0
              ? "No requests yet"
              : `${pendingCount} pending request${pendingCount === 1 ? "" : "s"}`}
          </h2>
        </div>
      </div>

      {requests.length === 0 ? (
        <div className="profile-empty">
          <h3>Waiting for the right home</h3>
          <p>
            When someone requests one of your pets, their full application will
            show up here so you can review and respond.
          </p>
        </div>
      ) : (
        <div className="profile-requests">
          {requests.map((request) => (
            <IncomingRequestCard
              key={request.id}
              request={request}
              highlighted={highlightId === request.id}
              ownerId={ownerId}
            />
          ))}
        </div>
      )}
    </section>
  );
}

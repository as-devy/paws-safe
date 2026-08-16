import "server-only";

import { prisma } from "@/lib/prisma";
import { petDetailHref, type PetStatus } from "@/lib/pets";
import {
  EXPERIENCE_LABEL,
  FINANCIAL_LABEL,
  FOSTER_DURATION_LABEL,
  HOUSEHOLD_LABEL,
  OTHER_PETS_LABEL,
  PETS_ALLOWED_LABEL,
  mapPetRow,
} from "@/lib/pets-server";
import type {
  IncomingPetRequest,
  OutgoingPetRequest,
  RequestDetailRow,
  RequestStatus,
} from "@/lib/requests";

export type {
  IncomingPetRequest,
  OutgoingPetRequest,
  RequestDetailRow,
  RequestStatus,
} from "@/lib/requests";

function asRequestStatus(value: string): RequestStatus {
  if (
    value === "pending" ||
    value === "approved" ||
    value === "rejected" ||
    value === "withdrawn"
  ) {
    return value;
  }
  return "pending";
}

function displayName(
  username: string | null | undefined,
  email: string | null | undefined,
  fallback = "Member",
) {
  return username?.trim() || email?.split("@")[0] || fallback;
}

function labeled(
  map: { readonly [key: string]: string },
  value: string | null | undefined,
) {
  if (!value) return null;
  return map[value] ?? value;
}

export function requestDetailRows(row: {
  pets_allowed: string | null;
  household: string | null;
  other_pets: string | null;
  pet_experience: string | null;
  foster_duration: string | null;
  time_commitment: string | null;
  financial_prepared: string | null;
  petStatus?: PetStatus;
}): RequestDetailRow[] {
  const details: RequestDetailRow[] = [];
  const petsAllowed = labeled(PETS_ALLOWED_LABEL, row.pets_allowed);
  const household = labeled(HOUSEHOLD_LABEL, row.household);
  const otherPets = labeled(OTHER_PETS_LABEL, row.other_pets);
  const experience = labeled(EXPERIENCE_LABEL, row.pet_experience);
  const financial = labeled(FINANCIAL_LABEL, row.financial_prepared);
  const foster = labeled(FOSTER_DURATION_LABEL, row.foster_duration);

  if (petsAllowed) details.push({ label: "Pets allowed", value: petsAllowed });
  if (household) details.push({ label: "Household", value: household });
  if (otherPets) details.push({ label: "Other pets", value: otherPets });
  if (experience) details.push({ label: "Pet experience", value: experience });
  if (foster && (row.petStatus === "foster" || row.foster_duration)) {
    details.push({ label: "Foster duration", value: foster });
  }
  if (row.time_commitment?.trim()) {
    details.push({
      label: "Daily time",
      value: row.time_commitment.trim(),
    });
  }
  if (financial) {
    details.push({ label: "Financially prepared", value: financial });
  }

  return details;
}

export async function fetchIncomingRequests(
  ownerId: string,
): Promise<IncomingPetRequest[]> {
  const rows = await prisma.pet_requests.findMany({
    where: { pets: { owner_id: ownerId } },
    orderBy: { created_at: "desc" },
    include: {
      pets: {
        select: {
          id: true,
          name: true,
          img: true,
          status: true,
          requested: true,
        },
      },
      users: {
        select: {
          id: true,
          username: true,
          email: true,
          phone: true,
          city: true,
          country: true,
        },
      },
    },
  });

  return rows.map((row) => ({
    id: String(row.id),
    status: asRequestStatus(row.status),
    createdAt: row.created_at.toISOString(),
    pet: {
      id: row.pets.id,
      name: row.pets.name,
      img: row.pets.img ?? "",
      status: row.pets.status,
      requested: row.pets.requested,
    },
    requester: {
      id: row.users.id,
      name: displayName(row.full_name ?? row.users.username, row.email ?? row.users.email),
      email: row.email ?? row.users.email,
      phone: row.phone ?? row.users.phone,
      city: row.users.city,
      country: row.users.country,
    },
    details: requestDetailRows({
      ...row,
      petStatus: row.pets.status,
    }),
  }));
}

export async function fetchOutgoingRequests(
  requesterId: string,
): Promise<OutgoingPetRequest[]> {
  const rows = await prisma.pet_requests.findMany({
    where: { requester_id: requesterId },
    orderBy: { created_at: "desc" },
    include: {
      pets: {
        include: {
          _count: { select: { pet_requests: true } },
          users: { select: { username: true, email: true } },
        },
      },
    },
  });

  return rows.map((row) => ({
    id: String(row.id),
    status: asRequestStatus(row.status),
    createdAt: row.created_at.toISOString(),
    pet: mapPetRow(row.pets),
  }));
}

export async function hasApprovedRequestWithOwner(
  requesterId: string,
  ownerId: string,
): Promise<boolean> {
  const row = await prisma.pet_requests.findFirst({
    where: {
      requester_id: requesterId,
      status: "approved",
      pets: { owner_id: ownerId },
    },
    select: { id: true },
  });

  return Boolean(row);
}

export async function respondToOwnedRequest(
  ownerId: string | null | undefined,
  requestIdRaw: string,
  action: "approved" | "rejected",
): Promise<{ ok: boolean; message?: string }> {
  if (!ownerId) {
    return { ok: false, message: "You must be signed in." };
  }

  let requestId: bigint;
  try {
    requestId = BigInt(requestIdRaw);
  } catch {
    return { ok: false, message: "Request not found." };
  }

  const row = await prisma.pet_requests.findUnique({
    where: { id: requestId },
    include: {
      pets: {
        select: {
          id: true,
          name: true,
          owner_id: true,
          requested: true,
        },
      },
    },
  });

  if (!row || row.pets.owner_id !== ownerId) {
    return { ok: false, message: "Request not found." };
  }

  if (row.status !== "pending") {
    return { ok: false, message: "This request was already reviewed." };
  }

  if (action === "approved" && row.pets.requested) {
    return { ok: false, message: "This pet is already matched." };
  }

  const owner = await prisma.users.findUnique({
    where: { id: ownerId },
    select: { username: true, email: true },
  });
  const ownerName = displayName(owner?.username, owner?.email, "The owner");
  const listingHref = petDetailHref(row.pets.id);

  try {
    await prisma.$transaction(async (tx) => {
      await tx.pet_requests.update({
        where: { id: requestId },
        data: { status: action, updated_at: new Date() },
      });

      if (action === "approved") {
        await tx.pets.update({
          where: { id: row.pets.id },
          data: { requested: true },
        });

        const others = await tx.pet_requests.findMany({
          where: {
            pet_id: row.pets.id,
            status: "pending",
            id: { not: requestId },
          },
          select: { id: true, requester_id: true },
        });

        if (others.length > 0) {
          await tx.pet_requests.updateMany({
            where: { id: { in: others.map((item) => item.id) } },
            data: { status: "rejected", updated_at: new Date() },
          });

          await tx.notifications.createMany({
            data: others.map((item) => ({
              user_id: item.requester_id,
              type: "denied",
              title: `${row.pets.name} has been matched`,
              body: `Another home was chosen for ${row.pets.name}.`,
              href: listingHref,
              pet_id: row.pets.id,
              request_id: item.id,
              actor_id: ownerId,
            })),
          });
        }
      }

      await tx.notifications.create({
        data: {
          user_id: row.requester_id,
          type: action === "approved" ? "approval" : "denied",
          title:
            action === "approved"
              ? `Your request for ${row.pets.name} was approved`
              : `Your request for ${row.pets.name} was declined`,
          body:
            action === "approved"
              ? `${ownerName} accepted your request. You can now see their contact details on the listing.`
              : `${ownerName} declined this request for ${row.pets.name}.`,
          href: listingHref,
          pet_id: row.pets.id,
          request_id: row.id,
          actor_id: ownerId,
        },
      });
    });

    return { ok: true };
  } catch (error) {
    console.error("Failed to respond to pet request:", error);
    return { ok: false, message: "Could not update this request." };
  }
}

export async function withdrawOwnedRequest(
  userId: string | null | undefined,
  requestIdRaw: string,
): Promise<{ ok: boolean; message?: string }> {
  if (!userId) {
    return { ok: false, message: "You must be signed in." };
  }

  let requestId: bigint;
  try {
    requestId = BigInt(requestIdRaw);
  } catch {
    return { ok: false, message: "Request not found." };
  }

  const row = await prisma.pet_requests.findUnique({
    where: { id: requestId },
    select: { id: true, requester_id: true, status: true },
  });

  if (!row || row.requester_id !== userId) {
    return { ok: false, message: "Request not found." };
  }

  if (row.status !== "pending") {
    return { ok: false, message: "Only pending requests can be withdrawn." };
  }

  try {
    await prisma.pet_requests.update({
      where: { id: requestId },
      data: { status: "withdrawn", updated_at: new Date() },
    });
    return { ok: true };
  } catch (error) {
    console.error("Failed to withdraw pet request:", error);
    return { ok: false, message: "Could not withdraw this request." };
  }
}

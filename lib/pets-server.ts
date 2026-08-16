import { cache } from "react";
import "server-only";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { pet_status } from "@/lib/generated/prisma/enums";
import {
  normalizeCategory,
  toDbCategory,
  type ListingMode,
  type Pet,
  type PetStatus,
} from "@/lib/pets";
import { userHasAdminRole } from "@/lib/admin-server";

const STATUS_BY_MODE = {
  adoption: pet_status.adoption,
  foster: pet_status.foster,
} as const;

const petOwnerSelect = {
  username: true,
  email: true,
} as const;

const petListInclude = {
  _count: { select: { pet_requests: true } },
  users: { select: petOwnerSelect },
} as const;

type PetWithCount = {
  id: string;
  name: string;
  age: { toNumber?: () => number } | number | null;
  country: string | null;
  city: string | null;
  description: string | null;
  category: string;
  img: string | null;
  status: PetStatus;
  emergency: boolean;
  requested: boolean;
  gender: string | null;
  vaccines_prevention: string | null;
  health_history: string | null;
  diet: string | null;
  behavior: string | null;
  owner_id: string;
  street_address: string | null;
  post_code: string | null;
  _count: { pet_requests: number };
  users?: {
    username: string | null;
    email: string | null;
  } | null;
};

function ownerDisplayName(
  owner?: { username: string | null; email: string | null } | null,
) {
  if (!owner) return null;
  return owner.username?.trim() || owner.email?.split("@")[0] || "Member";
}

function toAge(age: PetWithCount["age"]): string | number {
  if (age == null) return "";
  if (typeof age === "number") return age;
  if (typeof age.toNumber === "function") return age.toNumber();
  return Number(age);
}

export function mapPetRow(row: PetWithCount): Pet {
  return {
    id: row.id,
    name: row.name,
    age: toAge(row.age),
    country: row.country ?? "",
    city: row.city ?? "",
    description: row.description ?? "",
    category: normalizeCategory(row.category),
    img: row.img ?? "",
    status: row.status,
    emergency: row.emergency,
    requested: row.requested,
    gender: row.gender,
    vaccines_prevention: row.vaccines_prevention,
    health_history: row.health_history,
    diet: row.diet,
    behavior: row.behavior,
    owner_id: row.owner_id,
    ownerName: ownerDisplayName(row.users),
    street_address: row.street_address,
    post_code: row.post_code,
    request_count: row._count.pet_requests,
  };
}

export const fetchPetById = cache(async (id: string): Promise<Pet | null> => {
  const row = await prisma.pets.findUnique({
    where: { id },
    include: petListInclude,
  });

  if (!row) return null;
  return mapPetRow(row);
});

export async function fetchPetsForListing(mode: ListingMode): Promise<Pet[]> {
  const rows = await prisma.pets.findMany({
    where: { status: STATUS_BY_MODE[mode] },
    orderBy: { created_at: "desc" },
    include: petListInclude,
  });

  return rows.map(mapPetRow);
}

export async function fetchAdoptionPets() {
  return fetchPetsForListing("adoption");
}

export async function fetchFosterPets() {
  return fetchPetsForListing("foster");
}

export async function fetchEmergencyPets(limit = 3): Promise<Pet[]> {
  try {
    const rows = await prisma.pets.findMany({
      where: { emergency: true },
      orderBy: { created_at: "desc" },
      take: limit,
      include: petListInclude,
    });

    return rows.map(mapPetRow);
  } catch (error) {
    console.error("fetchEmergencyPets: database unavailable", error);
    return [];
  }
}

export type ProfileUser = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  country: string | null;
  city: string | null;
  memberSince: Date;
  verified: boolean;
};

export const fetchUserProfile = cache(async (
  userId: string,
): Promise<ProfileUser | null> => {
  const user = await prisma.users.findUnique({
    where: { id: userId },
    select: {
      id: true,
      username: true,
      email: true,
      phone: true,
      country: true,
      city: true,
      created_at: true,
      verification_status: true,
      role: true,
    },
  });

  if (!user) return null;

  const fallbackName = user.email?.split("@")[0] ?? "Member";

  return {
    id: user.id,
    name: user.username?.trim() || fallbackName,
    email: user.email,
    phone: user.phone,
    country: user.country,
    city: user.city,
    memberSince: user.created_at,
    verified:
      user.verification_status === "approved" || user.role === "admin",
  };
});

export type PetPoster = {
  id: string;
  name: string;
  city: string | null;
  country: string | null;
  memberSince: Date;
  verified: boolean;
  listingCount: number;
  email: string | null;
  phone: string | null;
};

export async function fetchPetPoster(
  ownerId: string,
): Promise<PetPoster | null> {
  const user = await prisma.users.findUnique({
    where: { id: ownerId },
    select: {
      id: true,
      username: true,
      email: true,
      phone: true,
      country: true,
      city: true,
      created_at: true,
      verification_status: true,
      role: true,
      _count: { select: { pets: true } },
    },
  });

  if (!user) return null;

  const fallbackName = user.email?.split("@")[0] ?? "Member";

  return {
    id: user.id,
    name: user.username?.trim() || fallbackName,
    city: user.city,
    country: user.country,
    memberSince: user.created_at,
    verified:
      user.verification_status === "approved" || user.role === "admin",
    listingCount: user._count.pets,
    email: user.email,
    phone: user.phone,
  };
}

export async function fetchPetsByOwner(ownerId: string): Promise<Pet[]> {
  const rows = await prisma.pets.findMany({
    where: { owner_id: ownerId },
    orderBy: { created_at: "desc" },
    include: {
      _count: {
        select: { pet_requests: { where: { status: "pending" } } },
      },
      users: { select: petOwnerSelect },
    },
  });

  return rows.map(mapPetRow);
}

function requiredString(label: string) {
  return z
    .string({
      error: (issue) =>
        issue.input === undefined || issue.input === null
          ? `${label} is required`
          : `${label} must be a string`,
    })
    .trim()
    .min(1, { error: `${label} is required` });
}

function optionalText(value: unknown) {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export const CreatePetSchema = z.object({
  listingType: z.enum(["adoption", "foster"], {
    error: "Choose adoption or foster",
  }),
  name: requiredString("Pet name"),
  age: z.coerce
    .number({ error: "Age must be a number" })
    .min(0, { error: "Age must be 0 or greater" })
    .max(99.9, { error: "Age must be less than 100" }),
  gender: z.enum(["male", "female"], { error: "Please select a gender" }),
  category: z.enum(["dog", "cat", "rabbit", "bird", "fish", "other"], {
    error: "Please choose a category",
  }),
  country: requiredString("Country"),
  streetAddress: requiredString("Street address"),
  city: requiredString("City"),
  postCode: requiredString("Post code"),
  img: requiredString("Pet photo"),
  description: requiredString("Description"),
  vaccines: z.string().optional(),
  health: z.string().optional(),
  diet: z.string().optional(),
  behavior: z.string().optional(),
  emergency: z.boolean().optional(),
});

export type CreatePetInput = z.input<typeof CreatePetSchema>;
export type CreatePetData = z.output<typeof CreatePetSchema>;

export type CreatePetState = {
  errors?: {
    listingType?: string[];
    name?: string[];
    age?: string[];
    gender?: string[];
    category?: string[];
    country?: string[];
    streetAddress?: string[];
    city?: string[];
    postCode?: string[];
    img?: string[];
    description?: string[];
    vaccines?: string[];
    health?: string[];
    diet?: string[];
    behavior?: string[];
    emergency?: string[];
  };
  message?: string | null;
  pet?: Pet;
};

export async function createPet(
  ownerId: string | null | undefined,
  input: unknown,
): Promise<CreatePetState> {
  if (!ownerId) {
    return { message: "You must be signed in to post a pet." };
  }

  const validated = CreatePetSchema.safeParse(input);
  if (!validated.success) {
    return {
      errors: z.flattenError(validated.error).fieldErrors,
      message: "Missing fields. Failed to post pet.",
    };
  }

  const data = validated.data;

  try {
    const row = await prisma.pets.create({
      data: {
        owner_id: ownerId,
        name: data.name,
        age: data.age,
        gender: data.gender,
        category: toDbCategory(data.category),
        status:
          data.listingType === "foster"
            ? pet_status.foster
            : pet_status.adoption,
        country: data.country,
        street_address: data.streetAddress,
        city: data.city,
        post_code: data.postCode,
        img: data.img,
        description: data.description,
        vaccines_prevention: optionalText(data.vaccines),
        health_history: optionalText(data.health),
        diet: optionalText(data.diet),
        behavior: optionalText(data.behavior),
        emergency: Boolean(data.emergency),
      },
      include: petListInclude,
    });

    return { pet: mapPetRow(row), message: null };
  } catch (error) {
    console.error("Failed to create pet:", error);
    return { message: "Database error: failed to post pet." };
  }
}

export type DeletePetResult =
  | { ok: true; listingHref: "/adoption" | "/foster" }
  | { ok: false; message: string };

export async function deleteOwnedPet(
  ownerId: string | null | undefined,
  petId: string,
): Promise<DeletePetResult> {
  if (!ownerId) {
    return { ok: false, message: "You must be signed in to delete a listing." };
  }

  const id = petId.trim();
  if (!id) {
    return { ok: false, message: "Missing pet." };
  }

  try {
    const pet = await prisma.pets.findUnique({
      where: { id },
      select: { owner_id: true, status: true },
    });

    if (!pet) {
      return { ok: false, message: "This listing no longer exists." };
    }

    if (pet.owner_id !== ownerId && !(await userHasAdminRole(ownerId))) {
      return { ok: false, message: "You can only delete your own listing." };
    }

    await prisma.pets.delete({ where: { id } });

    return {
      ok: true,
      listingHref: pet.status === "foster" ? "/foster" : "/adoption",
    };
  } catch (error) {
    console.error("Failed to delete pet:", error);
    return { ok: false, message: "Database error: failed to delete listing." };
  }
}

function readPetId(input: unknown): string {
  if (input && typeof input === "object" && "petId" in input) {
    return String((input as { petId?: unknown }).petId ?? "").trim();
  }
  return "";
}

export async function updateOwnedPet(
  ownerId: string | null | undefined,
  input: unknown,
): Promise<CreatePetState> {
  if (!ownerId) {
    return { message: "You must be signed in to edit a listing." };
  }

  const petId = readPetId(input);
  if (!petId) {
    return { message: "Missing pet." };
  }

  const existing = await prisma.pets.findUnique({
    where: { id: petId },
    select: { owner_id: true },
  });

  if (!existing) {
    return { message: "This listing no longer exists." };
  }

  if (existing.owner_id !== ownerId && !(await userHasAdminRole(ownerId))) {
    return { message: "You can only edit your own listing." };
  }

  const validated = CreatePetSchema.safeParse(input);
  if (!validated.success) {
    return {
      errors: z.flattenError(validated.error).fieldErrors,
      message: "Missing fields. Failed to update listing.",
    };
  }

  const data = validated.data;

  try {
    const row = await prisma.pets.update({
      where: { id: petId },
      data: {
        name: data.name,
        age: data.age,
        gender: data.gender,
        category: toDbCategory(data.category),
        status:
          data.listingType === "foster"
            ? pet_status.foster
            : pet_status.adoption,
        country: data.country,
        street_address: data.streetAddress,
        city: data.city,
        post_code: data.postCode,
        img: data.img,
        description: data.description,
        vaccines_prevention: optionalText(data.vaccines),
        health_history: optionalText(data.health),
        diet: optionalText(data.diet),
        behavior: optionalText(data.behavior),
        emergency: Boolean(data.emergency),
      },
      include: petListInclude,
    });

    return { pet: mapPetRow(row), message: null };
  } catch (error) {
    console.error("Failed to update pet:", error);
    return { message: "Database error: failed to update listing." };
  }
}

export const PETS_ALLOWED_LABEL = {
  yes: "Yes",
  no: "No",
  not_sure: "Not sure",
} as const;

export const HOUSEHOLD_LABEL = {
  alone: "I live alone",
  adults: "Adults",
  children: "Children",
  roommates: "Roommates",
  adults_children: "Adults and children",
  adults_roommates: "Adults and roommates",
  family: "Adults, children, and roommates",
} as const;

export const OTHER_PETS_LABEL = {
  no: "No",
  yes_dog: "Yes, a dog",
  yes_cat: "Yes, a cat",
  yes_other: "Yes, other pets",
} as const;

export const EXPERIENCE_LABEL = {
  yes: "Yes",
  no: "No",
} as const;

export const FINANCIAL_LABEL = {
  yes: "Yes",
  no: "No",
  unsure: "Unsure",
} as const;

export const FOSTER_DURATION_LABEL = {
  short_term: "Short-term (a few weeks)",
  long_term: "Long-term (several months or more)",
  emergency: "Emergency fostering (temporary care in urgent situations)",
  not_sure: "Not sure yet",
} as const;

export const RequestPetSchema = z.object({
  petId: requiredString("Pet"),
  petsAllowed: z.enum(["yes", "no", "not_sure"], {
    error: "Select whether pets are allowed in your residence",
  }),
  household: z.enum(
    [
      "alone",
      "adults",
      "children",
      "roommates",
      "adults_children",
      "adults_roommates",
      "family",
    ],
    { error: "Select who lives in your home" },
  ),
  otherPets: z.enum(["no", "yes_dog", "yes_cat", "yes_other"], {
    error: "Select whether you currently have other pets",
  }),
  petExperience: z.enum(["yes", "no"], {
    error: "Select whether you have owned or cared for pets before",
  }),
  fosterDuration: z
    .enum(["short_term", "long_term", "emergency", "not_sure"])
    .optional(),
  timeCommitment: requiredString("Daily time commitment"),
  financialPrepared: z.enum(["yes", "no", "unsure"], {
    error: "Select whether you are financially prepared",
  }),
  terms: z
    .string({ error: "Accept terms and conditions" })
    .refine((value) => value === "on", {
      error: "Accept terms and conditions",
    }),
});

export type RequestPetValues = {
  petsAllowed?: string;
  household?: string;
  otherPets?: string;
  petExperience?: string;
  fosterDuration?: string;
  timeCommitment?: string;
  financialPrepared?: string;
  terms?: string;
};

export type RequestPetState = {
  errors?: {
    petsAllowed?: string[];
    household?: string[];
    otherPets?: string[];
    petExperience?: string[];
    fosterDuration?: string[];
    timeCommitment?: string[];
    financialPrepared?: string[];
    terms?: string[];
  };
  message?: string | null;
  values?: RequestPetValues;
  ok?: boolean;
  petId?: string;
  needsVerification?: boolean;
};

function formValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function emptyToUndefined(value: string) {
  return value.length > 0 ? value : undefined;
}

function requestValuesFromForm(formData: FormData): RequestPetValues {
  return {
    petsAllowed: formValue(formData, "petsAllowed"),
    household: formValue(formData, "household"),
    otherPets: formValue(formData, "otherPets"),
    petExperience: formValue(formData, "petExperience"),
    fosterDuration: formValue(formData, "fosterDuration"),
    timeCommitment: formValue(formData, "timeCommitment"),
    financialPrepared: formValue(formData, "financialPrepared"),
    terms: formValue(formData, "terms"),
  };
}

function formatRequestMessage(
  data: z.output<typeof RequestPetSchema>,
  isFoster: boolean,
) {
  const lines = [
    `Pets allowed in residence: ${PETS_ALLOWED_LABEL[data.petsAllowed]}`,
    `Household: ${HOUSEHOLD_LABEL[data.household]}`,
    `Currently has other pets: ${OTHER_PETS_LABEL[data.otherPets]}`,
    `Owned or cared for pets before: ${EXPERIENCE_LABEL[data.petExperience]}`,
    `Daily time commitment: ${data.timeCommitment}`,
    `Financially prepared: ${FINANCIAL_LABEL[data.financialPrepared]}`,
  ];

  if (isFoster && data.fosterDuration) {
    lines.push(
      `Foster duration: ${FOSTER_DURATION_LABEL[data.fosterDuration]}`,
    );
  }

  return lines.join("\n");
}

export async function fetchUserPetRequest(
  userId: string,
  petId: string,
): Promise<{ id: string; status: string } | null> {
  const row = await prisma.pet_requests.findFirst({
    where: { requester_id: userId, pet_id: petId },
    select: { id: true, status: true },
  });

  if (!row) return null;
  return { id: String(row.id), status: row.status };
}

export async function fetchUserPetRequestStatus(
  userId: string,
  petId: string,
): Promise<string | null> {
  const row = await fetchUserPetRequest(userId, petId);
  return row?.status ?? null;
}

export async function createPetRequest(
  userId: string | null | undefined,
  formData: FormData,
): Promise<RequestPetState> {
  const values = requestValuesFromForm(formData);

  if (!userId) {
    return {
      message: "You must be signed in to request a pet.",
      values,
    };
  }

  const validated = RequestPetSchema.safeParse({
    petId: formValue(formData, "petId"),
    petsAllowed: values.petsAllowed,
    household: values.household,
    otherPets: values.otherPets,
    petExperience: values.petExperience,
    fosterDuration: emptyToUndefined(values.fosterDuration ?? ""),
    timeCommitment: values.timeCommitment,
    financialPrepared: values.financialPrepared,
    terms: values.terms ?? "",
  });

  if (!validated.success) {
    return {
      errors: z.flattenError(validated.error).fieldErrors,
      message: "Please complete the request form.",
      values,
    };
  }

  const data = validated.data;

  try {
    const pet = await prisma.pets.findUnique({
      where: { id: data.petId },
      select: {
        id: true,
        name: true,
        owner_id: true,
        status: true,
        requested: true,
      },
    });

    if (!pet) {
      return { message: "This listing no longer exists.", values };
    }

    if (pet.owner_id === userId) {
      return { message: "You cannot request your own listing.", values };
    }

    if (pet.requested) {
      return { message: "This pet is already matched.", values };
    }

    const isFoster = pet.status === pet_status.foster;
    if (isFoster && !data.fosterDuration) {
      return {
        errors: {
          fosterDuration: ["Select how long you are available to foster"],
        },
        message: "Please complete the request form.",
        values,
      };
    }

    const existing = await prisma.pet_requests.findFirst({
      where: { pet_id: pet.id, requester_id: userId },
      select: { id: true },
    });

    if (existing) {
      return { message: "You already requested this pet.", values };
    }

    const requester = await prisma.users.findUnique({
      where: { id: userId },
      select: {
        username: true,
        email: true,
        phone: true,
        email_verified: true,
        role: true,
      },
    });

    if (!requester?.email_verified && requester?.role !== "admin") {
      return {
        message: "Verify your email before sending a foster or adoption request.",
        values,
        needsVerification: true,
      };
    }

    const fullName =
      requester?.username?.trim() ||
      requester?.email?.split("@")[0] ||
      "Member";

    const listingKind = isFoster ? "foster" : "adoption";

    await prisma.$transaction(async (tx) => {
      const created = await tx.pet_requests.create({
        data: {
          pet_id: pet.id,
          requester_id: userId,
          status: "pending",
          foster_duration: isFoster ? data.fosterDuration ?? null : null,
          pets_allowed: data.petsAllowed,
          household: data.household,
          other_pets: data.otherPets,
          pet_experience: data.petExperience,
          time_commitment: data.timeCommitment,
          financial_prepared: data.financialPrepared,
          full_name: fullName,
          email: requester?.email ?? null,
          phone: requester?.phone ?? null,
          message: formatRequestMessage(data, isFoster),
        },
        select: { id: true },
      });

      await tx.notifications.create({
        data: {
          user_id: pet.owner_id,
          type: "request",
          title: `${fullName} requested ${pet.name}`,
          body: `Review ${fullName}'s ${listingKind} request for ${pet.name}.`,
          href: `/profile?request=${created.id}`,
          pet_id: pet.id,
          request_id: created.id,
          actor_id: userId,
        },
      });
    });

    return { ok: true, petId: pet.id, message: null };
  } catch (error) {
    console.error("Failed to create pet request:", error);
    const code =
      error && typeof error === "object" && "code" in error
        ? String((error as { code?: unknown }).code)
        : "";
    if (code === "P2002" || code === "23505") {
      return { message: "You already requested this pet.", values };
    }
    return { message: "Database error: failed to send request.", values };
  }
}

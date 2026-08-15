export type ListingMode = "adoption" | "foster";

<<<<<<< HEAD
export type PetStatus = "adoption" | "foster";

=======
>>>>>>> 9fbe6272ae14926655cd6155816221b0eb2ae799
export type Pet = {
  id: string | number;
  name: string;
  age: string | number;
  country: string;
  city: string;
  description: string;
  category: string;
  img: string;
<<<<<<< HEAD
  status: PetStatus;
  emergency?: boolean | number;
  requested?: boolean | number;
  requests?: string | unknown[];
  /** Prefer this when loaded via Prisma */
  request_count?: number;
  gender?: string | null;
  vaccines_prevention?: string | null;
  health_history?: string | null;
  diet?: string | null;
  behavior?: string | null;
  ownerId?: string | number;
  owner_id?: string | number;
  streetAddress?: string | null;
  street_address?: string | null;
  postCode?: string | null;
  post_code?: string | null;
=======
  foster?: boolean | number;
  rehoming?: boolean | number;
  emergency?: boolean | number;
  requested?: boolean | number;
  requests?: string | unknown[];
>>>>>>> 9fbe6272ae14926655cd6155816221b0eb2ae799
};

export const KNOWN_CATEGORIES = [
  "cat",
  "dog",
  "bird",
  "rabbit",
  "fish",
] as const;

export type KnownCategory = (typeof KNOWN_CATEGORIES)[number];

<<<<<<< HEAD
/** DB may store plural enums (dogs/cats); UI filters use singular. */
export function normalizeCategory(category: string): string {
  const value = category.trim().toLowerCase();
  const map: Record<string, string> = {
    dogs: "dog",
    dog: "dog",
    cats: "cat",
    cat: "cat",
    birds: "bird",
    bird: "bird",
    rabbits: "rabbit",
    rabbit: "rabbit",
    fish: "fish",
    others: "other",
    other: "other",
  };
  return map[value] ?? value;
}

/** Convert UI category keys to the values stored in the database. */
export function toDbCategory(category: string): string {
  const value = normalizeCategory(category);
  const map: Record<string, string> = {
    dog: "dogs",
    cat: "cats",
    bird: "birds",
    rabbit: "rabbits",
    fish: "fish",
    other: "others",
  };
  return map[value] ?? value;
}

=======
>>>>>>> 9fbe6272ae14926655cd6155816221b0eb2ae799
export const CATEGORY_FILTERS = [
  {
    key: "all",
    label: "All",
    color: "var(--primary)",
<<<<<<< HEAD
=======
    icon: "paw" as const,
>>>>>>> 9fbe6272ae14926655cd6155816221b0eb2ae799
  },
  {
    key: "dog",
    label: "Dogs",
    color: "#ff3d41",
<<<<<<< HEAD
=======
    iconSrc: "/imgs/category-dog.svg",
>>>>>>> 9fbe6272ae14926655cd6155816221b0eb2ae799
  },
  {
    key: "cat",
    label: "Cats",
    color: "#ffb13d",
<<<<<<< HEAD
=======
    iconSrc: "/imgs/category-cats.svg",
>>>>>>> 9fbe6272ae14926655cd6155816221b0eb2ae799
  },
  {
    key: "rabbit",
    label: "Rabbits",
    color: "#3d68ff",
<<<<<<< HEAD
=======
    iconSrc: "/imgs/category-rabbit.svg",
>>>>>>> 9fbe6272ae14926655cd6155816221b0eb2ae799
  },
  {
    key: "bird",
    label: "Birds",
    color: "#ff27b6",
<<<<<<< HEAD
=======
    iconSrc: "/imgs/category-birds.svg",
>>>>>>> 9fbe6272ae14926655cd6155816221b0eb2ae799
  },
  {
    key: "fish",
    label: "Fish",
    color: "#21cd1e",
<<<<<<< HEAD
=======
    iconSrc: "/imgs/category-fish.svg",
>>>>>>> 9fbe6272ae14926655cd6155816221b0eb2ae799
  },
  {
    key: "other",
    label: "Others",
    color: "#ac46ec",
<<<<<<< HEAD
  },
] as const;

=======
    iconSrc: "/imgs/category-others.svg",
  },
] as const;

export const PETS_API = "https://pawssafe.ddns.net/allPets";

>>>>>>> 9fbe6272ae14926655cd6155816221b0eb2ae799
export function countrySlug(country: string) {
  return country.toLowerCase().replace(/\s+/g, "_");
}

export function isTruthy(value: boolean | number | undefined) {
  return Boolean(value);
}

export function getRequestCount(pet: Pet) {
  if (pet.requested) return null;
<<<<<<< HEAD
  if (typeof pet.request_count === "number") return pet.request_count;
=======
>>>>>>> 9fbe6272ae14926655cd6155816221b0eb2ae799
  try {
    const parsed =
      typeof pet.requests === "string"
        ? JSON.parse(pet.requests)
        : pet.requests;
    return Array.isArray(parsed) ? parsed.length : 0;
  } catch {
    return 0;
  }
}

<<<<<<< HEAD
export function petDetailHref(petOrId: Pet | string | number) {
  const id = typeof petOrId === "object" ? String(petOrId.id) : String(petOrId);
  // IDs are base64 and may include "/" or "+" — encode each segment-safe path
  return `/pets/${encodeURIComponent(id)}`;
}

export function petEditHref(petOrId: Pet | string | number) {
  const id = typeof petOrId === "object" ? String(petOrId.id) : String(petOrId);
  return `/profile/pets/${encodeURIComponent(id)}`;
}

export function adminPetEditHref(petOrId: Pet | string | number) {
  const id = typeof petOrId === "object" ? String(petOrId.id) : String(petOrId);
  return `/admin/pets/${encodeURIComponent(id)}`;
}

export function adminUserEditHref(userId: string) {
  return `/admin/users/${encodeURIComponent(userId)}`;
}

export function userProfileHref(userId: string) {
  return `/users/${encodeURIComponent(userId)}`;
}

export function decodePetIdParam(idParam: string | string[]) {
  const raw = Array.isArray(idParam) ? idParam.join("/") : idParam;
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
}

export function petListingHref(pet: Pet) {
  return pet.status === "foster" ? "/foster" : "/adoption";
}

export function petModeLabel(pet: Pet) {
  return pet.status === "foster" ? "Foster" : "Adoption";
}

export function isFosterPet(pet: Pet) {
  return pet.status === "foster";
}

export function isAdoptionPet(pet: Pet) {
  return pet.status === "adoption";
}

export function matchesCategory(pet: Pet, category: string) {
  if (category === "all") return true;
  const petCategory = normalizeCategory(pet.category);
  if (category === "other") {
    return !KNOWN_CATEGORIES.includes(petCategory as KnownCategory);
  }
  return petCategory === category;
=======
export function matchesCategory(pet: Pet, category: string) {
  if (category === "all") return true;
  if (category === "other") {
    return !KNOWN_CATEGORIES.includes(pet.category as KnownCategory);
  }
  return pet.category === category;
>>>>>>> 9fbe6272ae14926655cd6155816221b0eb2ae799
}

export function countCategories(pets: Pet[]) {
  const counts = {
    all: pets.length,
    dog: 0,
    cat: 0,
    rabbit: 0,
    bird: 0,
    fish: 0,
    other: 0,
  };

  pets.forEach((pet) => {
<<<<<<< HEAD
    const petCategory = normalizeCategory(pet.category);
    if (KNOWN_CATEGORIES.includes(petCategory as KnownCategory)) {
      counts[petCategory as KnownCategory]++;
=======
    if (KNOWN_CATEGORIES.includes(pet.category as KnownCategory)) {
      counts[pet.category as KnownCategory]++;
>>>>>>> 9fbe6272ae14926655cd6155816221b0eb2ae799
    } else {
      counts.other++;
    }
  });

  return counts;
}
<<<<<<< HEAD
=======

export async function fetchAllPets(): Promise<Pet[]> {
  const response = await fetch(PETS_API, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  return response.json();
}
>>>>>>> 9fbe6272ae14926655cd6155816221b0eb2ae799

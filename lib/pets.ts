export type ListingMode = "adoption" | "foster";

export type Pet = {
  id: string | number;
  name: string;
  age: string | number;
  country: string;
  city: string;
  description: string;
  category: string;
  img: string;
  foster?: boolean | number;
  rehoming?: boolean | number;
  emergency?: boolean | number;
  requested?: boolean | number;
  requests?: string | unknown[];
};

export const KNOWN_CATEGORIES = [
  "cat",
  "dog",
  "bird",
  "rabbit",
  "fish",
] as const;

export type KnownCategory = (typeof KNOWN_CATEGORIES)[number];

export const CATEGORY_FILTERS = [
  {
    key: "all",
    label: "All",
    color: "var(--primary)",
    icon: "paw" as const,
  },
  {
    key: "dog",
    label: "Dogs",
    color: "#ff3d41",
    iconSrc: "/imgs/category-dog.svg",
  },
  {
    key: "cat",
    label: "Cats",
    color: "#ffb13d",
    iconSrc: "/imgs/category-cats.svg",
  },
  {
    key: "rabbit",
    label: "Rabbits",
    color: "#3d68ff",
    iconSrc: "/imgs/category-rabbit.svg",
  },
  {
    key: "bird",
    label: "Birds",
    color: "#ff27b6",
    iconSrc: "/imgs/category-birds.svg",
  },
  {
    key: "fish",
    label: "Fish",
    color: "#21cd1e",
    iconSrc: "/imgs/category-fish.svg",
  },
  {
    key: "other",
    label: "Others",
    color: "#ac46ec",
    iconSrc: "/imgs/category-others.svg",
  },
] as const;

export const PETS_API = "https://pawssafe.ddns.net/allPets";

export function countrySlug(country: string) {
  return country.toLowerCase().replace(/\s+/g, "_");
}

export function isTruthy(value: boolean | number | undefined) {
  return Boolean(value);
}

export function getRequestCount(pet: Pet) {
  if (pet.requested) return null;
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

export function matchesCategory(pet: Pet, category: string) {
  if (category === "all") return true;
  if (category === "other") {
    return !KNOWN_CATEGORIES.includes(pet.category as KnownCategory);
  }
  return pet.category === category;
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
    if (KNOWN_CATEGORIES.includes(pet.category as KnownCategory)) {
      counts[pet.category as KnownCategory]++;
    } else {
      counts.other++;
    }
  });

  return counts;
}

export async function fetchAllPets(): Promise<Pet[]> {
  const response = await fetch(PETS_API, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  return response.json();
}

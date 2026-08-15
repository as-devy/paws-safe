import type { Pet, PetStatus } from "@/lib/pets";

export type RequestStatus = "pending" | "approved" | "rejected" | "withdrawn";

export type RequestDetailRow = {
  label: string;
  value: string;
};

export type IncomingPetRequest = {
  id: string;
  status: RequestStatus;
  createdAt: string;
  pet: {
    id: string;
    name: string;
    img: string;
    status: PetStatus;
    requested: boolean;
  };
  requester: {
    id: string;
    name: string;
    email: string | null;
    phone: string | null;
    city: string | null;
    country: string | null;
  };
  details: RequestDetailRow[];
};

export type OutgoingPetRequest = {
  id: string;
  status: RequestStatus;
  createdAt: string;
  pet: Pet;
};

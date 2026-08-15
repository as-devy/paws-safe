import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/layout/Header";
import HeaderSkeleton from "@/components/layout/HeaderSkeleton";
import Footer from "@/components/layout/Footer";
import PetDetail from "@/components/pets/PetDetail";
import PetDetailSkeleton from "@/components/pets/PetDetailSkeleton";
import { auth } from "@/auth";
import { decodePetIdParam, petListingHref } from "@/lib/pets";
import { fetchPetById, fetchPetPoster, fetchUserPetRequest } from "@/lib/pets-server";
import "../../pet-detail.css";

type PetPageProps = {
  params: Promise<{ id: string[] }>;
};

export const metadata: Metadata = {
  title: "Pet | Paws Safe",
  description: "View a pet listing on Paws Safe.",
};

async function PetDetailContent({ params }: PetPageProps) {
  const { id } = await params;
  const petId = decodePetIdParam(id);

  let pet = null;
  try {
    pet = await fetchPetById(petId);
  } catch {
    pet = null;
  }

  if (!pet) {
    notFound();
  }

  const session = await auth();
  const isOwner = Boolean(
    session?.user?.id && String(pet.owner_id) === String(session.user.id),
  );
  const viewerRequest =
    session?.user?.id && !isOwner
      ? await fetchUserPetRequest(session.user.id, petId)
      : null;
  const requestStatus = viewerRequest?.status ?? null;
  const canSeeContact = isOwner || requestStatus === "approved";

  let poster = null;
  try {
    poster = pet.owner_id
      ? await fetchPetPoster(String(pet.owner_id))
      : null;
  } catch {
    poster = null;
  }

  if (poster && !canSeeContact) {
    poster = { ...poster, email: null, phone: null };
  }

  return (
    <PetDetail
      pet={pet}
      isLoggedIn={Boolean(session?.user)}
      isOwner={isOwner}
      requestStatus={requestStatus}
      requestId={viewerRequest?.id ?? null}
      emailVerified={Boolean(session?.user?.isEmailVerified)}
      viewerId={session?.user?.id ?? null}
      poster={poster}
    />
  );
}

async function PetPageHeader({ params }: PetPageProps) {
  const { id } = await params;
  const petId = decodePetIdParam(id);

  let pet = null;
  try {
    pet = await fetchPetById(petId);
  } catch {
    pet = null;
  }

  return <Header activeHref={pet ? petListingHref(pet) : undefined} />;
}

export default function PetPage({ params }: PetPageProps) {
  return (
    <>
      <Suspense fallback={<HeaderSkeleton />}>
        <PetPageHeader params={params} />
      </Suspense>
      <Suspense fallback={<PetDetailSkeleton />}>
        <PetDetailContent params={params} />
      </Suspense>
      <Footer />
    </>
  );
}

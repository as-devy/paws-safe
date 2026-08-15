import { Suspense } from "react";
import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import HeaderSkeleton from "@/components/layout/HeaderSkeleton";
import Footer from "@/components/layout/Footer";
import PetListing from "@/components/pets/PetListing";
import ListingSkeleton from "@/components/pets/ListingSkeleton";
import { fetchAdoptionPets } from "@/lib/pets-server";

export const metadata: Metadata = {
  title: "Adopt A Pet | Paws Safe",
  description:
    "Browse pets available for adoption. Filter by country and category to find your new companion.",
};

async function AdoptionListing() {
  const pets = await fetchAdoptionPets();
  return <PetListing mode="adoption" initialPets={pets} />;
}

export default function AdoptionPage() {
  return (
    <>
      <Suspense fallback={<HeaderSkeleton />}>
        <Header />
      </Suspense>
      <Suspense fallback={<ListingSkeleton mode="adoption" />}>
        <AdoptionListing />
      </Suspense>
      <Footer />
    </>
  );
}

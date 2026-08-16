import { Suspense } from "react";
import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import HeaderSkeleton from "@/components/layout/HeaderSkeleton";
import Footer from "@/components/layout/Footer";
import PetListing from "@/components/pets/PetListing";
import ListingSkeleton from "@/components/pets/ListingSkeleton";
import { fetchFosterPets } from "@/lib/pets-server";

export const metadata: Metadata = {
  title: "Foster A Pet | Paws Safe",
  description:
    "Browse pets that need temporary foster homes. Filter by country and category to help an animal in need.",
};

async function FosterListing() {
  const pets = await fetchFosterPets();
  return <PetListing mode="foster" initialPets={pets} />;
}

export default function FosterPage() {
  return (
    <>
      <Suspense fallback={<HeaderSkeleton />}>
        <Header />
      </Suspense>
      <Suspense fallback={<ListingSkeleton mode="foster" />}>
        <FosterListing />
      </Suspense>
      <Footer />
    </>
  );
}

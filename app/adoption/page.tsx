import { Suspense } from "react";
import type { Metadata } from "next";
<<<<<<< HEAD
import Header from "@/components/layout/Header";
import HeaderSkeleton from "@/components/layout/HeaderSkeleton";
import Footer from "@/components/layout/Footer";
import PetListing from "@/components/pets/PetListing";
import ListingSkeleton from "@/components/pets/ListingSkeleton";
import { fetchAdoptionPets } from "@/lib/pets-server";
=======
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PetListing from "@/components/pets/PetListing";
>>>>>>> 9fbe6272ae14926655cd6155816221b0eb2ae799

export const metadata: Metadata = {
  title: "Adopt A Pet | Paws Safe",
  description:
    "Browse pets available for adoption. Filter by country and category to find your new companion.",
};

<<<<<<< HEAD
async function AdoptionListing() {
  const pets = await fetchAdoptionPets();
  return <PetListing mode="adoption" initialPets={pets} />;
=======
function ListingFallback() {
  return (
    <main className="pet-listing pet-listing--adoption">
      <div className="pet-listing__banner pet-listing__banner--adoption">
        <div className="pet-listing__banner-content">
          <h1>Adopt A Pet</h1>
          <p className="pet-listing__breadcrumb">
            <Link href="/">Home</Link>
            <span> &gt; </span>
            <span>Adopt</span>
          </p>
        </div>
      </div>
      <p className="pet-listing__msg">Loading pets…</p>
    </main>
  );
>>>>>>> 9fbe6272ae14926655cd6155816221b0eb2ae799
}

export default function AdoptionPage() {
  return (
    <>
<<<<<<< HEAD
      <Suspense fallback={<HeaderSkeleton />}>
        <Header />
      </Suspense>
      <Suspense fallback={<ListingSkeleton mode="adoption" />}>
        <AdoptionListing />
=======
      <Header />
      <Suspense fallback={<ListingFallback />}>
        <PetListing mode="adoption" />
>>>>>>> 9fbe6272ae14926655cd6155816221b0eb2ae799
      </Suspense>
      <Footer />
    </>
  );
}

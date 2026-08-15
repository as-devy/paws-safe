import { Suspense } from "react";
import type { Metadata } from "next";
<<<<<<< HEAD
import Header from "@/components/layout/Header";
import HeaderSkeleton from "@/components/layout/HeaderSkeleton";
import Footer from "@/components/layout/Footer";
import PetListing from "@/components/pets/PetListing";
import ListingSkeleton from "@/components/pets/ListingSkeleton";
import { fetchFosterPets } from "@/lib/pets-server";
=======
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PetListing from "@/components/pets/PetListing";
>>>>>>> 9fbe6272ae14926655cd6155816221b0eb2ae799

export const metadata: Metadata = {
  title: "Foster A Pet | Paws Safe",
  description:
    "Browse pets that need temporary foster homes. Filter by country and category to help an animal in need.",
};

<<<<<<< HEAD
async function FosterListing() {
  const pets = await fetchFosterPets();
  return <PetListing mode="foster" initialPets={pets} />;
=======
function ListingFallback() {
  return (
    <main className="pet-listing pet-listing--foster">
      <div className="pet-listing__banner pet-listing__banner--foster">
        <div className="pet-listing__banner-content">
          <h1>Foster A Pet</h1>
          <p className="pet-listing__breadcrumb">
            <Link href="/">Home</Link>
            <span> &gt; </span>
            <span>Foster</span>
          </p>
        </div>
      </div>
      <p className="pet-listing__msg">Loading pets…</p>
    </main>
  );
>>>>>>> 9fbe6272ae14926655cd6155816221b0eb2ae799
}

export default function FosterPage() {
  return (
    <>
<<<<<<< HEAD
      <Suspense fallback={<HeaderSkeleton />}>
        <Header />
      </Suspense>
      <Suspense fallback={<ListingSkeleton mode="foster" />}>
        <FosterListing />
=======
      <Header />
      <Suspense fallback={<ListingFallback />}>
        <PetListing mode="foster" />
>>>>>>> 9fbe6272ae14926655cd6155816221b0eb2ae799
      </Suspense>
      <Footer />
    </>
  );
}

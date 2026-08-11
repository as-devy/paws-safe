import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PetListing from "@/components/pets/PetListing";

export const metadata: Metadata = {
  title: "Adopt A Pet | Paws Safe",
  description:
    "Browse pets available for adoption. Filter by country and category to find your new companion.",
};

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
}

export default function AdoptionPage() {
  return (
    <>
      <Header />
      <Suspense fallback={<ListingFallback />}>
        <PetListing mode="adoption" />
      </Suspense>
      <Footer />
    </>
  );
}

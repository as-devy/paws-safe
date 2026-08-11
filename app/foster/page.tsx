import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PetListing from "@/components/pets/PetListing";

export const metadata: Metadata = {
  title: "Foster A Pet | Paws Safe",
  description:
    "Browse pets that need temporary foster homes. Filter by country and category to help an animal in need.",
};

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
}

export default function FosterPage() {
  return (
    <>
      <Header />
      <Suspense fallback={<ListingFallback />}>
        <PetListing mode="foster" />
      </Suspense>
      <Footer />
    </>
  );
}

import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import "../../pet-detail.css";

export default function PetNotFound() {
  return (
    <>
      <Header />
      <main className="pet-detail">
        <div className="pet-detail__missing">
          <h1>Pet not found</h1>
          <p>
            This listing may have been removed or the link is incorrect.
          </p>
          <Link href="/adoption" className="pet-detail__cta">
            Browse adoption
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}

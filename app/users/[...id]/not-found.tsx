import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function PosterNotFound() {
  return (
    <>
      <Header />
      <main className="profile">
        <section className="profile__hero">
          <div className="profile__hero-inner">
            <p className="profile__kicker">Poster</p>
            <h1>Profile not found</h1>
          </div>
        </section>
        <div className="profile__frame">
          <div className="profile-empty">
            <h3>This poster couldn&apos;t be found</h3>
            <p>The profile may have been removed, or the link is incorrect.</p>
            <Link href="/adoption" className="profile__post">
              Browse adoption
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

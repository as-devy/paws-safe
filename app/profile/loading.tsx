import HeaderSkeleton from "@/components/layout/HeaderSkeleton";

export default function ProfileLoading() {
  return (
    <>
      <HeaderSkeleton />
      <main className="profile profile--skel" aria-busy="true">
        <section className="profile__hero">
          <div className="profile__hero-inner">
            <div className="pet-skel pet-skel--crumb" />
            <div className="pet-skel pet-skel--heading" />
          </div>
        </section>
      </main>
    </>
  );
}

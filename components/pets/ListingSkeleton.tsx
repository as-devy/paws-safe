import ListingBanner from "@/components/pets/ListingBanner";
import type { ListingMode } from "@/lib/pets";

type ListingSkeletonProps = {
  mode: ListingMode;
};

export default function ListingSkeleton({ mode }: ListingSkeletonProps) {
  return (
    <main className={`pet-listing pet-listing--${mode}`} aria-busy="true">
      <ListingBanner mode={mode} />

      <section className="pet-listing__body">
        <div className="pet-listing__container">
          <aside className="pet-filter" aria-hidden>
            <div className="pet-filter__panel">
              <div className="pet-skel pet-skel--title" />
              <div className="pet-skel pet-skel--input" />
              <div className="pet-skel pet-skel--line" />
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="pet-skel pet-skel--row" />
              ))}
            </div>
          </aside>

          <div className="pet-listing__list-wrap">
            <div className="pet-skel pet-skel--toolbar" />
            <div className="pet-listing__skeleton-grid">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="pet-listing__skeleton" />
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default function PetDetailSkeleton() {
  return (
    <main className="pet-detail" aria-busy="true">
      <div className="pet-detail__frame">
        <div className="pet-skel pet-skel--crumb" />
        <div className="pet-detail__layout">
          <div className="pet-skel pet-skel--photo" />
          <div className="pet-detail__info">
            <div className="pet-skel pet-skel--heading" />
            <div className="pet-skel pet-skel--line" />
            <div className="pet-skel pet-skel--line pet-skel--short" />
            <div className="pet-skel pet-skel--block" />
            <div className="pet-skel pet-skel--block" />
            <div className="pet-skel pet-skel--cta" />
          </div>
        </div>
      </div>
    </main>
  );
}

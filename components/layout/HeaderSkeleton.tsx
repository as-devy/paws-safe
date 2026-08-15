export default function HeaderSkeleton() {
  return (
    <header className="site-header site-header--skel" aria-hidden>
      <div className="site-header__inner">
        <div className="pet-skel pet-skel--logo" />
        <div className="hidden gap-2 lg:flex">
          <div className="pet-skel pet-skel--nav" />
          <div className="pet-skel pet-skel--nav" />
          <div className="pet-skel pet-skel--nav" />
        </div>
        <div className="pet-skel pet-skel--icon" />
      </div>
    </header>
  );
}

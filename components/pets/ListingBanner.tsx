import Link from "next/link";
import type { ListingMode } from "@/lib/pets";

const copy = {
  adoption: {
    heading: "Adopt A Pet",
    crumb: "Adopt",
  },
  foster: {
    heading: "Foster A Pet",
    crumb: "Foster",
  },
} as const;

type ListingBannerProps = {
  mode: ListingMode;
};

export default function ListingBanner({ mode }: ListingBannerProps) {
  const { heading, crumb } = copy[mode];

  return (
    <div className={`pet-listing__banner pet-listing__banner--${mode}`}>
      <div className="pet-listing__banner-content">
        <h1>{heading}</h1>
        <p className="pet-listing__breadcrumb">
          <Link href="/">Home</Link>
          <span aria-hidden> &gt; </span>
          <span>{crumb}</span>
        </p>
      </div>
    </div>
  );
}

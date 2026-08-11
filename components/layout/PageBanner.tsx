import Link from "next/link";

type PageBannerProps = {
  title: string;
  crumb: string;
  variant?: "default" | "post" | "contact" | "adoption" | "foster";
};

export default function PageBanner({
  title,
  crumb,
  variant = "default",
}: PageBannerProps) {
  return (
    <div className={`page-banner page-banner--${variant}`}>
      <div className="page-banner__content">
        <h1>{title}</h1>
        <p className="page-banner__breadcrumb">
          <Link href="/">Home</Link>
          <span aria-hidden> &gt; </span>
          <span>{crumb}</span>
        </p>
      </div>
    </div>
  );
}

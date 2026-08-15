import { Suspense } from "react";
import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import HeaderSkeleton from "@/components/layout/HeaderSkeleton";
import Footer from "@/components/layout/Footer";
import AdminDashboard from "@/components/admin/AdminDashboard";
import { fetchAdminDashboard, requireAdmin } from "@/lib/admin-server";
import "./admin.css";

export const metadata: Metadata = {
  title: "Admin | Paws Safe",
  description: "Review every user and pet listing on Paws Safe.",
  robots: { index: false, follow: false },
};

async function AdminContent() {
  const session = await requireAdmin();
  const data = await fetchAdminDashboard();
  return <AdminDashboard data={data} viewerId={session.user.id} />;
}

export default function AdminPage() {
  return (
    <>
      <Suspense fallback={<HeaderSkeleton />}>
        <Header activeHref="/admin" />
      </Suspense>
      <Suspense fallback={<AdminFallback />}>
        <AdminContent />
      </Suspense>
      <Footer />
    </>
  );
}

function AdminFallback() {
  return (
    <main className="admin admin--skel" aria-busy="true">
      <section className="admin__hero">
        <div className="admin__hero-inner">
          <div className="pet-skel pet-skel--crumb" />
          <div className="pet-skel pet-skel--heading" />
        </div>
      </section>
    </main>
  );
}

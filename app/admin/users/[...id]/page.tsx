import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AdminUserForm from "@/components/admin/AdminUserForm";
import { decodePetIdParam } from "@/lib/pets";
import { fetchAdminUser, requireAdmin } from "@/lib/admin-server";
import "../../admin.css";

type AdminEditUserPageProps = {
  params: Promise<{ id: string[] }>;
};

export const metadata: Metadata = {
  title: "Edit user | Admin | Paws Safe",
  robots: { index: false, follow: false },
};

export default async function AdminEditUserPage({ params }: AdminEditUserPageProps) {
  await requireAdmin();
  const { id } = await params;
  const user = await fetchAdminUser(decodePetIdParam(id));
  if (!user) notFound();

  return (
    <>
      <Header activeHref="/admin" />
      <main className="admin">
        <section className="admin__hero">
          <div className="admin__hero-inner">
            <p className="admin__kicker">Control center</p>
            <h1>Edit user</h1>
            <p className="admin__crumb">
              <Link href="/">Home</Link>
              <span aria-hidden> &gt; </span>
              <Link href="/admin">Admin</Link>
              <span aria-hidden> &gt; </span>
              {user.username || user.email || "User"}
            </p>
          </div>
        </section>
        <div className="admin__frame">
          <section className="admin-panel admin-panel--form">
            <AdminUserForm user={user} />
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}

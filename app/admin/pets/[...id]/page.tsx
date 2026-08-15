import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PostPetForm from "@/components/post-pet/PostPetForm";
import { decodePetIdParam } from "@/lib/pets";
import { fetchPetById } from "@/lib/pets-server";
import { requireAdmin } from "@/lib/admin-server";

type AdminEditPetPageProps = {
  params: Promise<{ id: string[] }>;
};

export const metadata: Metadata = {
  title: "Edit listing | Admin | Paws Safe",
  robots: { index: false, follow: false },
};

export default async function AdminEditPetPage({ params }: AdminEditPetPageProps) {
  await requireAdmin();
  const { id } = await params;
  const pet = await fetchPetById(decodePetIdParam(id));
  if (!pet) notFound();

  return (
    <>
      <Header activeHref="/admin" />
      <main className="pt-[40px]">
        <PostPetForm pet={pet} cancelHref="/admin" returnTo="/admin" />
      </main>
      <Footer />
    </>
  );
}

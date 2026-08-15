import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PostPetForm from "@/components/post-pet/PostPetForm";
import { auth } from "@/auth";
import { decodePetIdParam } from "@/lib/pets";
import { fetchPetById } from "@/lib/pets-server";

type EditPetPageProps = {
  params: Promise<{ id: string[] }>;
};

export const metadata: Metadata = {
  title: "Edit listing | Paws Safe",
  description: "Update the details of a pet you posted on Paws Safe.",
};

export default async function EditPetPage({ params }: EditPetPageProps) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/profile");
  }
  if (!session.user.isEmailVerified) {
    redirect("/verify-email");
  }

  const { id } = await params;
  const pet = await fetchPetById(decodePetIdParam(id));

  if (!pet || String(pet.owner_id) !== String(session.user.id)) {
    notFound();
  }

  return (
    <>
      <Header />
      <main className="pt-[40px]">
        <PostPetForm pet={pet} />
      </main>
      <Footer />
    </>
  );
}

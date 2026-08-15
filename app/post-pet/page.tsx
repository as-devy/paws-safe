import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PostPetForm from "@/components/post-pet/PostPetForm";

export const metadata: Metadata = {
  title: "Post a Pet | Paws Safe",
  description:
    "Post your pet for adoption or foster care. Share photos, medical history, and location so the right home can find them.",
};

export default function PostPetPage() {
  return (
    <>
      <Header />
<<<<<<< HEAD
      <main className="pt-[40px]">
=======
      <main className="pt-[90px]">
>>>>>>> 9fbe6272ae14926655cd6155816221b0eb2ae799
        <PostPetForm />
      </main>
      <Footer />
    </>
  );
}

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
      <main className="pt-[90px]">
        <PostPetForm />
      </main>
      <Footer />
    </>
  );
}

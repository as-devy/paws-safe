import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Header from "@/components/layout/Header";
import AuthShell from "@/components/auth/AuthShell";
import CompleteProfileForm from "@/components/auth/CompleteProfileForm";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Complete Profile | Paws Safe",
  description: "Add your phone and location to finish your Paws Safe account.",
};

export default async function CompleteProfilePage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const user = await prisma.users.findUnique({
    where: { id: session.user.id },
    select: { phone: true, country: true, city: true },
  });

  if (user?.phone && user?.country && user?.city) {
    redirect("/");
  }

  return (
    <>
      <Header />
      <main className="pt-[40px]">
        <AuthShell mode="complete">
          <CompleteProfileForm />
        </AuthShell>
      </main>
    </>
  );
}

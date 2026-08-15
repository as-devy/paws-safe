import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Header from "@/components/layout/Header";
import AuthShell from "@/components/auth/AuthShell";
import VerifyEmailForm from "@/components/auth/VerifyEmailForm";
import { auth } from "@/auth";

export const metadata: Metadata = {
  title: "Verify email | Paws Safe",
  description: "Confirm your email to send foster and adoption requests.",
};

export default async function VerifyEmailPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login?callbackUrl=/verify-email");
  }
  if (session.user.isEmailVerified) {
    redirect("/");
  }

  return (
    <>
      <Header />
      <main className="pt-[40px]">
        <AuthShell mode="verify">
          <VerifyEmailForm email={session.user.email} />
        </AuthShell>
      </main>
    </>
  );
}

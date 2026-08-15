import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import AuthShell from "@/components/auth/AuthShell";
import SignupForm from "@/components/auth/SignupForm";

export const metadata: Metadata = {
  title: "Sign Up | Paws Safe",
  description:
    "Create a Paws Safe account to adopt, foster, or post pets for rehoming.",
};

export default function SignupPage() {
  return (
    <>
      <Header />
<<<<<<< HEAD
      <main className="pt-[40px]">
=======
      <main className="pt-[90px]">
>>>>>>> 9fbe6272ae14926655cd6155816221b0eb2ae799
        <AuthShell mode="signup">
          <SignupForm />
        </AuthShell>
      </main>
    </>
  );
}

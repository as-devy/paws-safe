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
      <main className="pt-[90px]">
        <AuthShell mode="signup">
          <SignupForm />
        </AuthShell>
      </main>
    </>
  );
}

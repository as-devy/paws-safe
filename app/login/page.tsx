import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import AuthShell from "@/components/auth/AuthShell";
import LoginForm from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Log In | Paws Safe",
  description: "Log in to Paws Safe to adopt, foster, or manage your pets.",
};

export default function LoginPage() {
  return (
    <>
      <Header />
      <main className="pt-[90px]">
        <AuthShell mode="login">
          <LoginForm />
        </AuthShell>
      </main>
    </>
  );
}

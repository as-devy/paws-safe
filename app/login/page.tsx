import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import AuthShell from "@/components/auth/AuthShell";
import LoginForm from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Log In | Paws Safe",
  description: "Log in to Paws Safe to adopt, foster, or manage your pets.",
};

type LoginPageProps = {
  searchParams: Promise<{ callbackUrl?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { callbackUrl } = await searchParams;

  return (
    <>
      <Header />
      <main className="pt-[40px]">
        <AuthShell mode="login">
          <LoginForm callbackUrl={callbackUrl} />
        </AuthShell>
      </main>
    </>
  );
}

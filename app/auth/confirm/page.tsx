import { Suspense } from "react";
import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import AuthShell from "@/components/auth/AuthShell";
import ConfirmEmailClient from "@/components/auth/ConfirmEmailClient";

export const metadata: Metadata = {
  title: "Confirm email | Paws Safe",
  description: "Confirm your Paws Safe email address.",
};

export default function ConfirmEmailPage() {
  return (
    <>
      <Header />
      <main className="pt-[40px]">
        <AuthShell mode="verify">
          <Suspense fallback={<div className="auth-form">Confirming your email…</div>}>
            <ConfirmEmailClient />
          </Suspense>
        </AuthShell>
      </main>
    </>
  );
}

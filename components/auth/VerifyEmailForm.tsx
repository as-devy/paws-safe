"use client";

import { useState } from "react";
import { Mail, RefreshCw } from "lucide-react";
import { signOut } from "next-auth/react";
import { resendVerificationEmail } from "@/lib/actions";

export default function VerifyEmailForm({ email }: { email?: string | null }) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  async function onResend() {
    setStatus("sending");
    setMessage(null);
    const result = await resendVerificationEmail();
    if (result.ok) {
      setStatus("sent");
      setMessage("A new verification link is on its way.");
      return;
    }
    setStatus("error");
    setMessage(result.message || "Could not resend the email.");
  }

  return (
    <div className="auth-form verify-card">
      <div className="auth-form__head">
        <span className="verify-card__icon" aria-hidden>
          <Mail className="h-6 w-6" />
        </span>
        <p className="auth-form__kicker">One more step</p>
        <h2>Verify your email</h2>
        <p>
          We sent a confirmation link
          {email ? (
            <>
              {" "}
              to <strong>{email}</strong>
            </>
          ) : null}
          . Open it to unlock your profile, plus foster and adoption requests.
        </p>
      </div>

      {message ? (
        <p
          className={`mt-2 text-sm ${status === "error" ? "text-red-500" : "text-emerald-600"}`}
          role="status"
        >
          {message}
        </p>
      ) : null}

      <button
        type="button"
        className="auth-submit"
        onClick={() => void onResend()}
        disabled={status === "sending"}
      >
        <RefreshCw className="h-4 w-4" aria-hidden />
        {status === "sending" ? "Sending…" : "Resend link"}
      </button>

      <p className="auth-switch">
        Wrong email?{" "}
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/signup" })}
        >
          Use a different email
        </button>
      </p>
    </div>
  );
}

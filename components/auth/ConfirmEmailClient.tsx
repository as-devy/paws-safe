"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LoaderCircle, MailCheck, MailX } from "lucide-react";
import {
  confirmEmailCode,
  confirmEmailOtp,
  confirmEmailToken,
} from "@/lib/actions";

type Status = "working" | "ok" | "error";

export default function ConfirmEmailClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<Status>("working");
  const [message, setMessage] = useState("Confirming your email…");

  useEffect(() => {
    let cancelled = false;

    async function confirm() {
      const errorParam = searchParams.get("error_description") || searchParams.get("error");
      if (errorParam) {
        if (!cancelled) {
          setStatus("error");
          setMessage(errorParam);
        }
        return;
      }

      const tokenHash = searchParams.get("token_hash");
      const type = searchParams.get("type") ?? "email";
      const code = searchParams.get("code");
      const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
      const accessToken = hash.get("access_token");

      let result: { ok: boolean; message?: string } = {
        ok: false,
        message: "This verification link is missing details.",
      };

      if (tokenHash) {
        result = await confirmEmailOtp(tokenHash, type);
      } else if (code) {
        result = await confirmEmailCode(code);
      } else if (accessToken) {
        result = await confirmEmailToken(accessToken);
      }

      if (cancelled) return;

      if (result.ok) {
        setStatus("ok");
        setMessage("Your email is verified. You can now open your profile.");
        window.setTimeout(() => router.replace("/profile"), 1600);
        router.refresh();
        return;
      }

      setStatus("error");
      setMessage(result.message || "This verification link is invalid or expired.");
    }

    void confirm();
    return () => {
      cancelled = true;
    };
  }, [router, searchParams]);

  return (
    <div className="auth-form verify-card">
      <div className="auth-form__head">
        <span className="verify-card__icon" aria-hidden>
          {status === "working" ? (
            <LoaderCircle className="h-6 w-6 animate-spin" />
          ) : status === "ok" ? (
            <MailCheck className="h-6 w-6" />
          ) : (
            <MailX className="h-6 w-6" />
          )}
        </span>
        <h2>
          {status === "working"
            ? "Verifying email"
            : status === "ok"
              ? "Email verified"
              : "Could not verify"}
        </h2>
        <p>{message}</p>
      </div>
    </div>
  );
}

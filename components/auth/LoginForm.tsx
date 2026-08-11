"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, LoaderCircle, Lock, Mail } from "lucide-react";
import { EMAIL_PATTERN, getCookie, setUserIdCookie } from "@/lib/auth";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (getCookie("UserId")) {
      router.replace("/");
    }
  }, [router]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setEmailError("");
    setPasswordError("");

    let valid = true;
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail) {
      setEmailError("Please fill out this field.");
      valid = false;
    } else if (!EMAIL_PATTERN.test(trimmedEmail)) {
      setEmailError("Please enter a valid email.");
      valid = false;
    }

    if (!trimmedPassword) {
      setPasswordError("Please fill out this field.");
      valid = false;
    }

    if (!valid) return;

    try {
      setBusy(true);
      const res = await fetch("https://pawssafe.ddns.net/loginUser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: trimmedEmail,
          password: trimmedPassword,
        }),
      });
      const data = await res.json();

      if (data.userId) {
        setUserIdCookie(data.userId);
        router.push("/");
        return;
      }

      setEmailError("Wrong email or password");
      setPasswordError("Wrong email or password");
    } catch (err) {
      console.error(err);
      setEmailError("Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="auth-form" onSubmit={onSubmit} noValidate>
      <div className="auth-form__head">
        <p className="auth-form__kicker">Member access</p>
        <h2>Log in to continue</h2>
        <p>Your saved pets, requests, and messages are waiting.</p>
      </div>

      <div className="auth-field">
        <label htmlFor="login-email">
          <span className="auth-field__icon">
            <Mail className="h-3.5 w-3.5" />
          </span>
          Email
        </label>
        <input
          id="login-email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {emailError && <span className="auth-error">{emailError}</span>}
      </div>

      <div className="auth-field">
        <label htmlFor="login-password">
          <span className="auth-field__icon">
            <Lock className="h-3.5 w-3.5" />
          </span>
          Password
        </label>
        <div className="auth-password">
          <input
            id="login-password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="Your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            className="auth-password__toggle"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
        {passwordError && <span className="auth-error">{passwordError}</span>}
      </div>

      <button type="submit" className="auth-submit" disabled={busy}>
        {busy ? (
          <>
            <LoaderCircle className="h-4 w-4 animate-spin" />
            Signing in…
          </>
        ) : (
          "Enter Paws Safe"
        )}
      </button>

      <p className="auth-switch">
        New to the community? <Link href="/signup">Create an account</Link>
      </p>
    </form>
  );
}

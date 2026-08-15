"use client";

import Link from "next/link";
<<<<<<< HEAD
import { useActionState, useState } from "react";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import GoogleAuthButton from "@/components/auth/GoogleAuthButton";
import { authenticate, type LoginState } from "@/lib/actions";

type LoginFormProps = {
  callbackUrl?: string;
};

export default function LoginForm({ callbackUrl = "/" }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const initialState: LoginState = { message: null, errors: {} };
  const [state, formAction] = useActionState(authenticate, initialState);
  const values = state?.values;
  const errors = state?.errors;
  const message = state?.message;

  const formKey = values ? JSON.stringify(values) : "login-initial";
  const next =
    callbackUrl.startsWith("/") && !callbackUrl.startsWith("//")
      ? callbackUrl
      : "/";

  return (
    <form
      key={formKey}
      className="auth-form"
      action={formAction}
      noValidate
    >
      <input type="hidden" name="callbackUrl" value={next} />
=======
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
>>>>>>> 9fbe6272ae14926655cd6155816221b0eb2ae799
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
<<<<<<< HEAD
          Email <b>*</b>
        </label>
        <input
          id="login-email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          aria-describedby="email-error"
          defaultValue={values?.email ?? ""}
        />
        <div id="email-error" aria-live="polite" aria-atomic="true">
          {errors?.email?.map((error) => (
            <p className="mt-2 text-sm text-red-500" key={error}>
              {error}
            </p>
          ))}
        </div>
=======
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
>>>>>>> 9fbe6272ae14926655cd6155816221b0eb2ae799
      </div>

      <div className="auth-field">
        <label htmlFor="login-password">
          <span className="auth-field__icon">
            <Lock className="h-3.5 w-3.5" />
          </span>
<<<<<<< HEAD
          Password <b>*</b>
=======
          Password
>>>>>>> 9fbe6272ae14926655cd6155816221b0eb2ae799
        </label>
        <div className="auth-password">
          <input
            id="login-password"
<<<<<<< HEAD
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="Your password"
            aria-describedby="password-error"
            defaultValue={values?.password ?? ""}
=======
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="Your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
>>>>>>> 9fbe6272ae14926655cd6155816221b0eb2ae799
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
<<<<<<< HEAD
        <div id="password-error" aria-live="polite" aria-atomic="true">
          {errors?.password?.map((error) => (
            <p className="mt-2 text-sm text-red-500" key={error}>
              {error}
            </p>
          ))}
        </div>
      </div>

      {message && (
        <p className="mt-2 text-sm text-red-500" role="alert">
          {message}
        </p>
      )}

      <button type="submit" className="auth-submit">
        Enter Paws Safe
      </button>

      <GoogleAuthButton label="Continue with Google" />

=======
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

>>>>>>> 9fbe6272ae14926655cd6155816221b0eb2ae799
      <p className="auth-switch">
        New to the community? <Link href="/signup">Create an account</Link>
      </p>
    </form>
  );
}

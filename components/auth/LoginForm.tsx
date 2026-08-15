"use client";

import Link from "next/link";
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
      </div>

      <div className="auth-field">
        <label htmlFor="login-password">
          <span className="auth-field__icon">
            <Lock className="h-3.5 w-3.5" />
          </span>
          Password <b>*</b>
        </label>
        <div className="auth-password">
          <input
            id="login-password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="Your password"
            aria-describedby="password-error"
            defaultValue={values?.password ?? ""}
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

      <p className="auth-switch">
        New to the community? <Link href="/signup">Create an account</Link>
      </p>
    </form>
  );
}

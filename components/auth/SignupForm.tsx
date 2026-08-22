"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { Eye, EyeOff, Lock, Mail, MapPin, Phone, User } from "lucide-react";
import GoogleAuthButton from "@/components/auth/GoogleAuthButton";
import { COUNTRIES } from "@/lib/countries";
import { signUp, State } from "@/lib/actions";
import { SelectField, SelectItem } from "@/components/ui/SelectField";

const countryCodes = [
  { value: "+20", label: "+20 🇪🇬" },
  { value: "+1", label: "+1 🇺🇸" },
  { value: "+44", label: "+44 🇬🇧" },
  { value: "+33", label: "+33 🇫🇷" },
  { value: "+49", label: "+49 🇩🇪" },
  { value: "+91", label: "+91 🇮🇳" },
];

export default function SignupForm() {
  const [showPassword, setShowPassword] = useState(false);

  const initialState: State = { message: null, errors: {} };
  const [state, formAction] = useActionState(signUp, initialState);
  const values = state?.values;
  const errors = state?.errors;
  const message = state?.message;

  const formKey = values ? JSON.stringify(values) : "signup-initial";

  return (
    <form
      key={formKey}
      className="auth-form"
      noValidate
      action={formAction}
    >
      <div className="auth-form__head">
        <p className="auth-form__kicker">Join the community</p>
        <h2>Start helping pets today</h2>
        <p>One account for adopting, fostering, and rehoming with care.</p>
      </div>

      <div className="auth-field">
        <label htmlFor="signup-name">
          <span className="auth-field__icon">
            <User className="h-3.5 w-3.5" />
          </span>
          Username <b>*</b>
        </label>
        <input
          id="signup-name"
          name="name"
          type="text"
          autoComplete="username"
          placeholder="Choose a username"
          aria-describedby="name-error"
          defaultValue={values?.name ?? ""}
        />
        <div id="name-error" aria-live="polite" aria-atomic="true">
          {errors?.name?.map((error: string) => (
            <p className="mt-2 text-sm text-red-500" key={error}>
              {error}
            </p>
          ))}
        </div>
      </div>

      <div className="auth-field">
        <label htmlFor="signup-email">
          <span className="auth-field__icon">
            <Mail className="h-3.5 w-3.5" />
          </span>
          Email <b>*</b>
        </label>
        <input
          id="signup-email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          aria-describedby="email-error"
          defaultValue={values?.email ?? ""}
        />
        <div id="email-error" aria-live="polite" aria-atomic="true">
          {errors?.email?.map((error: string) => (
            <p className="mt-2 text-sm text-red-500" key={error}>
              {error}
            </p>
          ))}
        </div>
      </div>

      <div className="auth-field">
        <label htmlFor="signup-phone">
          <span className="auth-field__icon">
            <Phone className="h-3.5 w-3.5" />
          </span>
          Phone <b>*</b>
        </label>
        <div className="auth-phone">
          <SelectField
            aria-label="Country code"
            name="countryCode"
            defaultValue={values?.countryCode ?? "+20"}
          >
            {countryCodes.map((code) => (
              <SelectItem key={code.value} value={code.value}>
                {code.label}
              </SelectItem>
            ))}
          </SelectField>
          <input
            id="signup-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder="Phone number"
            aria-describedby="phone-error"
            defaultValue={values?.phone ?? ""}
          />
        </div>
        <div id="phone-error" aria-live="polite" aria-atomic="true">
          {errors?.phone?.map((error: string) => (
            <p className="mt-2 text-sm text-red-500" key={error}>
              {error}
            </p>
          ))}
        </div>
      </div>

      <div className="auth-field">
        <label>
          <span className="auth-field__icon">
            <MapPin className="h-3.5 w-3.5" />
          </span>
          Location <b>*</b>
        </label>
        <div className="auth-location">
          <div>
            <SelectField
              id="signup-country"
              name="country"
              aria-label="Country"
              aria-describedby="country-error"
              defaultValue={values?.country ?? ""}
              placeholder="Country"
            >
              <SelectItem value="" disabled>Country</SelectItem>
              {COUNTRIES.map((country) => (
                <SelectItem key={country} value={country}>
                  {country}
                </SelectItem>
              ))}
            </SelectField>
            <div id="country-error" aria-live="polite" aria-atomic="true">
              {errors?.country?.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
            </div>
          </div>
          <div>
            <input
              id="signup-city"
              name="city"
              type="text"
              placeholder="City"
              aria-describedby="city-error"
              defaultValue={values?.city ?? ""}
            />
            <div id="city-error" aria-live="polite" aria-atomic="true">
              {errors?.city?.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="auth-field">
        <label htmlFor="signup-password">
          <span className="auth-field__icon">
            <Lock className="h-3.5 w-3.5" />
          </span>
          Password <b>*</b>
        </label>
        <div className="auth-password">
          <input
            id="signup-password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder="Create a password"
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
          {errors?.password?.map((error: string) => (
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
        Join Paws Safe
      </button>

      <GoogleAuthButton label="Sign up with Google" />

      <p className="auth-switch">
        Already helping pets? <Link href="/login">Log in</Link>
      </p>
    </form>
  );
}

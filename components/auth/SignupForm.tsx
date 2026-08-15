"use client";

import Link from "next/link";
<<<<<<< HEAD
import { useActionState, useState } from "react";
import { Eye, EyeOff, Lock, Mail, MapPin, Phone, User } from "lucide-react";
import GoogleAuthButton from "@/components/auth/GoogleAuthButton";
import { COUNTRIES } from "@/lib/countries";
import { signUp, State } from "@/lib/actions";
=======
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  LoaderCircle,
  Lock,
  Mail,
  MapPin,
  Phone,
  User,
} from "lucide-react";
import {
  EMAIL_PATTERN,
  PHONE_PATTERN,
  getCookie,
  setUserIdCookie,
} from "@/lib/auth";
>>>>>>> 9fbe6272ae14926655cd6155816221b0eb2ae799

const countryCodes = [
  { value: "+20", label: "+20 🇪🇬" },
  { value: "+1", label: "+1 🇺🇸" },
  { value: "+44", label: "+44 🇬🇧" },
  { value: "+33", label: "+33 🇫🇷" },
  { value: "+49", label: "+49 🇩🇪" },
  { value: "+91", label: "+91 🇮🇳" },
];

<<<<<<< HEAD
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
=======
type Errors = {
  name?: string;
  email?: string;
  phone?: string;
  country?: string;
  city?: string;
  password?: string;
  form?: string;
};

export default function SignupForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [countryCode, setCountryCode] = useState("+20");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (getCookie("UserId")) {
      router.replace("/");
    }
  }, [router]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const next: Errors = {};
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedPhone = phone.trim();
    const trimmedCountry = country.trim();
    const trimmedCity = city.trim();
    const trimmedPassword = password.trim();

    if (!trimmedName) next.name = "Please fill out this field.";
    if (!trimmedEmail) next.email = "Please fill out this field.";
    else if (!EMAIL_PATTERN.test(trimmedEmail)) {
      next.email = "Please enter a valid email.";
    }
    if (!trimmedPhone) next.phone = "Please fill out this field.";
    else if (!PHONE_PATTERN.test(trimmedPhone)) {
      next.phone = "Please enter a valid phone number.";
    }
    if (!trimmedCountry) next.country = "Please fill out this field.";
    if (!trimmedCity) next.city = "Please fill out this field.";
    if (!trimmedPassword) next.password = "Please fill out this field.";

    setErrors(next);
    if (Object.keys(next).length) return;

    try {
      setBusy(true);
      const payload = {
        name: trimmedName,
        email: trimmedEmail,
        phone: `${countryCode}${trimmedPhone}`,
        country: trimmedCountry,
        city: trimmedCity,
        password: trimmedPassword,
      };

      const res = await fetch("https://pawssafe.ddns.net/addUser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (data.userId) {
        setUserIdCookie(data.userId);
        router.push("/");
        return;
      }

      setErrors({ form: "Could not create account. Please try again." });
    } catch (err) {
      console.error(err);
      setErrors({ form: "Something went wrong. Please try again." });
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="auth-form" onSubmit={onSubmit} noValidate>
>>>>>>> 9fbe6272ae14926655cd6155816221b0eb2ae799
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
<<<<<<< HEAD
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
=======
          type="text"
          autoComplete="username"
          placeholder="Choose a username"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        {errors.name && <span className="auth-error">{errors.name}</span>}
>>>>>>> 9fbe6272ae14926655cd6155816221b0eb2ae799
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
<<<<<<< HEAD
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
=======
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {errors.email && <span className="auth-error">{errors.email}</span>}
>>>>>>> 9fbe6272ae14926655cd6155816221b0eb2ae799
      </div>

      <div className="auth-field">
        <label htmlFor="signup-phone">
          <span className="auth-field__icon">
            <Phone className="h-3.5 w-3.5" />
          </span>
          Phone <b>*</b>
        </label>
        <div className="auth-phone">
          <select
            aria-label="Country code"
<<<<<<< HEAD
            name="countryCode"
            defaultValue={values?.countryCode ?? "+20"}
=======
            value={countryCode}
            onChange={(e) => setCountryCode(e.target.value)}
>>>>>>> 9fbe6272ae14926655cd6155816221b0eb2ae799
          >
            {countryCodes.map((code) => (
              <option key={code.value} value={code.value}>
                {code.label}
              </option>
            ))}
          </select>
          <input
            id="signup-phone"
<<<<<<< HEAD
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
=======
            type="tel"
            autoComplete="tel"
            placeholder="Phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        {errors.phone && <span className="auth-error">{errors.phone}</span>}
>>>>>>> 9fbe6272ae14926655cd6155816221b0eb2ae799
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
<<<<<<< HEAD
            <select
              id="signup-country"
              name="country"
              aria-label="Country"
              aria-describedby="country-error"
              defaultValue={values?.country ?? ""}
            >
              <option value="" disabled>
                Country
              </option>
              {COUNTRIES.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
            <div id="country-error" aria-live="polite" aria-atomic="true">
              {errors?.country?.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
            </div>
=======
            <input
              id="signup-country"
              type="text"
              placeholder="Country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            />
            {errors.country && (
              <span className="auth-error">{errors.country}</span>
            )}
>>>>>>> 9fbe6272ae14926655cd6155816221b0eb2ae799
          </div>
          <div>
            <input
              id="signup-city"
<<<<<<< HEAD
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
=======
              type="text"
              placeholder="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
            {errors.city && <span className="auth-error">{errors.city}</span>}
>>>>>>> 9fbe6272ae14926655cd6155816221b0eb2ae799
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
<<<<<<< HEAD
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder="Create a password"
            aria-describedby="password-error"
            defaultValue={values?.password ?? ""}
=======
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder="Create a password"
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

=======
        {errors.password && (
          <span className="auth-error">{errors.password}</span>
        )}
      </div>

      {errors.form && <span className="auth-error">{errors.form}</span>}

      <button type="submit" className="auth-submit" disabled={busy}>
        {busy ? (
          <>
            <LoaderCircle className="h-4 w-4 animate-spin" />
            Creating account…
          </>
        ) : (
          "Join Paws Safe"
        )}
      </button>

>>>>>>> 9fbe6272ae14926655cd6155816221b0eb2ae799
      <p className="auth-switch">
        Already helping pets? <Link href="/login">Log in</Link>
      </p>
    </form>
  );
}

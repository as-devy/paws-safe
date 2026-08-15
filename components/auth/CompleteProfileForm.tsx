"use client";

import { useActionState } from "react";
import { MapPin, Phone } from "lucide-react";
import { COUNTRIES } from "@/lib/countries";
import {
  completeProfile,
  type CompleteProfileState,
} from "@/lib/actions";

const countryCodes = [
  { value: "+20", label: "+20 🇪🇬" },
  { value: "+1", label: "+1 🇺🇸" },
  { value: "+44", label: "+44 🇬🇧" },
  { value: "+33", label: "+33 🇫🇷" },
  { value: "+49", label: "+49 🇩🇪" },
  { value: "+91", label: "+91 🇮🇳" },
];

export default function CompleteProfileForm() {
  const initialState: CompleteProfileState = { message: null, errors: {} };
  const [state, formAction] = useActionState(completeProfile, initialState);

  const formKey = state.values
    ? JSON.stringify(state.values)
    : "complete-profile-initial";

  return (
    <form
      key={formKey}
      className="auth-form"
      noValidate
      action={formAction}
    >
      <div className="auth-form__head">
        <p className="auth-form__kicker">Almost there</p>
        <h2>Add how to reach you</h2>
        <p>Phone and location help keep adopt, foster, and rehome requests trusted.</p>
      </div>

      <div className="auth-field">
        <label htmlFor="complete-phone">
          <span className="auth-field__icon">
            <Phone className="h-3.5 w-3.5" />
          </span>
          Phone <b>*</b>
        </label>
        <div className="auth-phone">
          <select
            aria-label="Country code"
            name="countryCode"
            defaultValue={state.values?.countryCode ?? "+20"}
          >
            {countryCodes.map((code) => (
              <option key={code.value} value={code.value}>
                {code.label}
              </option>
            ))}
          </select>
          <input
            id="complete-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder="Phone number"
            aria-describedby="phone-error"
            defaultValue={state.values?.phone ?? ""}
          />
        </div>
        <div id="phone-error" aria-live="polite" aria-atomic="true">
          {state.errors?.phone?.map((error) => (
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
            <select
              id="complete-country"
              name="country"
              aria-label="Country"
              aria-describedby="country-error"
              defaultValue={state.values?.country ?? ""}
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
              {state.errors?.country?.map((error) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
            </div>
          </div>
          <div>
            <input
              id="complete-city"
              name="city"
              type="text"
              placeholder="City"
              aria-describedby="city-error"
              defaultValue={state.values?.city ?? ""}
            />
            <div id="city-error" aria-live="polite" aria-atomic="true">
              {state.errors?.city?.map((error) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>

      {state.message && (
        <p className="mt-2 text-sm text-red-500" role="alert">
          {state.message}
        </p>
      )}

      <button type="submit" className="auth-submit">
        Save and continue
      </button>
    </form>
  );
}

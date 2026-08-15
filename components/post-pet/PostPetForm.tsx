"use client";

import Link from "next/link";
import { startTransition, useActionState, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Check,
  HeartHandshake,
  ImagePlus,
  MapPin,
  PawPrint,
  Siren,
  Stethoscope,
} from "lucide-react";
import { COUNTRIES } from "@/lib/countries";
import { postPet, updatePet, type CreatePetState } from "@/lib/actions";
import { CATEGORY_FILTERS, normalizeCategory, type Pet } from "@/lib/pets";
import CategoryIcon from "@/components/pets/CategoryIcon";

type Step = 0 | 1 | 2;

type FormState = {
  listingType: "" | "adoption" | "foster";
  name: string;
  age: string;
  gender: "" | "male" | "female";
  category: "" | "dog" | "cat" | "rabbit" | "bird" | "fish" | "other";
  country: string;
  streetAddress: string;
  city: string;
  postCode: string;
  vaccines: string;
  health: string;
  diet: string;
  behavior: string;
  description: string;
};

const STEPS = [
  { id: 0, label: "Basics", icon: PawPrint },
  { id: 1, label: "Location", icon: MapPin },
  { id: 2, label: "Care & story", icon: Stethoscope },
] as const;

const CATEGORIES = CATEGORY_FILTERS.filter((item) => item.key !== "all").map(
  (item) => ({
    key: item.key as
      | "dog"
      | "cat"
      | "rabbit"
      | "bird"
      | "fish"
      | "other",
    label: item.label.replace(/s$/, ""),
    color: item.color,
  }),
);

const initialForm: FormState = {
  listingType: "",
  name: "",
  age: "",
  gender: "",
  category: "",
  country: "egypt",
  streetAddress: "",
  city: "",
  postCode: "",
  vaccines: "",
  health: "",
  diet: "",
  behavior: "",
  description: "",
};

const STEP_ERROR_KEYS: Record<Step, Array<keyof NonNullable<CreatePetState["errors"]>>> = {
  0: ["img", "listingType", "name", "age", "gender", "category"],
  1: ["country", "streetAddress", "city", "postCode"],
  2: ["description", "vaccines", "health", "diet", "behavior", "emergency"],
};

function FieldErrors({ messages }: { messages?: string[] }) {
  if (!messages?.length) return null;
  return (
    <div aria-live="polite">
      {messages.map((error) => (
        <p className="post-field-error" key={error}>
          {error}
        </p>
      ))}
    </div>
  );
}

function firstErrorStep(errors?: CreatePetState["errors"]): Step | null {
  if (!errors) return null;
  for (const step of [0, 1, 2] as const) {
    if (STEP_ERROR_KEYS[step].some((key) => errors[key]?.length)) {
      return step;
    }
  }
  return null;
}

function isFilled(value: string) {
  return value.trim().length > 0;
}

function isValidAge(value: string) {
  if (!isFilled(value)) return false;
  const age = Number(value);
  return Number.isFinite(age) && age >= 0 && age <= 99.9;
}

function isStepComplete(
  step: Step,
  form: FormState,
  preview: string | null,
) {
  if (step === 0) {
    return Boolean(
      preview &&
        form.listingType &&
        isFilled(form.name) &&
        isValidAge(form.age) &&
        form.gender &&
        form.category,
    );
  }
  if (step === 1) {
    return (
      isFilled(form.country) &&
      isFilled(form.streetAddress) &&
      isFilled(form.city) &&
      isFilled(form.postCode)
    );
  }
  return isFilled(form.description);
}

function shortenFileName(filename: string) {
  const lastDotIndex = filename.lastIndexOf(".");
  if (lastDotIndex === -1) {
    return filename.length > 22 ? `${filename.slice(0, 22)}...` : filename;
  }
  const namePart = filename.slice(0, lastDotIndex);
  const extension = filename.slice(lastDotIndex);
  return namePart.length > 18
    ? `${namePart.slice(0, 18)}...${extension}`
    : filename;
}

const CATEGORY_KEYS = [
  "dog",
  "cat",
  "rabbit",
  "bird",
  "fish",
  "other",
] as const;

function petToForm(pet?: Pet): FormState {
  if (!pet) return initialForm;

  const gender = pet.gender?.toLowerCase();
  const category = normalizeCategory(pet.category);
  const knownCategory = CATEGORY_KEYS.includes(
    category as (typeof CATEGORY_KEYS)[number],
  )
    ? (category as FormState["category"])
    : "";

  return {
    listingType: pet.status === "foster" ? "foster" : "adoption",
    name: pet.name,
    age: pet.age === "" || pet.age == null ? "" : String(pet.age),
    gender: gender === "male" || gender === "female" ? gender : "",
    category: knownCategory,
    country: (pet.country || "egypt").toLowerCase(),
    streetAddress: pet.street_address ?? pet.streetAddress ?? "",
    city: pet.city ?? "",
    postCode: pet.post_code ?? pet.postCode ?? "",
    vaccines: pet.vaccines_prevention ?? "",
    health: pet.health_history ?? "",
    diet: pet.diet ?? "",
    behavior: pet.behavior ?? "",
    description: pet.description ?? "",
  };
}

export default function PostPetForm({
  pet,
  cancelHref = "/profile",
  returnTo,
}: {
  pet?: Pet;
  cancelHref?: string;
  returnTo?: string;
}) {
  const isEdit = Boolean(pet);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState<Step>(0);
  const [form, setForm] = useState<FormState>(() => petToForm(pet));
  const [preview, setPreview] = useState<string | null>(pet?.img || null);
  const [fileLabel, setFileLabel] = useState(
    pet?.img ? "Current photo" : "Add a clear photo",
  );
  const [emergency, setEmergency] = useState(Boolean(pet?.emergency));
  const initialState: CreatePetState = { message: null };
  const [state, formAction, pending] = useActionState(
    isEdit ? updatePet : postPet,
    initialState,
  );
  const errors = state?.errors;
  const message = state?.message;

  const progress = useMemo(() => ((step + 1) / STEPS.length) * 100, [step]);
  const canContinue = isStepComplete(step, form, preview);

  useEffect(() => {
    const nextStep = firstErrorStep(errors);
    if (nextStep != null) setStep(nextStep);
  }, [errors]);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function onPickImage(file?: File | null) {
    if (!file) {
      setFileLabel("No file selected");
      return;
    }
    setFileLabel(shortenFileName(file.name));
    const reader = new FileReader();
    reader.onload = () => {
      setPreview(String(reader.result ?? ""));
    };
    reader.readAsDataURL(file);
  }

  function goNext() {
    if (!isStepComplete(step, form, preview)) return;
    setStep((s) => Math.min(2, s + 1) as Step);
  }

  function goBack() {
    setStep((s) => Math.max(0, s - 1) as Step);
  }

  function handlePost() {
    startTransition(() => {
      formAction({
        ...form,
        petId: pet?.id,
        img: preview ?? "",
        emergency,
        returnTo,
      });
    });
  }

  return (
    <section className="post-stage">
      <div className="post-stage__glow" aria-hidden />
      <div className="post-stage__pattern" aria-hidden />

      <div className="post-stage__frame">
        <header className={`post-stage__intro${isEdit ? " post-stage__intro--wide" : ""}`}>
          <p className="post-stage__kicker">
            {isEdit ? "Keep their story current" : "Find them a home"}
          </p>
          <h1>
            {isEdit
              ? `Edit ${pet?.name ?? "listing"}`
              : "Post your pet in a few easy steps"}
          </h1>
          <p>
            {isEdit
              ? "Update the photo, basics, or care notes. Changes go live as soon as you save."
              : "Share a photo, basics, and care notes so the right family can respond with confidence."}
          </p>
          <p className="post-stage__crumb">
            <Link href="/">Home</Link> <span aria-hidden>&gt;</span>{" "}
            {isEdit ? (
              <>
                <Link href={cancelHref}>{cancelHref === "/admin" ? "Admin" : "Profile"}</Link> <span aria-hidden>&gt;</span>{" "}
                Edit
              </>
            ) : (
              "Post Pet"
            )}
          </p>
        </header>

        <form className="post-wizard">
          <div className="post-wizard__progress" aria-hidden>
            <span style={{ width: `${progress}%` }} />
          </div>

          <ol className="post-wizard__steps">
            {STEPS.map(({ id, label, icon: Icon }) => {
              const done = step > id;
              const active = step === id;
              return (
                <li
                  key={label}
                  className={
                    done ? "is-done" : active ? "is-active" : undefined
                  }
                >
                  <span className="post-wizard__step-icon">
                    {done ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                  </span>
                  <span className="post-wizard__step-label">{label}</span>
                </li>
              );
            })}
          </ol>

          <div className="post-wizard__body">
            {step === 0 && (
              <div className="post-step">
                <div className="post-step__head">
                  <h2>Pet basics</h2>
                  <p>Start with a photo and the essentials.</p>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) => onPickImage(e.target.files?.[0])}
                />
                <button
                  type="button"
                  className={`post-dropzone${preview ? " has-image" : ""}`}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {preview ? (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={preview} alt="Pet preview" />
                      <span className="post-dropzone__overlay">
                        <ImagePlus className="h-5 w-5" />
                        Change photo
                      </span>
                    </>
                  ) : (
                    <>
                      <ImagePlus className="h-8 w-8" />
                      <strong>Upload pet photo</strong>
                      <span>JPG or PNG works best</span>
                    </>
                  )}
                </button>
                <p className="post-dropzone__meta">{fileLabel}</p>
                <FieldErrors messages={errors?.img} />

                <p className="post-label">I am posting for</p>
                <div className="post-type-grid">
                  <button
                    type="button"
                    className={`post-type${form.listingType === "adoption" ? " is-active" : ""}`}
                    onClick={() => update("listingType", "adoption")}
                  >
                    <HeartHandshake className="h-5 w-5" />
                    <strong>Adoption</strong>
                    <span>Looking for a forever home</span>
                  </button>
                  <button
                    type="button"
                    className={`post-type${form.listingType === "foster" ? " is-active" : ""}`}
                    onClick={() => update("listingType", "foster")}
                  >
                    <PawPrint className="h-5 w-5" />
                    <strong>Foster</strong>
                    <span>Needs temporary care</span>
                  </button>
                </div>
                <FieldErrors messages={errors?.listingType} />

                <div className="post-grid-2">
                  <div>
                    <label className="post-label" htmlFor="petName">
                      Pet name
                    </label>
                    <input
                      id="petName"
                      className="post-input"
                      value={form.name}
                      onChange={(e) => update("name", e.target.value)}
                      placeholder="e.g. Luna"
                    />
                    <FieldErrors messages={errors?.name} />
                  </div>
                  <div>
                    <label className="post-label" htmlFor="petAge">
                      Age (years)
                    </label>
                    <input
                      id="petAge"
                      type="number"
                      min={0}
                      step={0.1}
                      className="post-input"
                      value={form.age}
                      onChange={(e) => update("age", e.target.value)}
                      placeholder="e.g. 2"
                    />
                    <FieldErrors messages={errors?.age} />
                  </div>
                </div>

                <p className="post-label">Gender</p>
                <div className="post-chip-row">
                  {(["male", "female"] as const).map((g) => (
                    <button
                      key={g}
                      type="button"
                      className={`post-chip${form.gender === g ? " is-active" : ""}`}
                      onClick={() => update("gender", g)}
                    >
                      {g === "male" ? "Male" : "Female"}
                    </button>
                  ))}
                </div>
                <FieldErrors messages={errors?.gender} />

                <p className="post-label">Category</p>
                <div className="post-category-grid">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.key}
                      type="button"
                      className={`post-category${form.category === cat.key ? " is-active" : ""}`}
                      style={{ "--cat-accent": cat.color } as CSSProperties}
                      onClick={() => update("category", cat.key)}
                    >
                      <CategoryIcon
                        category={cat.key}
                        className="h-8 w-8"
                      />
                      <span>{cat.label}</span>
                    </button>
                  ))}
                </div>
                <FieldErrors messages={errors?.category} />
              </div>
            )}

            {step === 1 && (
              <div className="post-step">
                <div className="post-step__head">
                  <h2>Where are they?</h2>
                  <p>Help nearby families discover this pet.</p>
                </div>

                <label className="post-label" htmlFor="countrySelection">
                  Country
                </label>
                <select
                  id="countrySelection"
                  className="post-input"
                  value={form.country}
                  onChange={(e) => update("country", e.target.value)}
                >
                  {COUNTRIES.map((country) => (
                    <option key={country} value={country.toLowerCase()}>
                      {country}
                    </option>
                  ))}
                </select>
                <FieldErrors messages={errors?.country} />

                <label className="post-label" htmlFor="streetAddress">
                  Street address
                </label>
                <input
                  id="streetAddress"
                  className="post-input"
                  value={form.streetAddress}
                  onChange={(e) => update("streetAddress", e.target.value)}
                  placeholder="Street and number"
                />
                <FieldErrors messages={errors?.streetAddress} />

                <div className="post-grid-2">
                  <div>
                    <label className="post-label" htmlFor="cityAddress">
                      Town / City
                    </label>
                    <input
                      id="cityAddress"
                      className="post-input"
                      value={form.city}
                      onChange={(e) => update("city", e.target.value)}
                      placeholder="City"
                    />
                    <FieldErrors messages={errors?.city} />
                  </div>
                  <div>
                    <label className="post-label" htmlFor="postCode">
                      Post code
                    </label>
                    <input
                      id="postCode"
                      className="post-input"
                      value={form.postCode}
                      onChange={(e) => update("postCode", e.target.value)}
                      placeholder="Post code"
                    />
                    <FieldErrors messages={errors?.postCode} />
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="post-step">
                <div className="post-step__head">
                  <h2>Care notes & story</h2>
                  <p>Optional medical details and a short story about this pet.</p>
                </div>

                <div className="post-stack">
                  <textarea
                    className="post-input"
                    rows={2}
                    placeholder="Vaccinations / flea, tick, heartworm prevention"
                    value={form.vaccines}
                    onChange={(e) => update("vaccines", e.target.value)}
                  />
                  <textarea
                    className="post-input"
                    rows={2}
                    placeholder="Medical conditions, surgeries, or injuries"
                    value={form.health}
                    onChange={(e) => update("health", e.target.value)}
                  />
                  <textarea
                    className="post-input"
                    rows={2}
                    placeholder="Diet or food restrictions"
                    value={form.diet}
                    onChange={(e) => update("diet", e.target.value)}
                  />
                  <textarea
                    className="post-input"
                    rows={2}
                    placeholder="Behavior notes (anxiety, aggression, etc.)"
                    value={form.behavior}
                    onChange={(e) => update("behavior", e.target.value)}
                  />
                </div>

                <label className="post-label" htmlFor="description">
                  Description
                </label>
                <textarea
                  id="description"
                  className="post-input"
                  rows={4}
                  placeholder="Personality, habits, and the kind of home they need…"
                  value={form.description}
                  onChange={(e) => update("description", e.target.value)}
                />
                <FieldErrors messages={errors?.description} />

                <label
                  className={`post-emergency${emergency ? " is-on" : ""}`}
                >
                  <span>
                    <Siren className="h-4 w-4" />
                    Mark as urgent need
                  </span>
                  <input
                    type="checkbox"
                    checked={emergency}
                    onChange={(e) => setEmergency(e.target.checked)}
                  />
                </label>
              </div>
            )}
          </div>

          {message && (
            <p className="post-alert post-alert--error" role="alert">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              <span>{message}</span>
            </p>
          )}

          <div className="post-wizard__actions">
            <button
              type="button"
              className="post-btn post-btn--ghost"
              onClick={goBack}
              disabled={step === 0 || pending}
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>

            {step < 2 ? (
              <button
                type="button"
                className="post-btn"
                onClick={goNext}
                disabled={!canContinue}
              >
                Continue
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="button"
                className="post-btn"
                onClick={handlePost}
                disabled={pending || !canContinue}
              >
                {pending
                  ? isEdit
                    ? "Saving…"
                    : "Posting…"
                  : isEdit
                    ? "Save changes"
                    : "Post pet"}
                <Check className="h-4 w-4" />
              </button>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}

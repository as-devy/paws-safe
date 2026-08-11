"use client";

import Link from "next/link";
import { FormEvent, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Check,
  HeartHandshake,
  ImagePlus,
  LoaderCircle,
  MapPin,
  PawPrint,
  Siren,
  Stethoscope,
} from "lucide-react";
import { COUNTRIES } from "@/lib/countries";
import { getCookie } from "@/lib/auth";

type Status = "idle" | "uploading" | "saving" | "success" | "error";
type Step = 0 | 1 | 2;

type FormState = {
  listingType: "" | "rehome" | "foster";
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

const CATEGORIES = [
  { key: "dog", label: "Dog", src: "/imgs/dog.png" },
  { key: "cat", label: "Cat", src: "/imgs/cat.png" },
  { key: "rabbit", label: "Rabbit", src: "/imgs/rabbit.png" },
  { key: "bird", label: "Bird", src: "/imgs/bird.png" },
  { key: "fish", label: "Fish", src: "/imgs/fish.png" },
  { key: "other", label: "Other", src: "/imgs/paw-outline.svg" },
] as const;

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

export default function PostPetForm() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState<Step>(0);
  const [form, setForm] = useState<FormState>(initialForm);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileLabel, setFileLabel] = useState("Add a clear photo");
  const [base64Image, setBase64Image] = useState<string | null>(null);
  const [emergency, setEmergency] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  const progress = useMemo(() => ((step + 1) / STEPS.length) * 100, [step]);
  const busy = status === "uploading" || status === "saving";

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
      const result = String(reader.result ?? "");
      setPreview(result);
      setBase64Image(result.split(",")[1] ?? null);
    };
    reader.readAsDataURL(file);
  }

  function validateStep(current: Step) {
    if (current === 0) {
      if (!base64Image) return "Please add a photo of your pet.";
      if (!form.listingType) return "Choose adoption or foster.";
      if (!form.name.trim()) return "Please enter your pet’s name.";
      if (!form.age.trim()) return "Please enter your pet’s age.";
      if (!form.gender) return "Please select a gender.";
      if (!form.category) return "Please choose a category.";
    }
    if (current === 1) {
      if (!form.country) return "Please select a country.";
      if (!form.streetAddress.trim()) return "Please enter a street address.";
      if (!form.city.trim()) return "Please enter a city.";
      if (!form.postCode.trim()) return "Please enter a post code.";
    }
    if (current === 2) {
      if (!form.description.trim()) {
        return "Please add a short description for adopters.";
      }
    }
    return "";
  }

  function goNext() {
    const message = validateStep(step);
    if (message) {
      setError(message);
      return;
    }
    setError("");
    setStep((s) => Math.min(2, s + 1) as Step);
  }

  function goBack() {
    setError("");
    setStep((s) => Math.max(0, s - 1) as Step);
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (step !== 2) {
      goNext();
      return;
    }

    const message = validateStep(2);
    if (message) {
      setError(message);
      return;
    }

    const userId = getCookie("UserId");
    if (!userId) {
      setError("Please log in before posting a pet.");
      return;
    }
    if (!base64Image || !form.listingType) return;

    const rehoming = form.listingType === "rehome" ? 1 : 0;
    const foster = form.listingType === "foster" ? 1 : 0;

    try {
      setStatus("uploading");
      setError("");

      const uploadBody = new FormData();
      uploadBody.append("key", "2750377068f6e1a5530b8e8e9a5d522b");
      uploadBody.append("image", base64Image);

      const uploadRes = await fetch("https://api.imgbb.com/1/upload", {
        method: "POST",
        body: uploadBody,
      });
      const uploadJson = await uploadRes.json();
      if (!uploadJson?.success) throw new Error("Image upload failed");

      setStatus("saving");
      const petPayload = {
        ownerId: userId,
        img: uploadJson.data.url as string,
        rehoming,
        foster,
        emergency: emergency ? 1 : 0,
        name: form.name.trim(),
        age: form.age.trim(),
        category: form.category,
        gender: form.gender,
        country: form.country,
        streetAddress: form.streetAddress.trim(),
        city: form.city.trim(),
        postCode: form.postCode.trim(),
        vaccines_prevention: form.vaccines.trim(),
        health_history: form.health.trim(),
        diet: form.diet.trim(),
        behavior: form.behavior.trim(),
        description: form.description.trim(),
        requests: [],
      };

      const saveRes = await fetch("https://pawssafe.ddns.net/addPet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(petPayload),
      });
      const saveJson = await saveRes.json();
      if (!saveJson?.petId) throw new Error("Could not save pet");

      setStatus("success");
      window.setTimeout(() => {
        router.push(rehoming ? "/adoption" : "/foster");
      }, 900);
    } catch (err) {
      console.error(err);
      setStatus("error");
      setError("Something went wrong while posting. Please try again.");
    }
  }

  return (
    <section className="post-stage">
      <div className="post-stage__glow" aria-hidden />
      <div className="post-stage__pattern" aria-hidden />

      <div className="post-stage__frame">
        <header className="post-stage__intro">
          <p className="post-stage__kicker">Find them a home</p>
          <h1>Post your pet in a few easy steps</h1>
          <p>
            Share a photo, basics, and care notes so the right family can
            respond with confidence.
          </p>
          <p className="post-stage__crumb">
            <Link href="/">Home</Link> <span aria-hidden>&gt;</span> Post Pet
          </p>
        </header>

        <form className="post-wizard" onSubmit={onSubmit}>
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
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={preview} alt="Pet preview" />
                  ) : (
                    <>
                      <ImagePlus className="h-8 w-8" />
                      <strong>Upload pet photo</strong>
                      <span>JPG or PNG works best</span>
                    </>
                  )}
                </button>
                <p className="post-dropzone__meta">{fileLabel}</p>

                <p className="post-label">I am posting for</p>
                <div className="post-type-grid">
                  <button
                    type="button"
                    className={`post-type${form.listingType === "rehome" ? " is-active" : ""}`}
                    onClick={() => update("listingType", "rehome")}
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

                <p className="post-label">Category</p>
                <div className="post-category-grid">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.key}
                      type="button"
                      className={`post-category${form.category === cat.key ? " is-active" : ""}`}
                      onClick={() => update("category", cat.key)}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={cat.src} alt="" />
                      <span>{cat.label}</span>
                    </button>
                  ))}
                </div>
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
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="post-step">
                <div className="post-step__head">
                  <h2>Care notes & story</h2>
                  <p>Optional medical details help, description is required.</p>
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

          {error && (
            <p className="post-alert post-alert--error">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              <span>
                {error}
                {error.includes("log in") && (
                  <>
                    {" "}
                    <Link href="/login" className="underline font-bold">
                      Go to login
                    </Link>
                  </>
                )}
              </span>
            </p>
          )}

          {status === "success" && (
            <p className="post-alert post-alert--ok">
              <Check className="h-4 w-4" />
              Pet posted successfully. Redirecting…
            </p>
          )}

          <div className="post-wizard__actions">
            <button
              type="button"
              className="post-btn post-btn--ghost"
              onClick={goBack}
              disabled={step === 0 || busy}
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>

            {step < 2 ? (
              <button type="button" className="post-btn" onClick={goNext}>
                Continue
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button type="submit" className="post-btn" disabled={busy}>
                {busy ? (
                  <>
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                    {status === "uploading" ? "Uploading…" : "Publishing…"}
                  </>
                ) : (
                  <>
                    Post pet
                    <Check className="h-4 w-4" />
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}

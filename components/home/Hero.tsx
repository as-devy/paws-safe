"use client";

<<<<<<< HEAD
import { useRouter } from "next/navigation";
import { FormEvent, useState, type CSSProperties } from "react";
import { PawPrint, Search } from "lucide-react";
import { CATEGORY_FILTERS } from "@/lib/pets";
import CategoryIcon from "@/components/pets/CategoryIcon";

const heroCategories = CATEGORY_FILTERS.filter((c) => c.key !== "all");

const FLOATING_PAWS = [
  { top: "14%", left: "8%", size: 22, delay: "0s", duration: "18s" },
  { top: "22%", left: "86%", size: 16, delay: "2.4s", duration: "22s" },
  { top: "58%", left: "6%", size: 18, delay: "5s", duration: "20s" },
  { top: "68%", left: "90%", size: 24, delay: "1.2s", duration: "24s" },
  { top: "38%", left: "78%", size: 14, delay: "7s", duration: "16s" },
  { top: "72%", left: "18%", size: 15, delay: "3.6s", duration: "19s" },
] as const;
=======
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Search } from "lucide-react";

const categories = [
  { key: "dog", label: "Dogs", src: "/imgs/dog.png", w: 56, h: 60 },
  { key: "cat", label: "Cats", src: "/imgs/cat.png", w: 50, h: 62 },
  { key: "bird", label: "Birds", src: "/imgs/bird.png", w: 56, h: 50 },
  { key: "rabbit", label: "Rabbit", src: "/imgs/rabbit.png", w: 40, h: 60 },
  { key: "fish", label: "Fish", src: "/imgs/fish.png", w: 64, h: 46 },
  { key: "other", label: "Other", src: "/imgs/paw-outline.svg", w: 48, h: 48 },
];
>>>>>>> 9fbe6272ae14926655cd6155816221b0eb2ae799

export default function Hero() {
  const router = useRouter();
  const [country, setCountry] = useState("all");
  const [category, setCategory] = useState("dog");
  const [type, setType] = useState("adopt");

<<<<<<< HEAD
  function goToListings(nextCategory = category) {
    const path = type === "adopt" ? "/adoption" : "/foster";
    router.push(`${path}?country=${country}&category=${nextCategory}`);
  }

  function onSearch(e?: FormEvent) {
    e?.preventDefault();
    goToListings();
  }

  return (
    <section className="hero">
      <main className="hero-surface">
        <div className="hero-bg" aria-hidden>
          <div className="hero-bg__pattern" />
          <div className="hero-bg__orb hero-bg__orb--teal" />
          <div className="hero-bg__orb hero-bg__orb--gold" />
          <div className="hero-bg__orb hero-bg__orb--mint" />
          <div className="hero-bg__sheen" />
          {FLOATING_PAWS.map((paw, index) => (
            <PawPrint
              key={index}
              className="hero-bg__paw"
              style={
                {
                  top: paw.top,
                  left: paw.left,
                  width: paw.size,
                  height: paw.size,
                  animationDelay: paw.delay,
                  animationDuration: paw.duration,
                } as CSSProperties
              }
            />
          ))}
        </div>

        <div className="hero-copy">
          <p className="hero-kicker">Paws Safe</p>
          <h1 className="hero-brand">
            Connecting Pets with
            <span> Loving Homes</span>
          </h1>
          <p className="hero-lead">
            Need to rehome? Post your pet. Looking to help? Adopt or foster.
          </p>

          <form onSubmit={onSearch} className="search-panel">
=======
  function onSearch(e?: FormEvent) {
    e?.preventDefault();
    const path = type === "adopt" ? "/adoption" : "/foster";
    router.push(`${path}?country=${country}&category=${category}`);
  }

  return (
    <section className="relative mb-20 sm:mb-24">
      <main className="hero-surface relative min-h-[85vh] overflow-hidden pt-24 pb-24 sm:min-h-[88vh] sm:pb-28">
        <div className="relative z-10 mx-auto flex w-[min(1100px,92%)] flex-col items-center px-2 pt-10 text-center text-white sm:pt-16">
          <p className="mb-3 font-display text-sm font-semibold tracking-[0.2em] text-primary uppercase sm:text-base">
            Paws Safe
          </p>
          <h1 className="hero-brand max-w-3xl font-display text-3xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">
            Connecting Pets with Loving Homes
          </h1>
          <p className="mt-4 max-w-xl text-sm text-zinc-200 sm:text-base">
            Need to rehome? Post your pet. Looking to help? Adopt or foster.
          </p>

          <form
            onSubmit={onSearch}
            className="search-panel mt-8 flex w-full max-w-3xl flex-col gap-3 rounded-2xl p-3 sm:mt-10 sm:flex-row sm:items-center sm:rounded-full sm:p-2"
          >
>>>>>>> 9fbe6272ae14926655cd6155816221b0eb2ae799
            <label className="sr-only" htmlFor="countrySelection">
              Country
            </label>
            <select
              id="countrySelection"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="hero-select"
            >
              <option value="all">All Countries</option>
              <option value="egypt">Egypt</option>
              <option value="usa">USA</option>
              <option value="uk">UK</option>
            </select>

            <label className="sr-only" htmlFor="categorySelection">
              Pet category
            </label>
            <select
              id="categorySelection"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="hero-select sm:max-w-[150px]"
            >
              <option value="dog">Dog</option>
              <option value="cat">Cat</option>
              <option value="rabbit">Rabbit</option>
              <option value="bird">Bird</option>
              <option value="fish">Fish</option>
              <option value="other">Other</option>
            </select>

            <label className="sr-only" htmlFor="type_selection">
              Type
            </label>
            <select
              id="type_selection"
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="hero-select sm:max-w-[140px]"
            >
              <option value="adopt">Adopt</option>
              <option value="foster">Foster</option>
            </select>

            <button
              type="submit"
              className="hero-search-btn"
              aria-label="Search pets"
            >
              <Search className="h-4 w-4" />
              <span className="sm:hidden">Search</span>
            </button>
          </form>
        </div>
      </main>

<<<<<<< HEAD
      <div className="hero-rail">
        <nav className="category-rail" aria-label="Browse by pet type">
          <p className="category-rail__label">Quick browse</p>
          <ul className="category-rail__list">
            {heroCategories.map((cat) => {
              const active = category === cat.key;
              return (
                <li key={cat.key}>
                  <button
                    type="button"
                    aria-pressed={active}
                    onClick={() => {
                      setCategory(cat.key);
                      goToListings(cat.key);
                    }}
                    className={`category-chip${active ? " is-active" : ""}`}
                    style={{ "--chip-accent": cat.color } as CSSProperties}
                  >
                    <span className="category-chip__icon" aria-hidden>
                      <CategoryIcon
                        category={cat.key}
                        className="h-[1.15rem] w-[1.15rem]"
                      />
                    </span>
                    <span className="category-chip__text">{cat.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
=======
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 translate-y-1/2 px-[4%]">
        <div className="category-rail pointer-events-auto mx-auto flex w-full max-w-4xl gap-3 overflow-x-auto rounded-3xl p-3 sm:justify-between sm:gap-4 sm:overflow-visible sm:p-4">
          {categories.map((cat) => (
            <button
              key={cat.key}
              type="button"
              onClick={() => {
                setCategory(cat.key);
                const path = type === "adopt" ? "/adoption" : "/foster";
                router.push(`${path}?country=${country}&category=${cat.key}`);
              }}
              className="category-tile flex min-w-[88px] flex-1 flex-col items-center justify-center gap-2 rounded-2xl border px-2 py-3 sm:min-w-[96px] sm:px-3 sm:py-4"
            >
              <Image
                src={cat.src}
                alt=""
                width={cat.w}
                height={cat.h}
                className="h-12 w-auto object-contain"
              />
              <span className="text-xs font-bold text-ink">{cat.label}</span>
            </button>
          ))}
        </div>
>>>>>>> 9fbe6272ae14926655cd6155816221b0eb2ae799
      </div>
    </section>
  );
}

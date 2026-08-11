"use client";

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

export default function Hero() {
  const router = useRouter();
  const [country, setCountry] = useState("all");
  const [category, setCategory] = useState("dog");
  const [type, setType] = useState("adopt");

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
      </div>
    </section>
  );
}

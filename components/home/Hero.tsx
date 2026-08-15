"use client";

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

export default function Hero() {
  const router = useRouter();
  const [country, setCountry] = useState("all");
  const [category, setCategory] = useState("dog");
  const [type, setType] = useState("adopt");

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
      </div>
    </section>
  );
}

"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { useSearchParams } from "next/navigation";
import { ChevronDown, Globe, PawPrint, RotateCcw, SlidersHorizontal } from "lucide-react";
import ListingBanner from "@/components/pets/ListingBanner";
import PetCard from "@/components/pets/PetCard";
import CategoryIcon from "@/components/pets/CategoryIcon";
import {
  CATEGORY_FILTERS,
  countCategories,
  countrySlug,
  matchesCategory,
  type ListingMode,
  type Pet,
} from "@/lib/pets";

export type { ListingMode };

type PetListingProps = {
  mode: ListingMode;
  initialPets?: Pet[];
};

export default function PetListing({
  mode,
  initialPets = [],
}: PetListingProps) {
  const searchParams = useSearchParams();

  const [pets] = useState<Pet[]>(initialPets);
  const [country, setCountry] = useState("all");
  const [category, setCategory] = useState("all");

  useEffect(() => {
    const countryParam = searchParams.get("country");
    const categoryParam = searchParams.get("category");
    if (countryParam) setCountry(countryParam);
    if (categoryParam) setCategory(categoryParam);
  }, [searchParams]);

  const countries = useMemo(() => {
    const unique = [...new Set(pets.map((pet) => pet.country).filter(Boolean))];
    return unique.sort((a, b) => a.localeCompare(b));
  }, [pets]);

  const countryPets = useMemo(() => {
    if (country === "all") return pets;
    return pets.filter((pet) => countrySlug(pet.country) === country);
  }, [pets, country]);

  const visiblePets = useMemo(
    () =>
      countryPets
        .filter((pet) => pet.status === mode)
        .filter((pet) => matchesCategory(pet, category)),
    [countryPets, category, mode],
  );

  const categoryCounts = useMemo(
    () => countCategories(countryPets),
    [countryPets],
  );

  const filtersActive = country !== "all" || category !== "all";
  const activeCategoryLabel =
    CATEGORY_FILTERS.find((item) => item.key === category)?.label ?? "All";
  const activeCountryLabel =
    country === "all"
      ? "All countries"
      : countries.find((c) => countrySlug(c) === country) ?? country;

  function resetFilters() {
    setCountry("all");
    setCategory("all");
  }

  return (
    <main className={`pet-listing pet-listing--${mode}`}>
      <ListingBanner mode={mode} />

      <section className="pet-listing__body">
        <div className="pet-listing__container">
          <aside className="pet-filter" aria-label="Pet filters">
            <div className="pet-filter__panel">
              <header className="pet-filter__head">
                <div className="pet-filter__title-wrap">
                  <span className="pet-filter__icon" aria-hidden>
                    <SlidersHorizontal className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="pet-filter__kicker">Refine</p>
                    <h2 className="pet-filter__title">Filters</h2>
                  </div>
                </div>
                {filtersActive && (
                  <button
                    type="button"
                    className="pet-filter__reset"
                    onClick={resetFilters}
                  >
                    <RotateCcw className="h-3.5 w-3.5" aria-hidden />
                    Reset
                  </button>
                )}
              </header>

              <div className="pet-filter__section">
                <label className="pet-filter__label" htmlFor="countryFilter">
                  <Globe className="h-3.5 w-3.5" aria-hidden />
                  Location
                </label>
                <div className="pet-filter__select-wrap">
                  <select
                    id="countryFilter"
                    className="pet-filter__select"
                    value={country}
                    onChange={(e) => {
                      setCountry(e.target.value);
                      setCategory("all");
                    }}
                  >
                    <option value="all">All countries</option>
                    {countries.map((c) => (
                      <option key={c} value={countrySlug(c)}>
                        {c}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    className="pet-filter__select-caret"
                    aria-hidden
                  />
                </div>
              </div>

              <div className="pet-filter__section">
                <p className="pet-filter__label">
                  <PawPrint className="h-3.5 w-3.5" aria-hidden />
                  Category
                </p>
                <ul className="pet-filter__cats" role="list">
                  {CATEGORY_FILTERS.map((item) => {
                    const countKey =
                      item.key === "all"
                        ? "all"
                        : (item.key as keyof typeof categoryCounts);
                    const count = categoryCounts[countKey] ?? 0;
                    const active = category === item.key;

                    return (
                      <li key={item.key}>
                        <button
                          type="button"
                          className={`pet-filter__cat${active ? " is-active" : ""}`}
                          aria-pressed={active}
                          onClick={() => setCategory(item.key)}
                        >
                          <span
                            className="pet-filter__cat-icon"
                            style={
                              {
                                "--cat-accent": item.color,
                              } as CSSProperties
                            }
                          >
                            <CategoryIcon
                              category={item.key}
                              className="h-4 w-4"
                            />
                          </span>
                          <span className="pet-filter__cat-label">
                            {item.label}
                          </span>
                          <span className="pet-filter__cat-count">{count}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </aside>

          <div className="pet-listing__list-wrap">
            <div className="pet-listing__toolbar">
              <p className="pet-listing__results">
                <strong>{visiblePets.length}</strong>
                {visiblePets.length === 1 ? " pet" : " pets"}
                <span aria-hidden>·</span>
                <span>
                  {activeCategoryLabel}
                  {country !== "all" ? ` in ${activeCountryLabel}` : ""}
                </span>
              </p>
            </div>

            <div className="pet-listing__list">
              {visiblePets.length === 0 ? (
                <p className="pet-listing__msg">
                  No pets match these filters. Try another country or category.
                </p>
              ) : (
                visiblePets.map((pet) => <PetCard key={pet.id} pet={pet} />)
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

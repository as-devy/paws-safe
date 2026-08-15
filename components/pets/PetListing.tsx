"use client";

<<<<<<< HEAD
import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { useSearchParams } from "next/navigation";
import { ChevronDown, Globe, PawPrint, RotateCcw, SlidersHorizontal } from "lucide-react";
import ListingBanner from "@/components/pets/ListingBanner";
import PetCard from "@/components/pets/PetCard";
import CategoryIcon from "@/components/pets/CategoryIcon";
=======
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Globe, PawPrint } from "lucide-react";
import ListingBanner from "@/components/pets/ListingBanner";
import PetCard from "@/components/pets/PetCard";
>>>>>>> 9fbe6272ae14926655cd6155816221b0eb2ae799
import {
  CATEGORY_FILTERS,
  countCategories,
  countrySlug,
<<<<<<< HEAD
=======
  fetchAllPets,
  isTruthy,
>>>>>>> 9fbe6272ae14926655cd6155816221b0eb2ae799
  matchesCategory,
  type ListingMode,
  type Pet,
} from "@/lib/pets";

export type { ListingMode };

type PetListingProps = {
  mode: ListingMode;
<<<<<<< HEAD
  initialPets?: Pet[];
};

export default function PetListing({
  mode,
  initialPets = [],
}: PetListingProps) {
  const searchParams = useSearchParams();

  const [pets] = useState<Pet[]>(initialPets);
=======
};

export default function PetListing({ mode }: PetListingProps) {
  const searchParams = useSearchParams();

  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
>>>>>>> 9fbe6272ae14926655cd6155816221b0eb2ae799
  const [country, setCountry] = useState("all");
  const [category, setCategory] = useState("all");

  useEffect(() => {
<<<<<<< HEAD
=======
    let cancelled = false;

    fetchAllPets()
      .then((data) => {
        if (cancelled) return;
        const filtered = data.filter((pet) =>
          mode === "adoption" ? isTruthy(pet.rehoming) : isTruthy(pet.foster),
        );
        setPets(filtered);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [mode]);

  useEffect(() => {
>>>>>>> 9fbe6272ae14926655cd6155816221b0eb2ae799
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
<<<<<<< HEAD
    () =>
      countryPets
        .filter((pet) => pet.status === mode)
        .filter((pet) => matchesCategory(pet, category)),
    [countryPets, category, mode],
=======
    () => countryPets.filter((pet) => matchesCategory(pet, category)),
    [countryPets, category],
>>>>>>> 9fbe6272ae14926655cd6155816221b0eb2ae799
  );

  const categoryCounts = useMemo(
    () => countCategories(countryPets),
    [countryPets],
  );

<<<<<<< HEAD
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

=======
>>>>>>> 9fbe6272ae14926655cd6155816221b0eb2ae799
  return (
    <main className={`pet-listing pet-listing--${mode}`}>
      <ListingBanner mode={mode} />

      <section className="pet-listing__body">
        <div className="pet-listing__container">
<<<<<<< HEAD
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
=======
          <aside className="pet-listing__filter" aria-label="Pet filters">
            <div className="pet-listing__sticky">
              <div className="pet-listing__country">
                <div className="pet-listing__country-label">
                  <span className="pet-listing__country-icon">
                    <Globe className="h-4 w-4" aria-hidden />
                  </span>
                  <b>Country</b>
                </div>
                <select
                  id="countryFilter"
                  value={country}
                  onChange={(e) => {
                    setCountry(e.target.value);
                    setCategory("all");
                  }}
                  aria-label="Filter by country"
                >
                  <option value="all">All Countries</option>
                  {countries.map((c) => (
                    <option key={c} value={countrySlug(c)}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pet-listing__categories">
                <ul>
>>>>>>> 9fbe6272ae14926655cd6155816221b0eb2ae799
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
<<<<<<< HEAD
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
=======
                          className={active ? "is-active" : undefined}
                          onClick={() => setCategory(item.key)}
                        >
                          <span
                            className="pet-listing__cat-icon"
                            style={{ backgroundColor: item.color }}
                          >
                            {"icon" in item && item.icon === "paw" ? (
                              <PawPrint className="h-4 w-4 text-white" />
                            ) : (
                              "iconSrc" in item && (
                                <Image
                                  src={item.iconSrc}
                                  alt=""
                                  width={25}
                                  height={25}
                                />
                              )
                            )}
                          </span>
                          <h4>{item.label}</h4>
                          <span className="pet-listing__cat-count">
                            ({count})
                          </span>
>>>>>>> 9fbe6272ae14926655cd6155816221b0eb2ae799
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </aside>

          <div className="pet-listing__list-wrap">
<<<<<<< HEAD
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
=======
            <div className="pet-listing__list">
              {loading && (
                <div className="pet-listing__skeleton-grid" aria-hidden>
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="pet-listing__skeleton" />
                  ))}
                </div>
              )}
              {error && (
                <p className="pet-listing__msg">Internal Server Error!</p>
              )}
              {!loading && !error && visiblePets.length === 0 && (
                <p className="pet-listing__msg">
                  Oops! We couldn’t find any pets matching your search
                </p>
              )}
              {!loading &&
                !error &&
                visiblePets.map((pet) => (
                  <PetCard key={pet.id} pet={pet} />
                ))}
>>>>>>> 9fbe6272ae14926655cd6155816221b0eb2ae799
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Globe, PawPrint } from "lucide-react";
import ListingBanner from "@/components/pets/ListingBanner";
import PetCard from "@/components/pets/PetCard";
import {
  CATEGORY_FILTERS,
  countCategories,
  countrySlug,
  fetchAllPets,
  isTruthy,
  matchesCategory,
  type ListingMode,
  type Pet,
} from "@/lib/pets";

export type { ListingMode };

type PetListingProps = {
  mode: ListingMode;
};

export default function PetListing({ mode }: PetListingProps) {
  const searchParams = useSearchParams();

  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [country, setCountry] = useState("all");
  const [category, setCategory] = useState("all");

  useEffect(() => {
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
    () => countryPets.filter((pet) => matchesCategory(pet, category)),
    [countryPets, category],
  );

  const categoryCounts = useMemo(
    () => countCategories(countryPets),
    [countryPets],
  );

  return (
    <main className={`pet-listing pet-listing--${mode}`}>
      <ListingBanner mode={mode} />

      <section className="pet-listing__body">
        <div className="pet-listing__container">
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
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </aside>

          <div className="pet-listing__list-wrap">
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
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

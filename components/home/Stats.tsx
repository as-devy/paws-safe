"use client";

import { useEffect, useRef, useState } from "react";
<<<<<<< HEAD
import { Award, HeartHandshake, PawPrint } from "lucide-react";
=======
>>>>>>> 9fbe6272ae14926655cd6155816221b0eb2ae799

function useCountUp(end: number, active: boolean, duration = 900) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) return;
    let startTimestamp: number | null = null;
    let frame = 0;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setValue(Math.floor(progress * end));
      if (progress < 1) {
        frame = requestAnimationFrame(step);
      }
    };

    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [active, end, duration]);

  return value;
}

const stats = [
<<<<<<< HEAD
  { key: "adopted", label: "Pets Adopted", end: 48, icon: HeartHandshake },
  { key: "fostered", label: "Pets Fostered", end: 32, icon: PawPrint },
  { key: "years", label: "Years of Experience", end: 1, icon: Award },
=======
  { key: "adopted", label: "Pets Adopted", end: 48 },
  { key: "fostered", label: "Pets Fostered", end: 32 },
  { key: "years", label: "Years of Experience", end: 1 },
>>>>>>> 9fbe6272ae14926655cd6155816221b0eb2ae799
];

export default function Stats() {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(false);
  const adopted = useCountUp(stats[0].end, active);
  const fostered = useCountUp(stats[1].end, active);
  const years = useCountUp(stats[2].end, active);
  const values = [adopted, fostered, years];

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
<<<<<<< HEAD
    <section ref={ref} id="counter_section" className="stats-band">
      <div className="stats-band__media" aria-hidden>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/imgs/counter.jpg" alt="" />
      </div>
      <div className="stats-band__tint" aria-hidden />
      <div className="stats-band__overlay" aria-hidden />

      <div className="stats-band__inner">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={stat.key} className="reveal-child stat-tile">
              <span className="stat-tile__icon" aria-hidden>
                <Icon className="h-5 w-5" />
              </span>
              <div className="stat-tile__value">{values[i]}</div>
              <div className="stat-tile__label">{stat.label}</div>
            </div>
          );
        })}
=======
    <section ref={ref} id="counter_section" className="stats-band py-16 sm:py-20">
      <div className="mx-auto flex w-[min(1000px,92%)] flex-col items-center justify-center gap-6 sm:flex-row sm:gap-8">
        {stats.map((stat, i) => (
          <div
            key={stat.key}
            className="reveal-child stat-tile flex h-44 w-full max-w-[260px] flex-col items-center justify-center rounded-3xl px-6 text-center text-white"
          >
            <div className="font-display text-5xl font-bold">{values[i]}</div>
            <div className="mt-3 text-sm font-bold tracking-wide uppercase">
              {stat.label}
            </div>
          </div>
        ))}
>>>>>>> 9fbe6272ae14926655cd6155816221b0eb2ae799
      </div>
    </section>
  );
}

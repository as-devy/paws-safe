"use client";

import { useEffect, useRef, useState } from "react";

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
  { key: "adopted", label: "Pets Adopted", end: 48 },
  { key: "fostered", label: "Pets Fostered", end: 32 },
  { key: "years", label: "Years of Experience", end: 1 },
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
      </div>
    </section>
  );
}

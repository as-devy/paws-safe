"use client";

import { useEffect, useRef, useState } from "react";
import { Award, HeartHandshake, PawPrint } from "lucide-react";

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
  { key: "adopted", label: "Pets Adopted", end: 48, icon: HeartHandshake },
  { key: "fostered", label: "Pets Fostered", end: 32, icon: PawPrint },
  { key: "years", label: "Years of Experience", end: 1, icon: Award },
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
      </div>
    </section>
  );
}

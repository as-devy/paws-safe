"use client";

import Image from "next/image";
import { FormEvent, useState } from "react";
import { Check } from "lucide-react";

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setStatus("sending");
    // UI-only for now; wire to API later
    window.setTimeout(() => {
      setStatus("sent");
      form.reset();
      window.setTimeout(() => setStatus("idle"), 4000);
    }, 800);
  }

  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto flex w-[min(1200px,92%)] flex-col items-center gap-10 lg:flex-row lg:justify-between">
        <form
          id="contact"
          onSubmit={onSubmit}
          className="reveal-child contact-panel w-full max-w-xl rounded-2xl p-6 sm:p-10"
        >
          <h2 className="font-display text-2xl font-bold text-heading sm:text-3xl">
            Send us a message
          </h2>

          <label
            htmlFor="contact_username"
            className="mt-4 block px-1 text-sm text-muted"
          >
            Name
          </label>
          <input
            type="text"
            id="contact_username"
            name="name"
            required
            className="w-full rounded-2xl border border-primary bg-[var(--input-bg)] px-4 py-2.5 text-base text-ink outline-none focus:ring-2 focus:ring-primary/40"
          />

          <label
            htmlFor="contact_user_email"
            className="mt-3 block px-1 text-sm text-muted"
          >
            Email address
          </label>
          <input
            type="email"
            id="contact_user_email"
            name="email"
            required
            className="w-full rounded-2xl border border-primary bg-[var(--input-bg)] px-4 py-2.5 text-base text-ink outline-none focus:ring-2 focus:ring-primary/40"
          />

          <label
            htmlFor="contact_message"
            className="mt-3 block px-1 text-sm text-muted"
          >
            Message
          </label>
          <textarea
            id="contact_message"
            name="message"
            rows={4}
            required
            className="w-full resize-none rounded-2xl border border-primary bg-[var(--input-bg)] px-4 py-2.5 text-base text-ink outline-none focus:ring-2 focus:ring-primary/40"
          />

          <button
            type="submit"
            disabled={status === "sending"}
            className="mt-4 rounded-full bg-danger px-6 py-2.5 text-base font-semibold text-white transition-colors hover:bg-red-800 disabled:opacity-60"
          >
            {status === "sending" ? "Sending..." : "Send"}
          </button>

          {status === "sent" && (
            <div className="mt-4 flex items-center gap-2 rounded-xl bg-primary/10 px-3 py-2 text-sm font-semibold text-heading">
              <Check className="h-4 w-4 text-primary" />
              Message sent successfully
            </div>
          )}
        </form>

        <Image
          src="/imgs/faq.webp"
          alt="Dog and cat together"
          width={560}
          height={420}
          className="reveal-child h-auto w-full max-w-md rounded-2xl object-cover lg:max-w-lg"
        />
      </div>
    </section>
  );
}

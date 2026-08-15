"use client";

import Image from "next/image";
import { FormEvent, useState } from "react";
<<<<<<< HEAD
import { LoaderCircle, Mail, MessageCircle, Send, UserRound } from "lucide-react";
import SiteToast from "@/components/ui/SiteToast";

export default function ContactForm() {
  const [sending, setSending] = useState(false);
  const [toast, setToast] = useState(false);
=======
import { Check } from "lucide-react";

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
>>>>>>> 9fbe6272ae14926655cd6155816221b0eb2ae799

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
<<<<<<< HEAD
    setSending(true);
    window.setTimeout(() => {
      form.reset();
      setSending(false);
      setToast(false);
      window.requestAnimationFrame(() => setToast(true));
    }, 600);
  }

  return (
    <section className="home-contact">
      <div className="section-pattern section-pattern--sparse" aria-hidden />

      <div className="home-contact__inner">
        <form
          id="contact"
          onSubmit={onSubmit}
          className="reveal-child home-contact__panel"
        >
          <div className="home-contact__head">
            <span className="home-contact__icon">
              <MessageCircle className="h-5 w-5" />
            </span>
            <div>
              <p className="home-contact__kicker">We&apos;re here to help</p>
              <h2>Send us a message</h2>
              <p>Questions about adopt, foster, or posting a pet? We usually reply within a day.</p>
            </div>
          </div>

          <div className="home-contact__grid">
            <label className="home-contact__field" htmlFor="contact_username">
              <span>
                <UserRound className="h-3.5 w-3.5" />
                Name
              </span>
              <input
                type="text"
                id="contact_username"
                name="name"
                autoComplete="name"
                placeholder="Your name"
                required
              />
            </label>

            <label className="home-contact__field" htmlFor="contact_user_email">
              <span>
                <Mail className="h-3.5 w-3.5" />
                Email
              </span>
              <input
                type="email"
                id="contact_user_email"
                name="email"
                autoComplete="email"
                placeholder="you@example.com"
                required
              />
            </label>
          </div>

          <label className="home-contact__field" htmlFor="contact_message">
            <span>
              <MessageCircle className="h-3.5 w-3.5" />
              Message
            </span>
            <textarea
              id="contact_message"
              name="message"
              rows={5}
              placeholder="How can we help?"
              required
            />
          </label>

          <button
            type="submit"
            disabled={sending}
            className="home-contact__submit"
          >
            {sending ? (
              <>
                <LoaderCircle className="h-4 w-4 animate-spin" />
                Sending…
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Send message
              </>
            )}
          </button>
        </form>

        {toast ? (
          <SiteToast
            message="Your message has been sent successfully."
            onClose={() => setToast(false)}
          />
        ) : null}

        <div className="home-contact__media reveal-child">
          <Image
            src="/imgs/faq.webp"
            alt="People with a dog ready to help"
            width={560}
            height={420}
          />
        </div>
=======
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
>>>>>>> 9fbe6272ae14926655cd6155816221b0eb2ae799
      </div>
    </section>
  );
}

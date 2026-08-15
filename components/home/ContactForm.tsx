"use client";

import Image from "next/image";
import { FormEvent, useState } from "react";
import { LoaderCircle, Mail, MessageCircle, Send, UserRound } from "lucide-react";
import SiteToast from "@/components/ui/SiteToast";

export default function ContactForm() {
  const [sending, setSending] = useState(false);
  const [toast, setToast] = useState(false);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
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
      </div>
    </section>
  );
}

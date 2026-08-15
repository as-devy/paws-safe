"use client";

import Image from "next/image";
import { FormEvent, useState } from "react";
import {
  Clock3,
  LoaderCircle,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
  Tag,
  UserRound,
} from "lucide-react";
import SiteToast from "@/components/ui/SiteToast";

const channels = [
  {
    icon: Mail,
    title: "Email",
    text: "support@pawssafe.org",
  },
  {
    icon: Phone,
    title: "Phone",
    text: "+20 100 000 0000",
  },
  {
    icon: Clock3,
    title: "Hours",
    text: "Sat–Thu, 10am–6pm",
  },
  {
    icon: MapPin,
    title: "Coverage",
    text: "Helping pets nationwide",
  },
];

export default function ContactPageContent() {
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
    <div className="contact-layout">
      <aside className="contact-aside">
        <div className="contact-aside__card">
          <p className="contact-kicker">We&apos;re here to help</p>
          <h2>Talk with the Paws Safe team</h2>
          <p>
            Questions about adoption, fostering, or posting a pet? Send a
            message and we&apos;ll get back as soon as we can.
          </p>

          <ul className="contact-channels">
            {channels.map(({ icon: Icon, title, text }) => (
              <li key={title}>
                <span className="contact-channels__icon">
                  <Icon className="h-4 w-4" />
                </span>
                <div>
                  <strong>{title}</strong>
                  <p>{text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <Image
          src="/imgs/faq.webp"
          alt="Dog and cat together"
          width={560}
          height={420}
          className="contact-aside__image"
        />
      </aside>

      <form className="home-contact__panel" onSubmit={onSubmit}>
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
          <label className="home-contact__field" htmlFor="page_contact_name">
            <span>
              <UserRound className="h-3.5 w-3.5" />
              Name
            </span>
            <input
              type="text"
              id="page_contact_name"
              name="name"
              autoComplete="name"
              placeholder="Your name"
              required
            />
          </label>

          <label className="home-contact__field" htmlFor="page_contact_email">
            <span>
              <Mail className="h-3.5 w-3.5" />
              Email
            </span>
            <input
              type="email"
              id="page_contact_email"
              name="email"
              autoComplete="email"
              placeholder="you@example.com"
              required
            />
          </label>
        </div>

        <label className="home-contact__field" htmlFor="page_contact_topic">
          <span>
            <Tag className="h-3.5 w-3.5" />
            Topic
          </span>
          <select
            id="page_contact_topic"
            name="topic"
            defaultValue="general"
          >
            <option value="general">General question</option>
            <option value="adoption">Adoption help</option>
            <option value="foster">Foster help</option>
            <option value="posting">Posting a pet</option>
            <option value="donation">Donation</option>
          </select>
        </label>

        <label className="home-contact__field" htmlFor="page_contact_message">
          <span>
            <MessageCircle className="h-3.5 w-3.5" />
            Message
          </span>
          <textarea
            id="page_contact_message"
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
    </div>
  );
}

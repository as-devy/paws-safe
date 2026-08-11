"use client";

import Image from "next/image";
import { FormEvent, useState } from "react";
import {
  Check,
  Clock3,
  LoaderCircle,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
} from "lucide-react";

type Status = "idle" | "sending" | "sent" | "error";

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
  const [status, setStatus] = useState<Status>("idle");

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setStatus("sending");

    window.setTimeout(() => {
      setStatus("sent");
      form.reset();
      window.setTimeout(() => setStatus("idle"), 4000);
    }, 800);
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

      <form className="form-card contact-form" onSubmit={onSubmit}>
        <div className="form-card__head">
          <span className="form-card__icon">
            <MessageCircle className="h-5 w-5" />
          </span>
          <div>
            <h2>Send us a message</h2>
            <p>We usually reply within one business day.</p>
          </div>
        </div>

        <label className="form-label" htmlFor="contact_name">
          Name
        </label>
        <input
          id="contact_name"
          name="name"
          type="text"
          className="form-control"
          required
        />

        <label className="form-label" htmlFor="contact_email">
          Email address
        </label>
        <input
          id="contact_email"
          name="email"
          type="email"
          className="form-control"
          required
        />

        <label className="form-label" htmlFor="contact_topic">
          Topic
        </label>
        <select id="contact_topic" name="topic" className="form-control" defaultValue="general">
          <option value="general">General question</option>
          <option value="adoption">Adoption help</option>
          <option value="foster">Foster help</option>
          <option value="posting">Posting a pet</option>
          <option value="donation">Donation</option>
        </select>

        <label className="form-label" htmlFor="contact_message">
          Message
        </label>
        <textarea
          id="contact_message"
          name="message"
          rows={5}
          className="form-control"
          required
          placeholder="How can we help?"
        />

        <button
          type="submit"
          className="form-submit form-submit--danger"
          disabled={status === "sending"}
        >
          {status === "sending" ? (
            <>
              <LoaderCircle className="h-4 w-4 animate-spin" />
              Sending…
            </>
          ) : (
            "Send message"
          )}
        </button>

        {status === "sent" && (
          <p className="form-alert form-alert--ok">
            <Check className="h-4 w-4" />
            Message sent successfully
          </p>
        )}
      </form>
    </div>
  );
}

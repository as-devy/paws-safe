"use client";

import Image from "next/image";
import { FormEvent, useState } from "react";
import {
<<<<<<< HEAD
=======
  Check,
>>>>>>> 9fbe6272ae14926655cd6155816221b0eb2ae799
  Clock3,
  LoaderCircle,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
<<<<<<< HEAD
  Send,
  Tag,
  UserRound,
} from "lucide-react";
import SiteToast from "@/components/ui/SiteToast";
=======
} from "lucide-react";

type Status = "idle" | "sending" | "sent" | "error";
>>>>>>> 9fbe6272ae14926655cd6155816221b0eb2ae799

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
<<<<<<< HEAD
  const [sending, setSending] = useState(false);
  const [toast, setToast] = useState(false);
=======
  const [status, setStatus] = useState<Status>("idle");
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
=======
    setStatus("sending");

    window.setTimeout(() => {
      setStatus("sent");
      form.reset();
      window.setTimeout(() => setStatus("idle"), 4000);
    }, 800);
>>>>>>> 9fbe6272ae14926655cd6155816221b0eb2ae799
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

<<<<<<< HEAD
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
=======
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
>>>>>>> 9fbe6272ae14926655cd6155816221b0eb2ae799
            <>
              <LoaderCircle className="h-4 w-4 animate-spin" />
              Sending…
            </>
          ) : (
<<<<<<< HEAD
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
=======
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
>>>>>>> 9fbe6272ae14926655cd6155816221b0eb2ae799
    </div>
  );
}

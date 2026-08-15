"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { ChevronLeft, LoaderCircle, MessageCircle, Send, X } from "lucide-react";
import { loadOwnerChat, sendOwnerChatMessage } from "@/lib/actions";
import { formatRelativeTime } from "@/lib/notifications";
import { userProfileHref } from "@/lib/pets";
import type { ChatMessage, ChatThread, OpenChatThread } from "@/lib/chat";

type ChatThreadDialogProps = OpenChatThread & {
  onClose: () => void;
  onBack?: () => void;
  onViewer?: (viewerId: string) => void;
};

export default function ChatThreadDialog({
  ownerId,
  visitorId,
  petId = null,
  petName = null,
  peerName,
  onClose,
  onBack,
  onViewer,
}: ChatThreadDialogProps) {
  const titleId = useId();
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [thread, setThread] = useState<ChatThread | null>(null);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setThread(null);
    setError(null);

    async function load(isPoll = false) {
      const result = await loadOwnerChat(ownerId, visitorId);
      if (cancelled) return;
      if (!result.ok) {
        if (!isPoll) setError(result.message);
        setLoading(false);
        return;
      }
      setThread(result.thread);
      onViewer?.(result.thread.viewerId);
      if (!isPoll) setError(null);
      setLoading(false);
    }

    void load();
    const timer = window.setInterval(() => {
      void load(true);
    }, 4000);

    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, [ownerId, visitorId, onViewer]);

  useEffect(() => {
    const node = listRef.current;
    if (!node) return;
    node.scrollTop = node.scrollHeight;
  }, [thread?.messages.length]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [loading]);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        if (onBack) onBack();
        else onClose();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onBack, onClose]);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = draft.trim();
    if (!text || sending) return;
    setSending(true);
    setError(null);
    const result = await sendOwnerChatMessage(
      thread?.ownerId ?? ownerId,
      thread?.visitorId ?? visitorId,
      text,
      petId ?? thread?.petId,
    );
    setSending(false);
    if (!result.ok) {
      setError(result.message);
      return;
    }
    setDraft("");
    setThread(result.thread);
    inputRef.current?.focus();
  }

  const messages: ChatMessage[] = thread?.messages ?? [];
  const about = thread?.petName || petName;
  const title = thread?.peerName || peerName || "Chat";
  const threadOwnerId = thread?.ownerId ?? ownerId;
  const threadVisitorId = thread?.visitorId ?? visitorId;
  const peerId = thread?.viewerId
    ? thread.viewerId === threadOwnerId
      ? threadVisitorId
      : threadOwnerId
    : null;

  return (
    <div className="owner-chat" role="dialog" aria-modal="true" aria-labelledby={titleId}>
      <header className="owner-chat__head">
        {onBack ? (
          <button
            type="button"
            className="owner-chat__close"
            onClick={onBack}
            aria-label="Back to chats"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        ) : (
          <span className="owner-chat__icon" aria-hidden>
            <MessageCircle className="h-4 w-4" />
          </span>
        )}
        <div>
          <p className="owner-chat__kicker">{about ? `About ${about}` : "Messages"}</p>
          <h2 id={titleId}>
            {peerId ? (
              <Link
                href={userProfileHref(peerId)}
                className="owner-chat__name"
                onClick={onClose}
              >
                {title}
              </Link>
            ) : (
              title
            )}
          </h2>
        </div>
        <button type="button" className="owner-chat__close" onClick={onClose} aria-label="Close chat">
          <X className="h-4 w-4" />
        </button>
      </header>

      <div className="owner-chat__body" ref={listRef}>
        {loading ? (
          <p className="owner-chat__status">
            <LoaderCircle className="h-4 w-4 animate-spin" />
            Loading messages…
          </p>
        ) : messages.length === 0 ? (
          <p className="owner-chat__empty">
            {about
              ? `Say hello and ask about ${about}.`
              : "Say hello to start the conversation."}
          </p>
        ) : (
          messages.map((item) => {
            const mine = item.senderId === thread?.viewerId;
            return (
              <div
                key={item.id}
                className={`owner-chat__bubble${mine ? " is-mine" : ""}`}
              >
                <p>{item.body}</p>
                <time dateTime={item.createdAt}>
                  {formatRelativeTime(item.createdAt)}
                </time>
              </div>
            );
          })
        )}
      </div>

      {error ? (
        <p className="owner-chat__error" role="alert">
          {error}
        </p>
      ) : null}

      <form className="owner-chat__form" onSubmit={onSubmit}>
        <label className="sr-only" htmlFor={`${titleId}-input`}>
          Message
        </label>
        <textarea
          id={`${titleId}-input`}
          ref={inputRef}
          rows={2}
          value={draft}
          maxLength={2000}
          placeholder="Write a message…"
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              event.currentTarget.form?.requestSubmit();
            }
          }}
        />
        <button type="submit" disabled={sending || !draft.trim()} aria-label="Send message">
          {sending ? (
            <LoaderCircle className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </button>
      </form>
    </div>
  );
}

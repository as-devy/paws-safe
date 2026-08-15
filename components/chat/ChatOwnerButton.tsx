"use client";

import { MessageCircle } from "lucide-react";
import { useChat } from "./ChatProvider";

type ChatOwnerButtonProps = {
  ownerId: string;
  visitorId: string;
  petId?: string | null;
  petName?: string | null;
  peerName?: string;
  label?: string;
  className?: string;
};

export default function ChatOwnerButton({
  ownerId,
  visitorId,
  petId = null,
  petName = null,
  peerName,
  label = "Chat",
  className,
}: ChatOwnerButtonProps) {
  const { openThread } = useChat();

  if (!ownerId || !visitorId || ownerId === visitorId) return null;

  return (
    <button
      type="button"
      className={className ?? "chat-owner-btn"}
      onClick={() =>
        openThread({
          ownerId,
          visitorId,
          petId,
          petName,
          peerName,
        })
      }
    >
      <MessageCircle className="h-4 w-4" aria-hidden />
      {label}
    </button>
  );
}

export function ChatInboxButton({
  label = "Your Chat",
  className,
}: {
  label?: string;
  className?: string;
}) {
  const { hasReceived, openInbox } = useChat();

  if (!hasReceived) return null;

  return (
    <button
      type="button"
      className={className ?? "chat-owner-btn"}
      onClick={openInbox}
    >
      <MessageCircle className="h-4 w-4" aria-hidden />
      {label}
    </button>
  );
}

"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { LoaderCircle, MessageCircle, X } from "lucide-react";
import { loadChatInbox, markChatThreadRead } from "@/lib/actions";
import { formatRelativeTime } from "@/lib/notifications";
import type { ChatInbox, ChatInboxItem, OpenChatThread } from "@/lib/chat";
import { isSameChatPair } from "@/lib/chat";
import ChatThreadDialog from "./ChatThreadDialog";

type ChatContextValue = {
  hasReceived: boolean;
  activePeerId: string | null;
  openThread: (thread: OpenChatThread) => void;
  openInbox: () => void;
};

const ChatContext = createContext<ChatContextValue | null>(null);

export function useChat() {
  const value = useContext(ChatContext);
  if (!value) {
    throw new Error("useChat must be used within ChatProvider");
  }
  return value;
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase() || "PS";
}

export default function ChatProvider({ children }: { children: ReactNode }) {
  const [panel, setPanel] = useState<"closed" | "inbox" | "thread">("closed");
  const [active, setActive] = useState<OpenChatThread | null>(null);
  const [conversations, setConversations] = useState<ChatInboxItem[]>([]);
  const [viewerId, setViewerId] = useState<string | null>(null);
  const [hasReceived, setHasReceived] = useState(false);
  const [loadingInbox, setLoadingInbox] = useState(false);
  const panelRef = useRef(panel);
  const activeRef = useRef(active);
  panelRef.current = panel;
  activeRef.current = active;

  const applyInbox = useCallback((inbox: ChatInbox) => {
    const thread = activeRef.current;
    const viewingThread = panelRef.current === "thread" && thread;
    setViewerId(inbox.viewerId);
    setHasReceived(inbox.hasReceived);
    setConversations(
      inbox.conversations.map((item) =>
        viewingThread && isSameChatPair(item, thread)
          ? { ...item, unread: false }
          : item,
      ),
    );
  }, []);

  const refreshInbox = useCallback(async () => {
    const result = await loadChatInbox();
    if (!result.ok) return;
    applyInbox(result.inbox);
  }, [applyInbox]);

  useEffect(() => {
    let cancelled = false;
    let signedIn = true;

    async function load() {
      if (!signedIn) return;
      const result = await loadChatInbox();
      if (cancelled) return;
      if (!result.ok) {
        signedIn = false;
        return;
      }
      applyInbox(result.inbox);
    }

    void load();
    const timer = window.setInterval(() => {
      void load();
    }, 5000);

    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, [applyInbox]);

  useEffect(() => {
    if (panel !== "thread" || !active) return;

    void markChatThreadRead(active.ownerId, active.visitorId);

    const timer = window.setInterval(() => {
      void markChatThreadRead(active.ownerId, active.visitorId);
    }, 2500);

    return () => window.clearInterval(timer);
  }, [panel, active]);

  const openInbox = useCallback(() => {
    setActive(null);
    setPanel("inbox");
    setLoadingInbox(true);
    void refreshInbox().finally(() => setLoadingInbox(false));
  }, [refreshInbox]);

  const openThread = useCallback((thread: OpenChatThread) => {
    if (!thread.ownerId || !thread.visitorId || thread.ownerId === thread.visitorId) {
      return;
    }
    setActive(thread);
    setPanel("thread");
    setConversations((current) =>
      current.map((item) =>
        isSameChatPair(item, thread) ? { ...item, unread: false } : item,
      ),
    );
    void markChatThreadRead(thread.ownerId, thread.visitorId).then(() =>
      refreshInbox(),
    );
  }, [refreshInbox]);

  const closePanel = useCallback(() => {
    setPanel("closed");
    setActive(null);
  }, []);

  const activePeerId =
    panel === "thread" && active && viewerId
      ? viewerId === active.ownerId
        ? active.visitorId
        : active.ownerId
      : null;

  const value = useMemo(
    () => ({ hasReceived, activePeerId, openThread, openInbox }),
    [hasReceived, activePeerId, openThread, openInbox],
  );

  const unread = conversations.filter((item) => item.unread).length;

  return (
    <ChatContext.Provider value={value}>
      {children}

      {hasReceived && panel === "closed" ? (
        <button
          type="button"
          className="chat-dock__fab"
          aria-label={unread > 0 ? `Open chats, ${unread} unread` : "Open chats"}
          onClick={openInbox}
        >
          <MessageCircle className="h-6 w-6" aria-hidden />
          {unread > 0 ? (
            <span className="chat-dock__badge">{unread > 9 ? "9+" : unread}</span>
          ) : null}
        </button>
      ) : null}

      {panel === "inbox" ? (
        <ChatInboxDialog
          conversations={conversations}
          loading={loadingInbox && conversations.length === 0}
          onClose={closePanel}
          onOpenThread={openThread}
        />
      ) : null}

      {panel === "thread" && active ? (
        <ChatThreadDialog
          ownerId={active.ownerId}
          visitorId={active.visitorId}
          petId={active.petId}
          petName={active.petName}
          peerName={active.peerName}
          onClose={closePanel}
          onBack={hasReceived ? openInbox : undefined}
          onViewer={setViewerId}
        />
      ) : null}
    </ChatContext.Provider>
  );
}

function ChatInboxDialog({
  conversations,
  loading,
  onClose,
  onOpenThread,
}: {
  conversations: ChatInboxItem[];
  loading: boolean;
  onClose: () => void;
  onOpenThread: (thread: OpenChatThread) => void;
}) {
  const titleId = useId();

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="owner-chat" role="dialog" aria-modal="true" aria-labelledby={titleId}>
      <header className="owner-chat__head">
        <span className="owner-chat__icon" aria-hidden>
          <MessageCircle className="h-4 w-4" />
        </span>
        <div>
          <p className="owner-chat__kicker">Messages</p>
          <h2 id={titleId}>Chats</h2>
        </div>
        <button type="button" className="owner-chat__close" onClick={onClose} aria-label="Close chats">
          <X className="h-4 w-4" />
        </button>
      </header>

      <div className="chat-inbox">
        {loading ? (
          <p className="owner-chat__status">
            <LoaderCircle className="h-4 w-4 animate-spin" />
            Loading chats…
          </p>
        ) : conversations.length === 0 ? (
          <p className="owner-chat__empty">No conversations yet.</p>
        ) : (
          conversations.map((item) => {
            return (
              <button
                key={`${item.ownerId}:${item.visitorId}`}
                type="button"
                className={`chat-inbox__item${item.unread ? " is-unread" : " is-read"}`}
                aria-label={
                  item.unread
                    ? `Unread chat with ${item.peerName}`
                    : `Chat with ${item.peerName}`
                }
                onClick={() =>
                  onOpenThread({
                    ownerId: item.ownerId,
                    visitorId: item.visitorId,
                    petId: item.petId,
                    petName: item.petName,
                    peerName: item.peerName,
                  })
                }
              >
                <span className="chat-inbox__avatar" aria-hidden>
                  {initials(item.peerName)}
                </span>
                <span className="chat-inbox__copy">
                  <span className="chat-inbox__row">
                    <strong>{item.peerName}</strong>
                    <time dateTime={item.lastAt}>{formatRelativeTime(item.lastAt)}</time>
                  </span>
                  {item.petName ? (
                    <span className="chat-inbox__about">About {item.petName}</span>
                  ) : null}
                  <span className="chat-inbox__preview">{item.lastBody}</span>
                </span>
                {item.unread ? (
                  <span className="chat-inbox__unread" aria-hidden />
                ) : null}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}

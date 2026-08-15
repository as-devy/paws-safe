"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import {
  Bell,
  CheckCircle2,
  ClipboardList,
  MessageCircle,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import { useChat } from "@/components/chat/ChatProvider";
import {
  clearNotifications,
  markNotificationAsRead,
  markNotificationsRead,
  markPeerMessageNotificationsRead,
} from "@/lib/actions";
import {
  formatRelativeTime,
  type AppNotification,
} from "@/lib/notifications";
import {
  playNotificationSound,
  unlockNotificationSound,
} from "@/lib/notification-sound";

const typeMeta = {
  request: {
    icon: ClipboardList,
    label: "Request",
  },
  approval: {
    icon: CheckCircle2,
    label: "Approved",
  },
  denied: {
    icon: XCircle,
    label: "Declined",
  },
  verification: {
    icon: ShieldCheck,
    label: "Verification",
  },
  message: {
    icon: MessageCircle,
    label: "Message",
  },
} as const;

function isNotificationPayload(value: unknown): value is {
  notifications: AppNotification[];
} {
  return (
    typeof value === "object" &&
    value !== null &&
    Array.isArray((value as { notifications?: unknown }).notifications)
  );
}

export default function NotificationBell() {
  const { activePeerId } = useChat();
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<AppNotification[]>([]);
  const rootRef = useRef<HTMLDivElement>(null);
  const seenIdsRef = useRef<Set<string> | null>(null);
  const activePeerIdRef = useRef(activePeerId);
  const panelId = useId();
  activePeerIdRef.current = activePeerId;

  function ingest(notifications: AppNotification[]) {
    const peerId = activePeerIdRef.current;
    let suppressedUnread = false;
    const next = notifications.map((item) => {
      const fromOpenChat =
        item.type === "message" && Boolean(peerId) && item.actorId === peerId;
      if (fromOpenChat && item.unread) {
        suppressedUnread = true;
        return { ...item, unread: false };
      }
      return item;
    });

    if (seenIdsRef.current == null) {
      seenIdsRef.current = new Set(next.map((item) => item.id));
    } else {
      const isNew = (item: AppNotification) => !seenIdsRef.current!.has(item.id);
      const shouldAlert = next.some((item) => item.unread && isNew(item));
      for (const item of next) seenIdsRef.current.add(item.id);
      if (shouldAlert) playNotificationSound();
    }

    setItems(next);
    if (suppressedUnread && peerId) {
      void markPeerMessageNotificationsRead(peerId);
    }
  }

  useEffect(() => {
    let cancelled = false;
    let source: EventSource | null = null;
    let pollTimer: number | null = null;

    async function load() {
      try {
        const response = await fetch("/api/notifications", {
          cache: "no-store",
        });
        if (!response.ok) return;
        const payload: unknown = await response.json();
        if (!cancelled && isNotificationPayload(payload)) {
          ingest(payload.notifications);
        }
      } catch {
        /* keep current list */
      }
    }

    function startPolling() {
      if (pollTimer != null) return;
      pollTimer = window.setInterval(() => {
        if (document.visibilityState === "visible") void load();
      }, 4000);
    }

    void load();

    try {
      source = new EventSource("/api/notifications/stream");
      source.onmessage = (event) => {
        try {
          const payload: unknown = JSON.parse(event.data);
          if (!cancelled && isNotificationPayload(payload)) {
            ingest(payload.notifications);
          }
        } catch {
          /* ignore malformed frames */
        }
      };
      source.onerror = () => {
        source?.close();
        source = null;
        startPolling();
      };
    } catch {
      startPolling();
    }

    function onVisible() {
      if (document.visibilityState === "visible") void load();
    }

    document.addEventListener("visibilitychange", onVisible);

    return () => {
      cancelled = true;
      source?.close();
      if (pollTimer != null) window.clearInterval(pollTimer);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);

  useEffect(() => {
    unlockNotificationSound();
  }, []);

  useEffect(() => {
    if (!activePeerId) return;

    setItems((current) => {
      let changed = false;
      const next = current.map((item) => {
        if (item.type === "message" && item.actorId === activePeerId && item.unread) {
          changed = true;
          return { ...item, unread: false };
        }
        return item;
      });
      return changed ? next : current;
    });
    void markPeerMessageNotificationsRead(activePeerId);
  }, [activePeerId]);

  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const unread = items.filter((item) => item.unread).length;

  async function onOpenChange() {
    const next = !open;
    setOpen(next);
    if (next && unread > 0) {
      setItems((current) =>
        current.map((item) => ({ ...item, unread: false })),
      );
      await markNotificationsRead();
    }
  }

  async function onItemClick(item: AppNotification) {
    setOpen(false);
    if (item.unread) {
      setItems((current) =>
        current.map((entry) =>
          entry.id === item.id ? { ...entry, unread: false } : entry,
        ),
      );
      await markNotificationAsRead(item.id);
    }
  }

  async function onClearAll() {
    setItems([]);
    await clearNotifications();
  }

  return (
    <div className="notif-root" ref={rootRef}>
      <button
        type="button"
        className={`notif-trigger${open ? " is-open" : ""}`}
        aria-label={
          unread > 0 ? `Notifications, ${unread} unread` : "Notifications"
        }
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => void onOpenChange()}
      >
        <Bell className="h-[1.15rem] w-[1.15rem]" strokeWidth={2.25} />
        {unread > 0 && (
          <span className="notif-badge" aria-hidden>
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      <div
        id={panelId}
        className={`notif-panel${open ? " is-open" : ""}`}
        role="region"
        aria-label="Notifications"
        aria-hidden={!open}
      >
        <div className="notif-panel__head">
          <div>
            <p className="notif-panel__kicker">Inbox</p>
            <h3 className="notif-panel__title">Notifications</h3>
          </div>
          {items.length > 0 && (
            <button
              type="button"
              className="notif-panel__clear"
              onClick={() => void onClearAll()}
            >
              Clear all
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="notif-empty">
            <span className="notif-empty__icon" aria-hidden>
              <Bell className="h-5 w-5" />
            </span>
            <p className="notif-empty__title">You&apos;re all caught up</p>
            <p className="notif-empty__text">
              Pet requests, approvals, and verification updates will show up
              here.
            </p>
          </div>
        ) : (
          <ul className="notif-list">
            {items.map((item) => {
              const meta = typeMeta[item.type] ?? typeMeta.request;
              const Icon = meta.icon;
              return (
                <li key={item.id}>
                  <Link
                    href={item.href}
                    className={`notif-item${item.unread ? " is-unread" : ""}`}
                    onClick={() => void onItemClick(item)}
                  >
                    <span
                      className={`notif-item__icon notif-item__icon--${item.type}`}
                      aria-hidden
                    >
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="notif-item__body">
                      <span className="notif-item__meta">
                        <span className="notif-item__type">{meta.label}</span>
                        <time className="notif-item__time">
                          {formatRelativeTime(item.createdAt)}
                        </time>
                      </span>
                      <span className="notif-item__title">{item.title}</span>
                      <span className="notif-item__text">{item.body}</span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

import "server-only";

import { prisma } from "@/lib/prisma";
import type { AppNotification, NotificationType } from "@/lib/notifications";

const NOTIFICATION_TYPES = new Set<NotificationType>([
  "request",
  "approval",
  "denied",
  "verification",
  "message",
]);

function asNotificationType(value: string): NotificationType {
  return NOTIFICATION_TYPES.has(value as NotificationType)
    ? (value as NotificationType)
    : "request";
}

export function mapNotification(row: {
  id: bigint;
  type: string;
  title: string;
  body: string;
  href: string;
  created_at: Date;
  read_at: Date | null;
  actor_id?: string | null;
}): AppNotification {
  return {
    id: String(row.id),
    type: asNotificationType(row.type),
    title: row.title,
    body: row.body,
    href: row.href,
    createdAt: row.created_at.toISOString(),
    unread: row.read_at == null,
    actorId: row.actor_id ?? null,
  };
}

export async function fetchNotificationsForUser(
  userId: string,
  limit = 40,
): Promise<AppNotification[]> {
  const rows = await prisma.notifications.findMany({
    where: { user_id: userId },
    orderBy: { created_at: "desc" },
    take: limit,
    select: {
      id: true,
      type: true,
      title: true,
      body: true,
      href: true,
      created_at: true,
      read_at: true,
      actor_id: true,
    },
  });

  return rows.map(mapNotification);
}

export async function markNotificationRead(userId: string, notificationId: string) {
  await prisma.notifications.updateMany({
    where: {
      id: BigInt(notificationId),
      user_id: userId,
      read_at: null,
    },
    data: { read_at: new Date() },
  });
}

export async function markAllNotificationsRead(userId: string) {
  await prisma.notifications.updateMany({
    where: { user_id: userId, read_at: null },
    data: { read_at: new Date() },
  });
}

export async function markMessageNotificationsRead(
  userId: string,
  actorId?: string,
) {
  await prisma.notifications.updateMany({
    where: {
      recipient: { id: userId },
      type: "message",
      read_at: null,
      ...(actorId ? { actor: { id: actorId } } : {}),
    },
    data: { read_at: new Date() },
  });
}

export async function clearNotificationsForUser(userId: string) {
  await prisma.notifications.deleteMany({
    where: { user_id: userId },
  });
}

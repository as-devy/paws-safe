import "server-only";

import { prisma } from "@/lib/prisma";
import { userProfileHref } from "@/lib/pets";
import type { ChatInbox, ChatInboxItem, ChatThread } from "@/lib/chat";

export type { ChatInbox, ChatInboxItem, ChatMessage, ChatThread } from "@/lib/chat";

function displayName(
  username: string | null | undefined,
  email: string | null | undefined,
  fallback = "Member",
) {
  return username?.trim() || email?.split("@")[0] || fallback;
}

async function resolveChatPair(
  userId: string,
  ownerId: string,
  visitorId: string,
) {
  if (!ownerId || !visitorId || ownerId === visitorId) return null;
  if (userId !== ownerId && userId !== visitorId) return null;

  const existing = await prisma.messages.findFirst({
    where: {
      OR: [
        { owner_id: ownerId, visitor_id: visitorId },
        { owner_id: visitorId, visitor_id: ownerId },
      ],
    },
    orderBy: { created_at: "asc" },
    select: { owner_id: true, visitor_id: true },
  });

  return {
    ownerId: existing?.owner_id ?? ownerId,
    visitorId: existing?.visitor_id ?? visitorId,
  };
}

async function loadThreadAccess(
  userId: string,
  ownerId: string,
  visitorId: string,
) {
  if (!ownerId || !visitorId || ownerId === visitorId) return null;
  if (userId !== ownerId && userId !== visitorId) return null;

  const [owner, visitor] = await Promise.all([
    prisma.users.findUnique({
      where: { id: ownerId },
      select: { id: true, username: true, email: true },
    }),
    prisma.users.findUnique({
      where: { id: visitorId },
      select: {
        id: true,
        username: true,
        email: true,
        email_verified: true,
        role: true,
      },
    }),
  ]);

  if (!owner || !visitor) return null;

  return { owner, visitor, isOwner: userId === ownerId };
}

export async function loadChatThread(
  userId: string | null | undefined,
  ownerIdRaw: string,
  visitorIdRaw: string,
): Promise<{ ok: true; thread: ChatThread } | { ok: false; message: string }> {
  if (!userId) {
    return { ok: false, message: "You must be signed in to chat." };
  }

  const pair = await resolveChatPair(userId, ownerIdRaw, visitorIdRaw);
  if (!pair) {
    return { ok: false, message: "You cannot open this chat." };
  }

  const { ownerId, visitorId } = pair;
  const access = await loadThreadAccess(userId, ownerId, visitorId);
  if (!access) {
    return { ok: false, message: "You cannot open this chat." };
  }

  const messages = await prisma.messages.findMany({
    where: {
      OR: [
        { owner_id: ownerId, visitor_id: visitorId },
        { owner_id: visitorId, visitor_id: ownerId },
      ],
    },
    orderBy: { created_at: "asc" },
    take: 200,
    include: {
      pets: { select: { id: true, name: true } },
    },
  });

  const latestPet = [...messages].reverse().find((item) => item.pets)?.pets ?? null;
  const peer = access.isOwner
    ? displayName(access.visitor.username, access.visitor.email, "Member")
    : displayName(access.owner.username, access.owner.email, "Owner");

  return {
    ok: true,
    thread: {
      ownerId,
      visitorId,
      petId: latestPet?.id ?? null,
      petName: latestPet?.name ?? null,
      peerName: peer,
      viewerId: userId,
      messages: messages.map((item) => ({
        id: String(item.id),
        senderId: item.sender_id,
        body: item.body,
        createdAt: item.created_at.toISOString(),
      })),
    },
  };
}

export async function sendChatMessage(
  userId: string | null | undefined,
  ownerIdRaw: string,
  visitorIdRaw: string,
  bodyRaw: string,
  petId?: string | null,
): Promise<{ ok: true; thread: ChatThread } | { ok: false; message: string }> {
  if (!userId) {
    return { ok: false, message: "You must be signed in to chat." };
  }

  const body = bodyRaw.trim();
  if (!body) {
    return { ok: false, message: "Write a message first." };
  }
  if (body.length > 2000) {
    return { ok: false, message: "Messages can be up to 2,000 characters." };
  }

  const pair = await resolveChatPair(userId, ownerIdRaw, visitorIdRaw);
  if (!pair) {
    return { ok: false, message: "You cannot send this message." };
  }

  const { ownerId, visitorId } = pair;
  const access = await loadThreadAccess(userId, ownerId, visitorId);
  if (!access) {
    return { ok: false, message: "You cannot send this message." };
  }

  if (
    !access.isOwner &&
    !access.visitor.email_verified &&
    access.visitor.role !== "admin"
  ) {
    return { ok: false, message: "Verify your email before chatting." };
  }

  const sender = access.isOwner ? access.owner : access.visitor;
  const recipientId = access.isOwner ? visitorId : ownerId;
  const senderName = displayName(sender.username, sender.email, "Someone");
  const preview = body.length > 80 ? `${body.slice(0, 77)}…` : body;

  let pet: { id: string; name: string } | null = null;
  if (petId) {
    const row = await prisma.pets.findUnique({
      where: { id: petId },
      select: { id: true, name: true, owner_id: true },
    });
    if (row && (row.owner_id === ownerId || row.owner_id === visitorId)) {
      pet = { id: row.id, name: row.name };
    }
  }

  const href = access.isOwner
    ? userProfileHref(ownerId)
    : "/profile";

  try {
    await prisma.$transaction(async (tx) => {
      await tx.messages.create({
        data: {
          body,
          owner: { connect: { id: ownerId } },
          visitor: { connect: { id: visitorId } },
          sender: { connect: { id: userId } },
          ...(pet?.id ? { pets: { connect: { id: pet.id } } } : {}),
        },
      });

      await tx.notifications.create({
        data: {
          user_id: recipientId,
          type: "message",
          title: pet
            ? `${senderName} sent a message about ${pet.name}`
            : `${senderName} sent you a message`,
          body: preview,
          href,
          pet_id: pet?.id ?? null,
          actor_id: userId,
        },
      });
    });
  } catch (error) {
    console.error("Failed to send chat message:", error);
    return { ok: false, message: "Could not send that message." };
  }

  return loadChatThread(userId, ownerId, visitorId);
}

export async function loadChatInbox(
  userId: string | null | undefined,
): Promise<{ ok: true; inbox: ChatInbox } | { ok: false; message: string }> {
  if (!userId) {
    return { ok: false, message: "You must be signed in to chat." };
  }

  const [received, rows, unreadNotes] = await Promise.all([
    prisma.messages.findFirst({
      where: {
        sender: { isNot: { id: userId } },
        OR: [{ owner: { id: userId } }, { visitor: { id: userId } }],
      },
      select: { id: true },
    }),
    prisma.messages.findMany({
      where: {
        OR: [{ owner: { id: userId } }, { visitor: { id: userId } }],
      },
      orderBy: { created_at: "desc" },
      take: 400,
      include: {
        owner: { select: { id: true, username: true, email: true } },
        visitor: { select: { id: true, username: true, email: true } },
        pets: { select: { id: true, name: true } },
      },
    }),
    prisma.notifications.findMany({
      where: {
        recipient: { id: userId },
        type: "message",
        read_at: null,
      },
      select: { actor: { select: { id: true } } },
    }),
  ]);

  const unreadActors = new Set(
    unreadNotes
      .map((note) => note.actor?.id)
      .filter((id): id is string => Boolean(id)),
  );

  const seen = new Set<string>();
  const conversations: ChatInboxItem[] = [];

  for (const row of rows) {
    const key = [row.owner.id, row.visitor.id].sort().join(":");
    if (seen.has(key)) continue;
    seen.add(key);

    const isOwner = row.owner.id === userId;
    const peer = isOwner ? row.visitor : row.owner;

    conversations.push({
      ownerId: row.owner.id,
      visitorId: row.visitor.id,
      peerId: peer.id,
      peerName: displayName(peer.username, peer.email, isOwner ? "Member" : "Owner"),
      petId: row.pets?.id ?? null,
      petName: row.pets?.name ?? null,
      lastBody: row.body,
      lastAt: row.created_at.toISOString(),
      lastSenderId: row.sender_id,
      unread: row.sender_id !== userId && unreadActors.has(peer.id),
    });
  }

  return {
    ok: true,
    inbox: {
      viewerId: userId,
      hasReceived: Boolean(received),
      conversations,
    },
  };
}

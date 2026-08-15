export type ChatMessage = {
  id: string;
  senderId: string;
  body: string;
  createdAt: string;
};

export type ChatThread = {
  ownerId: string;
  visitorId: string;
  petId: string | null;
  petName: string | null;
  peerName: string;
  viewerId: string;
  messages: ChatMessage[];
};

export type ChatInboxItem = {
  ownerId: string;
  visitorId: string;
  peerId: string;
  peerName: string;
  petId: string | null;
  petName: string | null;
  lastBody: string;
  lastAt: string;
  lastSenderId: string;
  unread: boolean;
};

export type ChatInbox = {
  viewerId: string;
  hasReceived: boolean;
  conversations: ChatInboxItem[];
};

export type OpenChatThread = {
  ownerId: string;
  visitorId: string;
  petId?: string | null;
  petName?: string | null;
  peerName?: string;
};

export function isSameChatPair(
  a: { ownerId: string; visitorId: string },
  b: { ownerId: string; visitorId: string },
) {
  return (
    (a.ownerId === b.ownerId && a.visitorId === b.visitorId) ||
    (a.ownerId === b.visitorId && a.visitorId === b.ownerId)
  );
}

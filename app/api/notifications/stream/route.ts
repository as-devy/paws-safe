import { Client } from "pg";
import { auth } from "@/auth";
import { fetchNotificationsForUser } from "@/lib/notifications-server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function sse(data: unknown) {
  return `data: ${JSON.stringify(data)}\n\n`;
}

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  const userId = session.user.id;
  const encoder = new TextEncoder();
  const listenUrl = process.env.DIRECT_URL || process.env.DATABASE_URL;

  const stream = new ReadableStream({
    async start(controller) {
      let closed = false;
      let listener: Client | null = null;
      let pollTimer: ReturnType<typeof setInterval> | null = null;
      let pingTimer: ReturnType<typeof setInterval> | null = null;

      const send = async () => {
        if (closed) return;
        const notifications = await fetchNotificationsForUser(userId);
        controller.enqueue(encoder.encode(sse({ notifications })));
      };

      const cleanup = async () => {
        if (closed) return;
        closed = true;
        if (pollTimer) clearInterval(pollTimer);
        if (pingTimer) clearInterval(pingTimer);
        if (listener) {
          try {
            await listener.end();
          } catch {
            /* ignore */
          }
        }
        try {
          controller.close();
        } catch {
          /* ignore */
        }
      };

      request.signal.addEventListener("abort", () => {
        void cleanup();
      });

      await send();

      pingTimer = setInterval(() => {
        if (closed) return;
        try {
          controller.enqueue(encoder.encode(": ping\n\n"));
        } catch {
          void cleanup();
        }
      }, 20000);

      let listening = false;
      if (listenUrl) {
        try {
          listener = new Client({
            connectionString: listenUrl,
            ssl: { rejectUnauthorized: false },
          });
          await listener.connect();
          await listener.query("LISTEN user_notifications");
          listener.on("notification", (message) => {
            if (message.channel !== "user_notifications") return;
            try {
              const payload = JSON.parse(message.payload ?? "{}") as {
                user_id?: string;
              };
              if (payload.user_id === userId) {
                void send();
              }
            } catch {
              void send();
            }
          });
          listener.on("error", () => {
            listening = false;
          });
          listening = true;
        } catch (error) {
          console.error("Notification LISTEN failed, using poll:", error);
          listening = false;
          try {
            await listener?.end();
          } catch {
            /* ignore */
          }
          listener = null;
        }
      }

      pollTimer = setInterval(() => {
        void send();
      }, listening ? 15000 : 4000);
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}

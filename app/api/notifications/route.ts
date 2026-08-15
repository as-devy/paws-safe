import { auth } from "@/auth";
import { fetchNotificationsForUser } from "@/lib/notifications-server";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ notifications: [] }, { status: 401 });
  }

  const notifications = await fetchNotificationsForUser(session.user.id);
  return Response.json({ notifications });
}

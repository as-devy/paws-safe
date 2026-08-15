import { auth } from "@/auth";
import HeaderClient from "@/components/layout/HeaderClient";
import { prisma } from "@/lib/prisma";

type HeaderProps = {
  activeHref?: string;
};

export default async function Header({ activeHref }: HeaderProps = {}) {
  const session = await auth();
  let isAdmin = session?.user?.role === "admin";

  if (session?.user?.id && !isAdmin) {
    try {
      const row = await prisma.users.findUnique({
        where: { id: session.user.id },
        select: { role: true },
      });
      isAdmin = row?.role === "admin";
    } catch {
      isAdmin = false;
    }
  }

  return (
    <HeaderClient
      isLoggedIn={Boolean(session?.user)}
      emailVerified={Boolean(session?.user?.isEmailVerified)}
      isAdmin={isAdmin}
      activeHref={activeHref}
    />
  );
}

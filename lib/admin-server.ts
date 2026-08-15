import "server-only";

import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { normalizeCategory } from "@/lib/pets";

export type AdminUserRow = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  city: string | null;
  country: string | null;
  role: "admin" | "user";
  emailVerified: boolean;
  verification: string;
  listingCount: number;
  requestCount: number;
  memberSince: string;
};

export type AdminPetRow = {
  id: string;
  name: string;
  category: string;
  status: "adoption" | "foster";
  emergency: boolean;
  requested: boolean;
  city: string;
  country: string;
  img: string;
  ownerId: string;
  ownerName: string;
  ownerEmail: string | null;
  requestCount: number;
  createdAt: string;
};

export type AdminDashboardData = {
  stats: {
    users: number;
    pets: number;
    adoption: number;
    foster: number;
    urgent: number;
    matched: number;
    admins: number;
  };
  users: AdminUserRow[];
  pets: AdminPetRow[];
};

export async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/admin");
  }

  const user = await prisma.users.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });

  if (user?.role !== "admin") {
    redirect("/");
  }

  return session;
}

export async function userHasAdminRole(userId: string | null | undefined) {
  if (!userId) return false;
  const user = await prisma.users.findUnique({
    where: { id: userId },
    select: { role: true },
  });
  return user?.role === "admin";
}

function displayName(username: string | null, email: string | null) {
  return username?.trim() || email?.split("@")[0] || "Member";
}

export async function fetchAdminDashboard(): Promise<AdminDashboardData> {
  const [userRows, petRows] = await Promise.all([
    prisma.users.findMany({
      orderBy: { created_at: "desc" },
      select: {
        id: true,
        username: true,
        email: true,
        phone: true,
        city: true,
        country: true,
        role: true,
        email_verified: true,
        verification_status: true,
        created_at: true,
        _count: {
          select: {
            pets: true,
            pet_requests: true,
          },
        },
      },
    }),
    prisma.pets.findMany({
      orderBy: { created_at: "desc" },
      include: {
        users: {
          select: { id: true, username: true, email: true },
        },
        _count: { select: { pet_requests: true } },
      },
    }),
  ]);

  const users: AdminUserRow[] = userRows.map((user) => ({
    id: user.id,
    name: displayName(user.username, user.email),
    email: user.email,
    phone: user.phone,
    city: user.city,
    country: user.country,
    role: user.role === "admin" ? "admin" : "user",
    emailVerified: Boolean(user.email_verified),
    verification: user.verification_status ?? "pending",
    listingCount: user._count.pets,
    requestCount: user._count.pet_requests,
    memberSince: user.created_at.toISOString(),
  }));

  const pets: AdminPetRow[] = petRows.map((pet) => ({
    id: pet.id,
    name: pet.name,
    category: normalizeCategory(pet.category),
    status: pet.status,
    emergency: pet.emergency,
    requested: pet.requested,
    city: pet.city ?? "",
    country: pet.country ?? "",
    img: pet.img ?? "",
    ownerId: pet.users.id,
    ownerName: displayName(pet.users.username, pet.users.email),
    ownerEmail: pet.users.email,
    requestCount: pet._count.pet_requests,
    createdAt: pet.created_at.toISOString(),
  }));

  return {
    stats: {
      users: users.length,
      pets: pets.length,
      adoption: pets.filter((pet) => pet.status === "adoption").length,
      foster: pets.filter((pet) => pet.status === "foster").length,
      urgent: pets.filter((pet) => pet.emergency).length,
      matched: pets.filter((pet) => pet.requested).length,
      admins: users.filter((user) => user.role === "admin").length,
    },
    users,
    pets,
  };
}

export type AdminUserRecord = {
  id: string;
  username: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  role: "admin" | "user";
  emailVerified: boolean;
};

export async function fetchAdminUser(userId: string): Promise<AdminUserRecord | null> {
  const user = await prisma.users.findUnique({
    where: { id: userId },
    select: {
      id: true,
      username: true,
      email: true,
      phone: true,
      country: true,
      city: true,
      role: true,
      email_verified: true,
    },
  });

  if (!user) return null;

  return {
    id: user.id,
    username: user.username?.trim() || "",
    email: user.email ?? "",
    phone: user.phone ?? "",
    country: user.country ?? "",
    city: user.city ?? "",
    role: user.role === "admin" ? "admin" : "user",
    emailVerified: Boolean(user.email_verified),
  };
}

export type AdminMutationResult = { ok: true } | { ok: false; message: string };

export async function updateAdminUser(
  actorId: string,
  input: {
    userId: string;
    username: string;
    email: string;
    phone: string;
    country: string;
    city: string;
    role: "admin" | "user";
    emailVerified: boolean;
  },
): Promise<AdminMutationResult> {
  if (!(await userHasAdminRole(actorId))) {
    return { ok: false, message: "Only admins can edit users." };
  }

  const userId = input.userId.trim();
  const existing = await prisma.users.findUnique({
    where: { id: userId },
    select: { id: true, role: true },
  });
  if (!existing) {
    return { ok: false, message: "This account no longer exists." };
  }

  if (existing.role === "admin" && input.role !== "admin") {
    const adminCount = await prisma.users.count({
      where: { role: "admin" },
    });
    if (adminCount <= 1) {
      return { ok: false, message: "Keep at least one admin on the site." };
    }
    if (existing.id === actorId) {
      return { ok: false, message: "You cannot remove your own admin access." };
    }
  }

  try {
    await prisma.users.update({
      where: { id: userId },
      data: {
        username: input.username.trim() || null,
        email: input.email.trim().toLowerCase() || null,
        phone: input.phone.trim() || null,
        country: input.country.trim() || null,
        city: input.city.trim() || null,
        role: input.role,
        email_verified: input.emailVerified,
      },
    });
    return { ok: true };
  } catch (error) {
    console.error("Failed to update user:", error);
    return { ok: false, message: "Could not save this account. Email may already be in use." };
  }
}

export async function deleteAdminUser(
  actorId: string,
  userId: string,
): Promise<AdminMutationResult> {
  if (!(await userHasAdminRole(actorId))) {
    return { ok: false, message: "Only admins can delete users." };
  }

  const id = userId.trim();
  if (!id) {
    return { ok: false, message: "Missing user." };
  }
  if (id === actorId) {
    return { ok: false, message: "You cannot delete your own account." };
  }

  const existing = await prisma.users.findUnique({
    where: { id },
    select: { id: true, role: true },
  });
  if (!existing) {
    return { ok: false, message: "This account no longer exists." };
  }

  if (existing.role === "admin") {
    const adminCount = await prisma.users.count({
      where: { role: "admin" },
    });
    if (adminCount <= 1) {
      return { ok: false, message: "Keep at least one admin on the site." };
    }
  }

  try {
    await prisma.users.delete({ where: { id } });
    return { ok: true };
  } catch (error) {
    console.error("Failed to delete user:", error);
    return { ok: false, message: "Could not delete this account." };
  }
}

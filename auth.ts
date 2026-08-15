import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

async function getUser(email: string) {
  try {
    return await prisma.users.findFirst({
      where: { email: { equals: email, mode: "insensitive" } },
    });
  } catch (error) {
    console.error("Failed to fetch user:", error);
    throw new Error("Failed to fetch user.");
  }
}

function isProfileComplete(user: {
  phone: string | null;
  country: string | null;
  city: string | null;
}) {
  return Boolean(user.phone && user.country && user.city);
}

export const { auth, handlers, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Google,
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = String(credentials?.email ?? "").trim().toLowerCase();
        const password = String(credentials?.password ?? "");

        if (!email || password.length < 6) {
          console.log("Invalid credentials: missing fields");
          return null;
        }

        const user = await getUser(email);
        if (!user?.password) return null;

        const passwordsMatch = await bcrypt.compare(password, user.password);
        if (!passwordsMatch) {
          console.log("Invalid credentials");
          return null;
        }

        return {
          id: user.id,
          email: user.email ?? undefined,
          name: user.username ?? undefined,
          profileComplete: isProfileComplete(user),
          isEmailVerified: Boolean(user.email_verified),
          role: user.role === "admin" ? "admin" : "user",
        };
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async signIn({ user, account }) {
      if (account?.provider !== "google") return true;
      if (!user.email) return false;

      try {
        // Avoid upsert: live DB may lack a unique constraint on email (42P10).
        let dbUser = await prisma.users.findFirst({
          where: { email: user.email },
        });

        if (!dbUser) {
          dbUser = await prisma.users.create({
            data: {
              email: user.email,
              username: user.name ?? user.email.split("@")[0],
              password: null,
              email_verified: true,
            },
          });
        } else if (user.name && dbUser.username !== user.name) {
          dbUser = await prisma.users.update({
            where: { id: dbUser.id },
            data: {
              username: user.name,
              email_verified: true,
            },
          });
        } else if (!dbUser.email_verified) {
          dbUser = await prisma.users.update({
            where: { id: dbUser.id },
            data: { email_verified: true },
          });
        }

        user.id = dbUser.id;
        user.profileComplete = isProfileComplete(dbUser);
        user.isEmailVerified = true;
        user.role = dbUser.role === "admin" ? "admin" : "user";
        return true;
      } catch (error) {
        console.error("Google sign-in failed to sync user:", error);
        return false;
      }
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.profileComplete = user.profileComplete ?? false;
        token.isEmailVerified = user.isEmailVerified ?? false;
        token.role = user.role === "admin" ? "admin" : "user";
      }

      if (token.id) {
        try {
          const row = await prisma.users.findUnique({
            where: { id: String(token.id) },
            select: { email_verified: true, role: true },
          });
          if (row) {
            token.isEmailVerified = Boolean(row.email_verified);
            token.role = row.role === "admin" ? "admin" : "user";
          }
        } catch {
          /* keep previous token value */
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.profileComplete = Boolean(token.profileComplete);
        session.user.isEmailVerified = Boolean(token.isEmailVerified);
        session.user.role = token.role === "admin" ? "admin" : "user";
      }
      return session;
    },
  },
});

import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      profileComplete?: boolean;
      isEmailVerified?: boolean;
      role?: "admin" | "user";
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    profileComplete?: boolean;
    isEmailVerified?: boolean;
    role?: "admin" | "user";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    profileComplete?: boolean;
    isEmailVerified?: boolean;
    role?: "admin" | "user";
  }
}

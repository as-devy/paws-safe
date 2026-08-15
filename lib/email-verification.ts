import "server-only";

import { prisma } from "@/lib/prisma";
import { createSupabaseAnon, emailRedirectTo } from "@/lib/supabase";

export async function sendSignupVerificationEmail(
  email: string,
  password: string,
) {
  const supabase = createSupabaseAnon();
  if (!supabase) {
    console.error(
      "Supabase URL/anon key missing — could not send verification email.",
    );
    return { ok: false, message: "Email service is not configured." };
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: emailRedirectTo(),
    },
  });

  if (error) {
    console.error("Supabase signUp email failed:", error.message);
    return { ok: false, message: error.message };
  }

  return { ok: true };
}

export async function resendSignupVerificationEmail(email: string) {
  const supabase = createSupabaseAnon();
  if (!supabase) {
    return { ok: false, message: "Email service is not configured." };
  }

  const { error } = await supabase.auth.resend({
    type: "signup",
    email,
    options: {
      emailRedirectTo: emailRedirectTo(),
    },
  });

  if (error) {
    console.error("Supabase resend failed:", error.message);
    return { ok: false, message: error.message };
  }

  return { ok: true };
}

export async function markEmailVerified(email: string) {
  const normalized = email.trim().toLowerCase();
  if (!normalized) return false;

  const result = await prisma.users.updateMany({
    where: { email: { equals: normalized, mode: "insensitive" } },
    data: { email_verified: true },
  });

  return result.count > 0;
}

export async function confirmEmailWithTokenHash(
  tokenHash: string,
  type: string,
) {
  const supabase = createSupabaseAnon();
  if (!supabase) {
    return { ok: false, message: "Email service is not configured." };
  }

  const otpType =
    type === "signup" || type === "email" || type === "email_change"
      ? type
      : "email";

  const { data, error } = await supabase.auth.verifyOtp({
    type: otpType,
    token_hash: tokenHash,
  });

  if (error || !data.user?.email) {
    return {
      ok: false,
      message: error?.message || "This verification link is invalid or expired.",
    };
  }

  await markEmailVerified(data.user.email);
  return { ok: true };
}

export async function confirmEmailWithCode(code: string) {
  const supabase = createSupabaseAnon();
  if (!supabase) {
    return { ok: false, message: "Email service is not configured." };
  }

  const { data, error } = await supabase.auth.exchangeCodeForSession(code);
  if (error || !data.user?.email) {
    return {
      ok: false,
      message: error?.message || "This verification link is invalid or expired.",
    };
  }

  await markEmailVerified(data.user.email);
  return { ok: true };
}

export async function confirmEmailWithAccessToken(accessToken: string) {
  const supabase = createSupabaseAnon();
  if (!supabase) {
    return { ok: false, message: "Email service is not configured." };
  }

  const { data, error } = await supabase.auth.getUser(accessToken);
  if (error || !data.user?.email) {
    return {
      ok: false,
      message: error?.message || "This verification link is invalid or expired.",
    };
  }

  await markEmailVerified(data.user.email);
  return { ok: true };
}

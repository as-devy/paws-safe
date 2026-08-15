'use server';

import { z } from 'zod';
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@/lib/generated/prisma/client";
import { redirect, unstable_rethrow } from 'next/navigation';
import { auth, signIn } from "@/auth";
import { AuthError } from "next-auth";
import { revalidatePath } from "next/cache";
import {
    createPet,
    createPetRequest,
    deleteOwnedPet,
    updateOwnedPet,
    type CreatePetState,
    type RequestPetState,
} from "@/lib/pets-server";
import {
    respondToOwnedRequest,
    withdrawOwnedRequest,
} from "@/lib/requests-server";
import {
    loadChatInbox as fetchChatInbox,
    loadChatThread,
    sendChatMessage as persistChatMessage,
} from "@/lib/chat-server";
import {
    clearNotificationsForUser,
    markAllNotificationsRead,
    markMessageNotificationsRead,
    markNotificationRead,
} from "@/lib/notifications-server";
import {
    confirmEmailWithAccessToken,
    confirmEmailWithCode,
    confirmEmailWithTokenHash,
    resendSignupVerificationEmail,
    sendSignupVerificationEmail,
} from "@/lib/email-verification";
import {
    deleteAdminUser,
    updateAdminUser,
    userHasAdminRole,
} from "@/lib/admin-server";
import { petDetailHref } from "@/lib/pets";

function safeInternalPath(value: string | null | undefined) {
    if (!value) return "/";
    if (!value.startsWith("/") || value.startsWith("//") || value.includes("\\")) {
        return "/";
    }
    return value;
}

const CreateUserSchema = z.object({
    name: z
        .string({
            error: (issue) =>
                issue.input === undefined || issue.input === null
                    ? "Name is required"
                    : "Name must be a string",
        })
        .min(1, { error: "Name is required" }),
    email: z.email({ error: "Invalid email address" }),
    password: z
        .string({
            error: (issue) =>
                issue.input === undefined || issue.input === null
                    ? "Password is required"
                    : "Password must be a string",
        })
        .min(6, { error: "Password must be at least 6 characters" }),
    phone: z
        .string({
            error: (issue) =>
                issue.input === undefined || issue.input === null
                    ? "Phone number is required"
                    : "Phone number must be a string",
        })
        .min(1, { error: "Phone number is required" }),
    country: z
        .string({
            error: (issue) =>
                issue.input === undefined || issue.input === null
                    ? "Country is required"
                    : "Country must be a string",
        })
        .min(1, { error: "Country is required" }),
    city: z
        .string({
            error: (issue) =>
                issue.input === undefined || issue.input === null
                    ? "City is required"
                    : "City must be a string",
        })
        .min(1, { error: "City is required" }),
});

export type State = {
    errors?: {
        name?: string[];
        email?: string[];
        password?: string[];
        phone?: string[];
        country?: string[];
        city?: string[];
    };
    message?: string | null;
    values?: {
        name?: string;
        email?: string;
        password?: string;
        phone?: string;
        countryCode?: string;
        country?: string;
        city?: string;
    };
};

export async function signUp(
    prevState: State | undefined,
    formData: FormData,
): Promise<State> {
    const countryCode = String(formData.get("countryCode") ?? "+20").trim();
    const phoneRaw = String(formData.get("phone") ?? "").trim();

    const localPhone = phoneRaw.replace(/^0+/, "").replace(/\s+/g, "");

    const fullPhone = `${countryCode}${localPhone}`;

    const validatedFields = CreateUserSchema.safeParse({
        name: formData.get("name"),
        email: formData.get("email"),
        password: formData.get("password"),
        phone: fullPhone,
        country: formData.get("country"),
        city: formData.get("city"),
    });

    if (!validatedFields.success) {
        return {
            errors: z.flattenError(validatedFields.error).fieldErrors,
            message: "Missing fields. Failed to create account.",
            values: {
                name: String(formData.get("name") ?? ""),
                email: String(formData.get("email") ?? ""),
                password: String(formData.get("password") ?? ""),
                phone: phoneRaw,
                countryCode,
                country: String(formData.get("country") ?? ""),
                city: String(formData.get("city") ?? ""),
            },
        };
    }

    const { name, email, password, phone, country, city } = validatedFields.data;
    const normalizedEmail = email.trim().toLowerCase();
    const formValues = {
        name,
        email: normalizedEmail,
        password,
        phone: phoneRaw,
        countryCode,
        country,
        city,
    };

    try {
        const existing = await prisma.users.findFirst({
            where: { email: { equals: normalizedEmail, mode: "insensitive" } },
            select: { id: true },
        });

        if (existing) {
            return {
                message: "An account with this email already exists. Log in instead.",
                values: formValues,
            };
        }

        const hashed = await bcrypt.hash(password, 10);

        await prisma.users.create({
            data: {
                username: name,
                email: normalizedEmail,
                password: hashed,
                phone,
                country,
                city,
                email_verified: false,
            },
        });
    } catch (error) {
        console.error("Failed to create account:", error);
        if (
            error instanceof Prisma.PrismaClientKnownRequestError &&
            error.code === "P2002"
        ) {
            return {
                message: "An account with this email already exists. Log in instead.",
                values: formValues,
            };
        }
        return {
            message: "Database error: failed to create account.",
            values: formValues,
        };
    }

    await sendSignupVerificationEmail(normalizedEmail, password);

    try {
        await signIn("credentials", {
            email: normalizedEmail,
            password,
            redirect: false,
        });
    } catch (error) {
        unstable_rethrow(error);
        if (error instanceof AuthError) {
            return {
                message: "Account created, but sign-in failed. Please log in.",
            };
        }
        throw error;
    }

    redirect("/verify-email");
}

const CompleteProfileSchema = z.object({
    phone: z
        .string({
            error: (issue) =>
                issue.input === undefined || issue.input === null
                    ? "Phone number is required"
                    : "Phone number must be a string",
        })
        .min(1, { error: "Phone number is required" }),
    country: z
        .string({
            error: (issue) =>
                issue.input === undefined || issue.input === null
                    ? "Country is required"
                    : "Country must be a string",
        })
        .min(1, { error: "Country is required" }),
    city: z
        .string({
            error: (issue) =>
                issue.input === undefined || issue.input === null
                    ? "City is required"
                    : "City must be a string",
        })
        .min(1, { error: "City is required" }),
});

export type CompleteProfileState = {
    errors?: {
        phone?: string[];
        country?: string[];
        city?: string[];
    };
    message?: string | null;
    values?: {
        phone?: string;
        countryCode?: string;
        country?: string;
        city?: string;
    };
};

export async function completeProfile(
    prevState: CompleteProfileState,
    formData: FormData,
) {
    const session = await auth();
    if (!session?.user?.id) {
        return { message: "You must be signed in to complete your profile." };
    }

    const countryCode = String(formData.get("countryCode") ?? "+20").trim();
    const phoneRaw = String(formData.get("phone") ?? "").trim();
    const localPhone = phoneRaw.replace(/^0+/, "").replace(/\s+/g, "");
    const fullPhone = `${countryCode}${localPhone}`;

    const validatedFields = CompleteProfileSchema.safeParse({
        phone: fullPhone,
        country: formData.get("country"),
        city: formData.get("city"),
    });

    if (!validatedFields.success) {
        return {
            errors: z.flattenError(validatedFields.error).fieldErrors,
            message: "Missing fields. Failed to update profile.",
            values: {
                phone: phoneRaw,
                countryCode,
                country: String(formData.get("country") ?? ""),
                city: String(formData.get("city") ?? ""),
            },
        };
    }

    try {
        await prisma.users.update({
            where: { id: session.user.id },
            data: {
                phone: validatedFields.data.phone,
                country: validatedFields.data.country,
                city: validatedFields.data.city,
            },
        });
    } catch {
        return {
            message: "Database error: failed to update profile.",
        };
    }

    redirect("/");
}

export type LoginState = {
    errors?: {
        email?: string[];
        password?: string[];
    };
    message?: string | null;
    values?: {
        email?: string;
        password?: string;
    };
};

const LoginSchema = z.object({
    email: z.email({ error: "Invalid email address" }),
    password: z
        .string({
            error: (issue) =>
                issue.input === undefined || issue.input === null
                    ? "Password is required"
                    : "Password must be a string",
        })
        .min(1, { error: "Password is required" }),
});

export async function authenticate(
    prevState: LoginState | undefined,
    formData: FormData,
): Promise<LoginState> {
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");

    const validatedFields = LoginSchema.safeParse({ email, password });

    if (!validatedFields.success) {
        return {
            errors: z.flattenError(validatedFields.error).fieldErrors,
            message: "Missing fields. Failed to log in.",
            values: { email, password },
        };
    }

    try {
        await signIn("credentials", {
            email: validatedFields.data.email.trim().toLowerCase(),
            password: validatedFields.data.password,
            redirect: false,
        });
    } catch (error) {
        unstable_rethrow(error);
        if (error instanceof AuthError) {
            return {
                message: "Invalid email or password.",
                values: { email, password },
            };
        }
        throw error;
    }

    const next = safeInternalPath(String(formData.get("callbackUrl") ?? "/"));
    redirect(next);
}

export type { CreatePetState };

export async function postPet(
    prevState: CreatePetState | undefined,
    input: unknown,
): Promise<CreatePetState> {
    const session = await auth();
    const result = await createPet(session?.user?.id, input);

    if (result.pet) {
        redirect(petDetailHref(result.pet));
    }

    return result;
}

export async function updatePet(
    prevState: CreatePetState | undefined,
    input: unknown,
): Promise<CreatePetState> {
    const session = await auth();
    const result = await updateOwnedPet(session?.user?.id, input);

    if (result.pet) {
        revalidatePath("/profile");
        revalidatePath("/adoption");
        revalidatePath("/foster");
        revalidatePath("/admin");
        revalidatePath(petDetailHref(result.pet));
        const returnTo =
            input && typeof input === "object" && "returnTo" in input
                ? String((input as { returnTo?: unknown }).returnTo ?? "")
                : "";
        redirect(returnTo === "/admin" ? "/admin" : "/profile");
    }

    return result;
}

export type DeletePetState = {
    message?: string | null;
};

const DELETE_REDIRECTS = new Set(["/profile", "/adoption", "/foster", "/admin"]);

export async function deletePet(
    _prevState: DeletePetState | undefined,
    formData: FormData,
): Promise<DeletePetState> {
    const session = await auth();
    const petId = String(formData.get("petId") ?? "");
    const result = await deleteOwnedPet(session?.user?.id, petId);

    if (!result.ok) {
        return { message: result.message };
    }

    const next = String(formData.get("next") ?? "");
    revalidatePath("/adoption");
    revalidatePath("/foster");
    revalidatePath("/profile");
    revalidatePath("/admin");
    redirect(DELETE_REDIRECTS.has(next) ? next : result.listingHref);
}

export type { RequestPetState };

export async function requestPet(
    _prevState: RequestPetState | undefined,
    formData: FormData,
): Promise<RequestPetState> {
    const session = await auth();
    const result = await createPetRequest(session?.user?.id, formData);

    if (!result.ok || !result.petId) {
        return result;
    }

    revalidatePath("/adoption");
    revalidatePath("/foster");
    revalidatePath("/profile");
    revalidatePath(petDetailHref(result.petId));
    redirect(petDetailHref(result.petId));
}

export type ReviewRequestState = {
    message?: string | null;
};

export async function reviewPetRequest(
    _prevState: ReviewRequestState | undefined,
    formData: FormData,
): Promise<ReviewRequestState> {
    const session = await auth();
    const requestId = String(formData.get("requestId") ?? "");
    const action = String(formData.get("action") ?? "");

    if (action !== "approved" && action !== "rejected") {
        return { message: "Choose approve or decline." };
    }

    const result = await respondToOwnedRequest(
        session?.user?.id,
        requestId,
        action,
    );

    if (!result.ok) {
        return { message: result.message };
    }

    revalidatePath("/profile");
    revalidatePath("/adoption");
    revalidatePath("/foster");
    return { message: null };
}

export async function withdrawPetRequest(
    _prevState: ReviewRequestState | undefined,
    formData: FormData,
): Promise<ReviewRequestState> {
    const session = await auth();
    const requestId = String(formData.get("requestId") ?? "");
    const result = await withdrawOwnedRequest(session?.user?.id, requestId);

    if (!result.ok) {
        return { message: result.message };
    }

    revalidatePath("/profile");
    revalidatePath("/adoption");
    revalidatePath("/foster");
    return { message: null };
}

export async function markNotificationAsRead(notificationId: string) {
    const session = await auth();
    if (!session?.user?.id) return;
    await markNotificationRead(session.user.id, notificationId);
}

export async function markNotificationsRead() {
    const session = await auth();
    if (!session?.user?.id) return;
    await markAllNotificationsRead(session.user.id);
}

export async function clearNotifications() {
    const session = await auth();
    if (!session?.user?.id) return;
    await clearNotificationsForUser(session.user.id);
}

export async function confirmEmailOtp(tokenHash: string, type: string) {
    return confirmEmailWithTokenHash(tokenHash, type);
}

export async function confirmEmailCode(code: string) {
    return confirmEmailWithCode(code);
}

export async function confirmEmailToken(accessToken: string) {
    return confirmEmailWithAccessToken(accessToken);
}

export async function resendVerificationEmail() {
    const session = await auth();
    const email = session?.user?.email;
    if (!email) {
        return { ok: false, message: "Sign in to resend the verification email." };
    }
    return resendSignupVerificationEmail(email);
}

export async function loadOwnerChat(ownerId: string, visitorId: string) {
    const session = await auth();
    return loadChatThread(session?.user?.id, ownerId, visitorId);
}

export async function sendOwnerChatMessage(
    ownerId: string,
    visitorId: string,
    body: string,
    petId?: string | null,
) {
    const session = await auth();
    return persistChatMessage(session?.user?.id, ownerId, visitorId, body, petId);
}

export async function loadChatInbox() {
    const session = await auth();
    return fetchChatInbox(session?.user?.id);
}

export async function markChatThreadRead(ownerId: string, visitorId: string) {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId || !ownerId || !visitorId) return;
    const peerId = userId === ownerId ? visitorId : ownerId;
    if (peerId === userId) return;
    await markMessageNotificationsRead(userId, peerId);
}

export async function markPeerMessageNotificationsRead(actorId: string) {
    const session = await auth();
    if (!session?.user?.id || !actorId) return;
    await markMessageNotificationsRead(session.user.id, actorId);
}

export type AdminActionState = {
    ok?: boolean;
    message?: string | null;
};

export async function adminDeletePet(petId: string): Promise<AdminActionState> {
    const session = await auth();
    if (!(await userHasAdminRole(session?.user?.id))) {
        return { ok: false, message: "Only admins can delete listings." };
    }
    const result = await deleteOwnedPet(session?.user?.id, petId);
    if (!result.ok) {
        return { ok: false, message: result.message };
    }
    revalidatePath("/admin");
    revalidatePath("/adoption");
    revalidatePath("/foster");
    revalidatePath("/profile");
    return { ok: true };
}

export async function adminDeleteUser(userId: string): Promise<AdminActionState> {
    const session = await auth();
    if (!session?.user?.id) {
        return { ok: false, message: "You must be signed in." };
    }
    const result = await deleteAdminUser(session.user.id, userId);
    if (!result.ok) {
        return { ok: false, message: result.message };
    }
    revalidatePath("/admin");
    return { ok: true };
}

export type AdminUpdateUserState = {
    message?: string | null;
    errors?: {
        username?: string[];
        email?: string[];
        phone?: string[];
        country?: string[];
        city?: string[];
        role?: string[];
    };
};

const AdminUserSchema = z.object({
    userId: z.string().trim().min(1, { error: "Missing user." }),
    username: z.string().trim().min(2, { error: "Name must be at least 2 characters." }),
    email: z.email({ error: "Enter a valid email." }),
    phone: z.string().trim(),
    country: z.string().trim(),
    city: z.string().trim(),
    role: z.enum(["admin", "user"]),
    emailVerified: z.boolean(),
});

export async function adminUpdateUser(
    _prev: AdminUpdateUserState | undefined,
    formData: FormData,
): Promise<AdminUpdateUserState> {
    const session = await auth();
    if (!session?.user?.id) {
        return { message: "You must be signed in." };
    }

    const parsed = AdminUserSchema.safeParse({
        userId: formData.get("userId"),
        username: formData.get("username"),
        email: formData.get("email"),
        phone: formData.get("phone"),
        country: formData.get("country"),
        city: formData.get("city"),
        role: formData.get("role"),
        emailVerified: formData.get("emailVerified") === "on",
    });

    if (!parsed.success) {
        return {
            errors: z.flattenError(parsed.error).fieldErrors,
            message: "Check the highlighted fields and try again.",
        };
    }

    const result = await updateAdminUser(session.user.id, parsed.data);
    if (!result.ok) {
        return { message: result.message };
    }

    revalidatePath("/admin");
    revalidatePath(`/users/${encodeURIComponent(parsed.data.userId)}`);
    redirect("/admin");
}
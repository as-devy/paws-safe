import { Suspense } from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Header from "@/components/layout/Header";
import HeaderSkeleton from "@/components/layout/HeaderSkeleton";
import Footer from "@/components/layout/Footer";
import ProfileView from "@/components/profile/ProfileView";
import { auth } from "@/auth";
import { fetchPetsByOwner, fetchUserProfile } from "@/lib/pets-server";
import {
  fetchIncomingRequests,
  fetchOutgoingRequests,
} from "@/lib/requests-server";

export const metadata: Metadata = {
  title: "Your Profile | Paws Safe",
  description:
    "Manage your listings, incoming requests, and the pets you have requested.",
};

type ProfilePageProps = {
  searchParams: Promise<{ request?: string; chat?: string }>;
};

async function ProfileContent({
  highlightRequestId,
}: {
  highlightRequestId?: string;
}) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/profile");
  }
  if (!session.user.isEmailVerified) {
    redirect("/verify-email");
  }

  const [user, pets, incomingRequests, outgoingRequests] = await Promise.all([
    fetchUserProfile(session.user.id),
    fetchPetsByOwner(session.user.id),
    fetchIncomingRequests(session.user.id),
    fetchOutgoingRequests(session.user.id),
  ]);

  if (!user) {
    redirect("/login");
  }

  return (
    <ProfileView
      user={user}
      pets={pets}
      incomingRequests={incomingRequests}
      outgoingRequests={outgoingRequests}
      highlightRequestId={highlightRequestId}
    />
  );
}

export default async function ProfilePage({ searchParams }: ProfilePageProps) {
  const params = await searchParams;
  const highlightRequestId = params.request?.trim() || undefined;

  return (
    <>
      <Suspense fallback={<HeaderSkeleton />}>
        <Header />
      </Suspense>
      <Suspense fallback={<ProfileFallback />}>
        <ProfileContent highlightRequestId={highlightRequestId} />
      </Suspense>
      <Footer />
    </>
  );
}

function ProfileFallback() {
  return (
    <main className="profile profile--skel" aria-busy="true">
      <section className="profile__hero">
        <div className="profile__hero-inner">
          <div className="pet-skel pet-skel--crumb" />
          <div className="pet-skel pet-skel--heading" />
        </div>
      </section>
    </main>
  );
}

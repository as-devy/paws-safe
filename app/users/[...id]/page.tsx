import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import Header from "@/components/layout/Header";
import HeaderSkeleton from "@/components/layout/HeaderSkeleton";
import Footer from "@/components/layout/Footer";
import ProfileView from "@/components/profile/ProfileView";
import { auth } from "@/auth";
import { decodePetIdParam } from "@/lib/pets";
import { fetchPetsByOwner, fetchUserProfile } from "@/lib/pets-server";
import { hasApprovedRequestWithOwner } from "@/lib/requests-server";

type PosterProfilePageProps = {
  params: Promise<{ id: string[] }>;
};

export async function generateMetadata({
  params,
}: PosterProfilePageProps): Promise<Metadata> {
  const { id } = await params;
  const user = await fetchUserProfile(decodePetIdParam(id));
  const name = user?.name?.trim();

  return {
    title: name ? `${name} | Paws Safe` : "Poster | Paws Safe",
    description: name
      ? `View ${name}'s listings and profile on Paws Safe.`
      : "View a poster profile on Paws Safe.",
  };
}

async function PosterProfileContent({ params }: PosterProfilePageProps) {
  const { id } = await params;
  const userId = decodePetIdParam(id);
  const session = await auth();

  if (session?.user?.id && session.user.id === userId) {
    redirect("/profile");
  }

  const [user, pets] = await Promise.all([
    fetchUserProfile(userId),
    fetchPetsByOwner(userId),
  ]);

  if (!user) {
    notFound();
  }

  const canSeeContact = session?.user?.id
    ? await hasApprovedRequestWithOwner(session.user.id, userId)
    : false;

  const canChat = Boolean(session?.user?.id && session.user.isEmailVerified);

  const publicUser = canSeeContact
    ? user
    : { ...user, email: null, phone: null };

  return (
    <ProfileView
      user={publicUser}
      pets={pets}
      variant="public"
      canSeeContact={canSeeContact}
      showChat={canChat}
      chatOwnerId={userId}
      chatVisitorId={session?.user?.id ?? null}
    />
  );
}

export default function PosterProfilePage({ params }: PosterProfilePageProps) {
  return (
    <>
      <Suspense fallback={<HeaderSkeleton />}>
        <Header />
      </Suspense>
      <Suspense fallback={<PosterProfileFallback />}>
        <PosterProfileContent params={params} />
      </Suspense>
      <Footer />
    </>
  );
}

function PosterProfileFallback() {
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

import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PageBanner from "@/components/layout/PageBanner";

export const metadata: Metadata = {
  title: "Terms and Conditions | Paws Safe",
  description:
    "Terms for requesting, adopting, fostering, and rehoming pets on Paws Safe.",
};

const SECTIONS = [
  {
    title: "1. Pet Agreement",
    body: "By submitting a request to rehome, adopt, or foster a pet, you agree to provide a safe, secure, and loving home for the pet. You are responsible for the pet’s welfare from the moment the transfer is completed.",
  },
  {
    title: "2. Responsibilities",
    body: "You must provide adequate food, water, shelter, exercise, companionship, and medical care. Neglect, abandonment, or abuse of the pet may result in legal action and reporting to the relevant authorities.",
  },
  {
    title: "3. Home Environment",
    body: "Pets must not be left alone for extended periods and must live in a secure, pet-friendly environment. Dangerous or unsafe housing situations may be reported and reviewed.",
  },
  {
    title: "4. Financial Commitment",
    body: "Pet owners and adopters must be financially prepared to cover all costs related to pet ownership, including food, veterinary care, vaccinations, and any emergency needs.",
  },
  {
    title: "5. Return Policy",
    body: "If you are unable to continue caring for the pet, you must immediately contact the original pet owner or rehoming coordinator through our platform for further guidance. Abandoning the pet is prohibited.",
  },
  {
    title: "6. Verification and Data Use",
    body: "We collect basic personal information to verify users for safety and security purposes only. This helps protect the welfare of pets and all users on the platform. Your information will not be shared or used for other purposes without your consent. Contact details are shared with the other party only after a request is approved.",
  },
  {
    title: "7. Liability Disclaimer",
    body: "We are a connecting platform only. We are not responsible for any issues, injuries, behaviors, damages, or losses that occur during or after the pet transfer. Pet behavior can be unpredictable. Once a pet leaves the platform, any incidents are not our responsibility. However, you may still contact us for support, and we will do our best to help, although assistance is not guaranteed.",
  },
  {
    title: "8. No-Show Policy",
    body: "If a pet owner or adopter fails to attend the agreed meeting, please contact us as soon as possible. We will assist in resolving the issue where possible. In the meantime, you are encouraged to continue your search for another suitable pet.",
  },
  {
    title: "9. Conduct Expectations",
    body: "All users must act respectfully and honestly. Any false information, fraud, or misconduct will result in immediate suspension or banning from the platform.",
  },
  {
    title: "10. Agreement Acceptance",
    body: "By using our platform to rehome, adopt, or foster a pet, you confirm that you have read, understood, and agreed to all terms and conditions outlined above.",
  },
] as const;

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="pt-[40px]">
        <PageBanner title="Terms and Conditions" crumb="Terms" />
        <section className="form-page">
          <div className="form-page__inner">
            <article className="form-card terms-copy">
              {SECTIONS.map((section) => (
                <section key={section.title}>
                  <h2>{section.title}</h2>
                  <p>{section.body}</p>
                </section>
              ))}
            </article>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

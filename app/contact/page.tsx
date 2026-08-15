import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PageBanner from "@/components/layout/PageBanner";
import ContactPageContent from "@/components/contact/ContactPageContent";

export const metadata: Metadata = {
  title: "Contact Us | Paws Safe",
  description:
    "Get in touch with Paws Safe about adoption, fostering, posting a pet, or donations.",
};

export default function ContactPage() {
  return (
    <>
      <Header />
<<<<<<< HEAD
      <main className="pt-[40px]">
=======
      <main className="pt-[90px]">
>>>>>>> 9fbe6272ae14926655cd6155816221b0eb2ae799
        <PageBanner title="Contact Us" crumb="Contact" variant="contact" />
        <section className="form-page">
          <ContactPageContent />
        </section>
      </main>
      <Footer />
    </>
  );
}

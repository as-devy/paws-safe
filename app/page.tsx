import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import Benefits from "@/components/home/Benefits";
import Journey from "@/components/home/Journey";
import EmergencyPets from "@/components/home/EmergencyPets";
import ResourcesCta from "@/components/home/ResourcesCta";
import AdoptFosterBanners from "@/components/home/AdoptFosterBanners";
import Donation from "@/components/home/Donation";
import Stats from "@/components/home/Stats";
import ContactForm from "@/components/home/ContactForm";
import Reveal from "@/components/home/Reveal";

export default function Home() {
  return (
    <>
      <Header />
      <Hero />
      <Reveal>
        <Benefits />
      </Reveal>
      <Reveal>
        <Journey />
      </Reveal>
      <Reveal>
        <EmergencyPets />
      </Reveal>
      <Reveal from="scale">
        <ResourcesCta />
      </Reveal>
      <Reveal>
        <AdoptFosterBanners />
      </Reveal>
      <Reveal from="left">
        <Donation />
      </Reveal>
      <Reveal from="scale">
        <Stats />
      </Reveal>
      <Reveal>
        <ContactForm />
      </Reveal>
      <Footer />
    </>
  );
}

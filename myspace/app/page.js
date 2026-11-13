import Hero from "@/components/home/Hero";
import About from "@/components/home/About";
import MarqueeTransition from "@/components/home/MarqueeTransition";
import ResidenceSlides from "@/components/home/ResidenceSlides";
import ApartmentTransition from "@/components/home/ApartmentTransition";
import Apartment from "@/components/home/Apartment";
import Footer from "@/components/home/Footer";

export default function Home() {
  return (
    <main id="top" className="overflow-x-clip">
      <Hero />
      <About />
      <MarqueeTransition />
      <ResidenceSlides />
      <ApartmentTransition />
      <Apartment />
      <Footer />
    </main>
  );
}

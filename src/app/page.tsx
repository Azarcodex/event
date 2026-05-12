import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import Hero from "@/components/sections/Hero";
import MediaShowcase from "@/components/sections/MediaShowcase";
import About from "@/components/sections/About";
import Services from "@/components/sections/Services";
import Contact from "@/components/sections/Contact";
import HorizontalImageShowcase from "@/components/sections/HorizontalImageShowcase";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <HorizontalImageShowcase />
        <About />
        <Services />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

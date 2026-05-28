import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import Hero from "@/components/sections/Hero";
import MediaShowcase from "@/components/sections/MediaShowcase";
import About from "@/components/sections/About";
import Services from "@/components/sections/Services";
import Contact from "@/components/sections/Contact";
import HorizontalImageShowcase from "@/components/sections/HorizontalImageShowcase";
import ReviewsShowcase from "@/components/sections/ReviewsShowcase";
import ReviewForm from "@/components/sections/ReviewForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kerala's Premium Event Management & Luxury Production",
  description: "Experience spectacular event coordination, bespoke stage setups, sound design, and premium wedding production in Kerala by Green Hopper Events.",
  openGraph: {
    title: "Kerala's Premium Event Management & Luxury Production",
    description: "Experience spectacular event coordination, bespoke stage setups, sound design, and premium wedding production in Kerala by Green Hopper Events.",
    images: [
      {
        url: "/images/og-home.jpg",
        width: 1200,
        height: 630,
        alt: "Green Hopper Events Premium Stage Production",
      },
    ],
  },
};

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <HorizontalImageShowcase />
        <About />
        <Services />
        <ReviewsShowcase />
        <ReviewForm />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

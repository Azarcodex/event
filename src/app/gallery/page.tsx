import GalleryClient from "@/components/media/GalleryClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Media Showcase & Event Gallery",
  description: "Browse our premium portfolio showcasing luxury weddings, corporate setups, live concerts, and custom production projects by Green Hopper Events.",
  openGraph: {
    title: "Media Showcase & Event Gallery | Green Hopper Events",
    description: "Browse our premium portfolio showcasing luxury weddings, corporate setups, live concerts, and custom production projects.",
    images: [
      {
        url: "/images/og-gallery.jpg",
        width: 1200,
        height: 630,
        alt: "Green Hopper Events Media Gallery Showcase",
      },
    ],
  },
};

export default function GalleryPage() {
  return <GalleryClient />;
}

import type { Metadata } from "next";
import AboutContent from "./AboutContent";

export const metadata: Metadata = {
  title: "About",
  description:
    "PaperSimple makes research papers accessible to everyone. Built for students, free forever. Learn about our mission and roadmap.",
  openGraph: {
    title: "About PaperSimple",
    description:
      "We believe every research paper can be explained so a high school student understands it.",
    url: "https://papersimple.pages.dev/about",
  },
  alternates: {
    canonical: "https://papersimple.pages.dev/about",
  },
};

export default function AboutPage() {
  return <AboutContent />;
}

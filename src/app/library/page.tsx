import type { Metadata } from "next";
import LibraryContent from "./LibraryContent";

export const metadata: Metadata = {
  title: "Your Paper Library",
  description:
    "Browse and search your saved research paper explanations. All papers are stored locally in your browser for privacy.",
  openGraph: {
    title: "Your Paper Library | PaperSimple",
    description: "Browse your saved research paper explanations.",
    url: "https://papersimple.pages.dev/library",
  },
  robots: {
    index: false,
    follow: true,
  },
  alternates: {
    canonical: "https://papersimple.pages.dev/library",
  },
};

export default function LibraryPage() {
  return <LibraryContent />;
}

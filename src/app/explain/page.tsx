import type { Metadata } from "next";
import ExplainContent from "./ExplainContent";

export const metadata: Metadata = {
  title: "Explain a Research Paper",
  description:
    "Upload any research paper PDF and get an instant, plain-English explanation. Choose your difficulty level from high school to expert.",
  openGraph: {
    title: "Explain a Research Paper | PaperSimple",
    description:
      "Upload any research paper PDF and get an instant, plain-English explanation.",
    url: "https://papersimple.pages.dev/explain",
  },
  alternates: {
    canonical: "https://papersimple.pages.dev/explain",
  },
};

export default function ExplainPage() {
  return <ExplainContent />;
}

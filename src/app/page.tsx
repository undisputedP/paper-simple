import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Comparison } from "@/components/landing/Comparison";
import { FeedbackSection } from "@/components/landing/FeedbackSection";
import { CTA } from "@/components/landing/CTA";
import { WebsiteJsonLd, FAQJsonLd } from "@/components/seo/JsonLd";

export default function Home() {
  return (
    <>
      <WebsiteJsonLd />
      <FAQJsonLd />
      <Hero />
      <Features />
      <HowItWorks />
      <Comparison />
      <FeedbackSection />
      <CTA />
    </>
  );
}

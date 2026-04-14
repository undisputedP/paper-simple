interface JsonLdProps {
  data: Record<string, unknown>;
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function WebsiteJsonLd() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: "PaperSimple",
        url: "https://papersimple.pages.dev",
        description:
          "Upload any research paper and get it explained like you're 15. Visual breakdowns, real-world connections, and zero jargon.",
        applicationCategory: "EducationalApplication",
        operatingSystem: "Any",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
        audience: {
          "@type": "EducationalAudience",
          educationalRole: "student",
        },
        featureList: [
          "PDF paper upload and text extraction",
          "Multi-depth explanations (high school to expert)",
          "Interactive visual paper map",
          "Follow-up Q&A on any paper",
          "Personal paper library",
          "Key terms glossary",
        ],
      }}
    />
  );
}

export function FAQJsonLd() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "What is PaperSimple?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "PaperSimple is a free tool that takes any research paper and explains it in simple, everyday language. Just upload a PDF and get an instant breakdown at your chosen difficulty level.",
            },
          },
          {
            "@type": "Question",
            name: "Is PaperSimple free?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes, PaperSimple is completely free for students. No sign-up required, no paywalls, and no hidden costs.",
            },
          },
          {
            "@type": "Question",
            name: "How does PaperSimple explain research papers?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "PaperSimple uses AI to read and analyze research papers, then generates explanations at four difficulty levels: high school, undergraduate, graduate, and expert. Each level uses appropriate language and analogies.",
            },
          },
          {
            "@type": "Question",
            name: "Is my data safe with PaperSimple?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes. Papers are processed in your browser and saved locally. We don't collect personal data or store your uploaded papers on our servers.",
            },
          },
          {
            "@type": "Question",
            name: "What types of papers does PaperSimple support?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "PaperSimple works with any research paper in PDF format. It handles papers from all fields including science, engineering, medicine, social sciences, and humanities.",
            },
          },
        ],
      }}
    />
  );
}

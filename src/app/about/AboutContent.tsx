"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Target,
  Zap,
  Users,
  ArrowRight,
  Shield,
} from "lucide-react";

const values = [
  {
    icon: Target,
    title: "Built for Students",
    description:
      "Every feature is designed with high school and undergraduate students in mind. No assumptions about prior knowledge.",
  },
  {
    icon: Zap,
    title: "Speed Over Complexity",
    description:
      "Upload a paper, get an explanation in seconds. No sign-ups, no onboarding, no learning curve.",
  },
  {
    icon: Users,
    title: "Accessible to All",
    description:
      "Free forever for students. Knowledge shouldn't be locked behind paywalls or academic credentials.",
  },
  {
    icon: Shield,
    title: "Privacy First",
    description:
      "Your papers are processed and stored locally in your browser. We don't collect or store your data.",
  },
];

const roadmap = [
  {
    status: "done",
    title: "PDF Upload & Text Extraction",
    description: "Upload any research paper and extract its contents.",
  },
  {
    status: "done",
    title: "Multi-Depth Explanations",
    description: "Four explanation levels from high school to expert.",
  },
  {
    status: "done",
    title: "Visual Paper Map",
    description: "Interactive flow chart of the paper's structure.",
  },
  {
    status: "done",
    title: "Interactive Q&A",
    description: "Ask follow-up questions about any paper.",
  },
  {
    status: "next",
    title: "Live AI Integration",
    description:
      "Connect to Claude API for real-time, paper-specific explanations.",
  },
  {
    status: "next",
    title: "URL / arXiv Import",
    description: "Paste a paper URL instead of uploading a PDF.",
  },
  {
    status: "future",
    title: "Community Features",
    description: "Discuss papers, share explanations, and learn together.",
  },
  {
    status: "future",
    title: "Study Guides",
    description: "Auto-generate study guides and flashcards from papers.",
  },
];

export default function AboutContent() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      {/* Hero */}
      <motion.div
        className="mb-16 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <BookOpen className="h-7 w-7" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          About PaperSimple
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
          We believe that every research paper — no matter how complex — can be
          explained in a way that a high school student can understand. That&apos;s
          not dumbing things down. That&apos;s making knowledge accessible.
        </p>
      </motion.div>

      {/* Mission */}
      <section className="mb-16">
        <h2 className="mb-6 text-2xl font-bold text-center">Our Mission</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {values.map((v, i) => (
            <motion.div
              key={v.title}
              className="rounded-xl border border-border/50 bg-card p-5"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <v.icon className="mb-3 h-6 w-6 text-primary" />
              <h3 className="mb-1 font-semibold">{v.title}</h3>
              <p className="text-sm text-muted-foreground">{v.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="mb-16">
        <h2 className="mb-6 text-2xl font-bold text-center">How It Works</h2>
        <div className="rounded-xl border border-border/50 bg-card p-6 space-y-4">
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary text-sm font-bold">
              1
            </div>
            <div>
              <h4 className="font-semibold">Upload a PDF</h4>
              <p className="text-sm text-muted-foreground">
                We use PDF.js to extract all text from your research paper right
                in your browser. Nothing is sent to any server.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-500/10 text-orange-500 text-sm font-bold">
              2
            </div>
            <div>
              <h4 className="font-semibold">AI Generates Explanations</h4>
              <p className="text-sm text-muted-foreground">
                Our AI reads the full paper and generates explanations at four
                different levels — from everyday analogies to full technical
                depth.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-500/10 text-green-500 text-sm font-bold">
              3
            </div>
            <div>
              <h4 className="font-semibold">Explore & Ask Questions</h4>
              <p className="text-sm text-muted-foreground">
                Navigate through the visual paper map, read the explanation at
                your chosen depth, and ask follow-up questions to deepen your
                understanding.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Roadmap */}
      <section className="mb-16">
        <h2 className="mb-6 text-2xl font-bold text-center">Roadmap</h2>
        <div className="space-y-3">
          {roadmap.map((item, i) => (
            <motion.div
              key={item.title}
              className="flex items-start gap-3 rounded-lg border border-border/50 bg-card px-4 py-3"
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <div
                className={`mt-0.5 h-2.5 w-2.5 shrink-0 rounded-full ${
                  item.status === "done"
                    ? "bg-green-500"
                    : item.status === "next"
                      ? "bg-orange-500"
                      : "bg-muted-foreground/30"
                }`}
              />
              <div className="flex-1">
                <h4 className="text-sm font-semibold">{item.title}</h4>
                <p className="text-xs text-muted-foreground">
                  {item.description}
                </p>
              </div>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                  item.status === "done"
                    ? "bg-green-500/10 text-green-600"
                    : item.status === "next"
                      ? "bg-orange-500/10 text-orange-600"
                      : "bg-muted text-muted-foreground"
                }`}
              >
                {item.status === "done"
                  ? "Shipped"
                  : item.status === "next"
                    ? "Next Up"
                    : "Planned"}
              </span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <div className="text-center">
        <Link href="/explain">
          <Button size="lg" className="gap-2">
            Try PaperSimple Now
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}

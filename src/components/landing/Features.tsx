"use client";

import { motion } from "framer-motion";
import {
  GraduationCap,
  Map,
  SlidersHorizontal,
  Globe,
  MessageCircleQuestion,
  Heart,
} from "lucide-react";

const features = [
  {
    icon: GraduationCap,
    title: "Explain Like I'm 15",
    description:
      "Not a boring summary. A full re-telling using everyday analogies, stories, and zero jargon. Imagine your cool teacher explaining it.",
    color: "text-purple-500 bg-purple-500/10",
  },
  {
    icon: Map,
    title: "Visual Paper Map",
    description:
      "See the entire paper as an interactive visual flow: What's the problem? What did they try? What happened? Why does it matter?",
    color: "text-orange-500 bg-orange-500/10",
  },
  {
    icon: SlidersHorizontal,
    title: "Depth Slider",
    description:
      "One slider, four levels: High School, Undergrad, Graduate, Expert. Same paper, completely different explanations. You pick your level.",
    color: "text-teal-500 bg-teal-500/10",
  },
  {
    icon: Globe,
    title: '"So What?" Section',
    description:
      "Every paper ends with why YOU should care. Real-world connections to health, tech, climate, sports — things that actually matter to you.",
    color: "text-pink-500 bg-pink-500/10",
  },
  {
    icon: MessageCircleQuestion,
    title: "Ask Questions",
    description:
      'Confused about something? Ask "but why?" at any point and get a clear, contextual answer from the paper. Like having a tutor on demand.',
    color: "text-blue-500 bg-blue-500/10",
  },
  {
    icon: Heart,
    title: "100% Free",
    description:
      "No credit card. No token limits. No paywall surprise after 3 uses. Students deserve free access to knowledge. Period.",
    color: "text-red-500 bg-red-500/10",
  },
];

export function Features() {
  return (
    <section className="px-4 py-20" id="features">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Not just another summarizer
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
            Other tools give you shorter jargon. We give you actual
            understanding. Here's what makes PaperSimple different.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              className="group rounded-xl border border-border/50 bg-card p-6 transition-shadow hover:shadow-lg hover:shadow-primary/5"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <div
                className={`mb-4 flex h-10 w-10 items-center justify-center rounded-lg ${feature.color}`}
              >
                <feature.icon className="h-5 w-5" />
              </div>
              <h3 className="mb-2 font-semibold text-lg">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

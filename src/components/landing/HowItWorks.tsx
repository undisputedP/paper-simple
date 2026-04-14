"use client";

import { motion } from "framer-motion";
import { Upload, Brain, CheckCircle } from "lucide-react";

const steps = [
  {
    icon: Upload,
    step: "01",
    title: "Upload Your Paper",
    description:
      "Drop any research paper PDF. We'll extract the text, find the title, authors, and abstract automatically.",
    color: "from-purple-500 to-purple-600",
  },
  {
    icon: Brain,
    step: "02",
    title: "AI Breaks It Down",
    description:
      "Our AI reads the entire paper and re-writes it using simple language, visual maps, and relatable analogies.",
    color: "from-orange-500 to-orange-600",
  },
  {
    icon: CheckCircle,
    step: "03",
    title: "You Understand It",
    description:
      "Read at your level, explore the visual map, ask follow-up questions, and finally understand what that paper is actually saying.",
    color: "from-teal-500 to-teal-600",
  },
];

export function HowItWorks() {
  return (
    <section className="bg-muted/30 px-4 py-20">
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Three steps. That's it.
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            No sign-ups. No tutorials. No learning curve. Just upload and
            understand.
          </p>
        </div>

        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {steps.map((item, i) => (
            <motion.div
              key={item.step}
              className="relative text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.15 }}
            >
              <div
                className={`mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${item.color} text-white shadow-lg`}
              >
                <item.icon className="h-7 w-7" />
              </div>
              <div className="mb-2 text-xs font-bold uppercase tracking-wider text-primary">
                Step {item.step}
              </div>
              <h3 className="mb-2 text-xl font-semibold">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {item.description}
              </p>

              {i < steps.length - 1 && (
                <div className="absolute right-0 top-8 hidden translate-x-1/2 text-2xl text-muted-foreground/30 md:block">
                  &rarr;
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

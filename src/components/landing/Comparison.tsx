"use client";

import { motion } from "framer-motion";
import { Check, X, Minus } from "lucide-react";

const features = [
  { name: "Built for high school students", us: true, others: false },
  { name: "Visual paper map", us: true, others: false },
  { name: "Depth slider (4 levels)", us: true, others: false },
  { name: '"So What?" real-world connections', us: true, others: false },
  { name: "Interactive Q&A", us: true, others: "partial" },
  { name: "Completely free", us: true, others: false },
  { name: "PDF upload", us: true, others: true },
  { name: "Paper summarization", us: true, others: true },
];

function StatusIcon({ value }: { value: boolean | string }) {
  if (value === true)
    return <Check className="h-4 w-4 text-green-500" />;
  if (value === "partial")
    return <Minus className="h-4 w-4 text-yellow-500" />;
  return <X className="h-4 w-4 text-red-400" />;
}

export function Comparison() {
  return (
    <section className="px-4 py-20">
      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            How we stack up
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            Other tools were built for researchers. We were built for you.
          </p>
        </div>

        <motion.div
          className="mt-10 overflow-hidden rounded-xl border border-border/50"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="grid grid-cols-3 bg-muted/50 px-4 py-3 text-sm font-semibold">
            <div>Feature</div>
            <div className="text-center text-primary">PaperSimple</div>
            <div className="text-center text-muted-foreground">Others</div>
          </div>
          {features.map((f, i) => (
            <div
              key={f.name}
              className={`grid grid-cols-3 items-center px-4 py-3 text-sm ${
                i % 2 === 0 ? "bg-card" : "bg-muted/20"
              }`}
            >
              <div className="text-muted-foreground">{f.name}</div>
              <div className="flex justify-center">
                <StatusIcon value={f.us} />
              </div>
              <div className="flex justify-center">
                <StatusIcon value={f.others} />
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

"use client";

import { motion } from "framer-motion";
import { HelpCircle, Lightbulb, Sparkles, Rocket } from "lucide-react";
import type { ExplanationSection } from "@/types/paper";

const iconMap: Record<string, React.ElementType> = {
  "help-circle": HelpCircle,
  lightbulb: Lightbulb,
  sparkles: Sparkles,
  rocket: Rocket,
};

const colorMap: Record<string, string> = {
  "help-circle": "text-red-500 bg-red-500/10",
  lightbulb: "text-orange-500 bg-orange-500/10",
  sparkles: "text-green-500 bg-green-500/10",
  rocket: "text-purple-500 bg-purple-500/10",
};

interface ExplanationProps {
  sections: ExplanationSection[];
}

export function Explanation({ sections }: ExplanationProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        The Explanation
      </h3>
      {sections.map((section, i) => {
        const Icon = iconMap[section.icon] || HelpCircle;
        const color = colorMap[section.icon] || "text-gray-500 bg-gray-500/10";

        return (
          <motion.div
            key={section.title}
            className="rounded-xl border border-border/50 bg-card p-5"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: i * 0.1 }}
          >
            <div className="mb-3 flex items-center gap-3">
              <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${color}`}>
                <Icon className="h-4.5 w-4.5" />
              </div>
              <h4 className="text-lg font-semibold">{section.title}</h4>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {section.content}
            </p>
          </motion.div>
        );
      })}
    </div>
  );
}

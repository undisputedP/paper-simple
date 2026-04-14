"use client";

import { motion } from "framer-motion";
import { Globe, Zap } from "lucide-react";

interface SoWhatProps {
  points: string[];
}

export function SoWhat({ points }: SoWhatProps) {
  return (
    <div className="rounded-xl border border-border/50 bg-gradient-to-br from-secondary/5 to-primary/5 p-5">
      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary/10 text-secondary">
          <Globe className="h-4 w-4" />
        </div>
        <h3 className="font-semibold">So What? Why Should You Care?</h3>
      </div>

      <div className="space-y-2.5">
        {points.map((point, i) => (
          <motion.div
            key={i}
            className="flex items-start gap-2.5 rounded-lg bg-card/50 p-3"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: i * 0.1 }}
          >
            <Zap className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
            <p className="text-sm text-muted-foreground">{point}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

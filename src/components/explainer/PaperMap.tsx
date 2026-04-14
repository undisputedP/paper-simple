"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { PaperMapNode } from "@/types/paper";

interface PaperMapProps {
  nodes: PaperMapNode[];
}

export function PaperMap({ nodes }: PaperMapProps) {
  return (
    <div className="rounded-xl border border-border/50 bg-card p-5">
      <h3 className="mb-5 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        Paper Flow Map
      </h3>

      <div className="flex flex-col items-stretch gap-3 md:flex-row md:items-center md:gap-0">
        {nodes.map((node, i) => (
          <div key={node.id} className="flex flex-1 items-center">
            <motion.div
              className="flex-1 rounded-xl border-2 p-4 text-center"
              style={{ borderColor: node.color }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: i * 0.15 }}
            >
              <div
                className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full text-white text-sm font-bold"
                style={{ backgroundColor: node.color }}
              >
                {i + 1}
              </div>
              <h4 className="font-semibold text-sm">{node.label}</h4>
              <p className="mt-1 text-xs text-muted-foreground">
                {node.description}
              </p>
            </motion.div>

            {i < nodes.length - 1 && (
              <div className="hidden shrink-0 px-2 text-muted-foreground/40 md:block">
                <ArrowRight className="h-5 w-5" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, FileText, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative overflow-hidden px-4 py-20 md:py-32">
      {/* Background gradient */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute right-0 top-1/2 h-[400px] w-[400px] -translate-y-1/2 rounded-full bg-secondary/10 blur-3xl" />
      </div>

      <div className="mx-auto max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mx-auto mb-6 flex w-fit items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            Free &amp; Open — No PhD Required
          </div>
        </motion.div>

        <motion.h1
          className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Research Papers,{" "}
          <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Finally Made Simple
          </span>
        </motion.h1>

        <motion.p
          className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Upload any research paper and get it explained like you're 15. Visual
          breakdowns, real-world connections, and zero jargon. Because brilliant
          ideas shouldn't be locked behind complicated words.
        </motion.p>

        <motion.div
          className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Link href="/explain">
            <Button size="lg" className="gap-2 text-base">
              <FileText className="h-4 w-4" />
              Upload a Paper
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/about">
            <Button variant="outline" size="lg" className="text-base">
              See How It Works
            </Button>
          </Link>
        </motion.div>

        {/* Mini demo preview */}
        <motion.div
          className="mx-auto mt-16 max-w-3xl"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
        >
          <div className="rounded-xl border border-border/50 bg-card p-6 shadow-2xl shadow-primary/5">
            <div className="mb-4 flex items-center gap-2 text-xs text-muted-foreground">
              <div className="h-2.5 w-2.5 rounded-full bg-red-400" />
              <div className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
              <div className="h-2.5 w-2.5 rounded-full bg-green-400" />
              <span className="ml-2">PaperSimple — Explanation View</span>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="rounded-md bg-red-500/10 p-1.5 text-red-500">
                  <span className="text-xs font-bold">?</span>
                </div>
                <div>
                  <p className="text-sm font-semibold">The Problem</p>
                  <p className="text-xs text-muted-foreground">
                    Imagine your school cafeteria only serves one meal. This
                    paper found that AI models have the same problem...
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="rounded-md bg-orange-500/10 p-1.5 text-orange-500">
                  <span className="text-xs font-bold">!</span>
                </div>
                <div>
                  <p className="text-sm font-semibold">The Approach</p>
                  <p className="text-xs text-muted-foreground">
                    They built something like a universal translator, but for
                    data types...
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="rounded-md bg-green-500/10 p-1.5 text-green-500">
                  <span className="text-xs font-bold">*</span>
                </div>
                <div>
                  <p className="text-sm font-semibold">The Discovery</p>
                  <p className="text-xs text-muted-foreground">
                    It worked 90% of the time vs the old method's 70%. That's
                    like going from a C to an A+...
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

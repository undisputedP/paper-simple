"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BuyMeCoffee } from "./BuyMeCoffee";
import { ShareButton } from "./ShareButton";

export function CTA() {
  return (
    <section className="px-4 py-20">
      <motion.div
        className="mx-auto max-w-3xl rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-secondary/10 p-10 text-center md:p-14"
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Ready to actually understand a research paper?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
          Stop pretending you read the abstract. Upload a paper and get it
          explained in under 30 seconds. No sign-up required.
        </p>

        <div className="mt-8 flex flex-col items-center gap-4">
          <Link href="/explain">
            <Button size="lg" className="gap-2 text-base">
              Start Explaining
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <ShareButton />
            <BuyMeCoffee />
          </div>
        </div>
      </motion.div>
    </section>
  );
}

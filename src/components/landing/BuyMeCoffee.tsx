"use client";

import { motion } from "framer-motion";
import { Coffee } from "lucide-react";

export function BuyMeCoffee() {
  return (
    <motion.a
      href="https://buymeacoffee.com/yourusername"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 rounded-full bg-[#FFDD00] px-5 py-2.5 text-sm font-semibold text-[#0D0C22] shadow-md transition-all hover:shadow-lg hover:scale-105 active:scale-95"
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.95 }}
    >
      <Coffee className="h-4 w-4" />
      Buy Me a Coffee
    </motion.a>
  );
}

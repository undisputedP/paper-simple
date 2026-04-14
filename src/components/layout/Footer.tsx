"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { BookOpen, Code2, AtSign, Coffee, Eye } from "lucide-react";

function formatCount(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return n.toLocaleString();
}

export function Footer() {
  const [visitorCount, setVisitorCount] = useState<number | null>(null);

  useEffect(() => {
    // Track visit
    fetch("/api/visitors", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ page: window.location.pathname }),
    }).catch(() => {});

    // Fetch count
    fetch("/api/visitors")
      .then((r) => r.json())
      .then((data) => {
        if (data.count > 0) setVisitorCount(data.count);
      })
      .catch(() => {});
  }, []);

  return (
    <footer className="border-t border-border/50 bg-muted/30">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center gap-2 font-bold text-lg">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <BookOpen className="h-3.5 w-3.5" />
              </div>
              Paper<span className="text-primary">Simple</span>
            </Link>
            <p className="mt-3 text-sm text-muted-foreground">
              Making research papers accessible to everyone. Because knowledge
              shouldn't require a PhD to understand.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-3">Product</h4>
            <div className="flex flex-col gap-2">
              <Link href="/explain" className="text-sm text-muted-foreground hover:text-foreground">
                Explain a Paper
              </Link>
              <Link href="/library" className="text-sm text-muted-foreground hover:text-foreground">
                Your Library
              </Link>
              <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground">
                About
              </Link>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-3">Resources</h4>
            <div className="flex flex-col gap-2">
              <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground">
                How It Works
              </Link>
              <Link href="/about#faq" className="text-sm text-muted-foreground hover:text-foreground">
                FAQ
              </Link>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-3">Connect</h4>
            <div className="flex gap-3">
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground"
                aria-label="GitHub"
              >
                <Code2 className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground"
                aria-label="Twitter"
              >
                <AtSign className="h-5 w-5" />
              </a>
            </div>
            <a
              href="https://buymeacoffee.com/yourusername"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-[#FFDD00] px-3 py-1.5 text-xs font-semibold text-[#0D0C22] transition-transform hover:scale-105"
            >
              <Coffee className="h-3.5 w-3.5" />
              Buy Me a Coffee
            </a>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center gap-3 border-t border-border/50 pt-6">
          {visitorCount !== null && visitorCount > 0 && (
            <div className="flex items-center gap-1.5 rounded-full border border-border/50 bg-card px-4 py-1.5 text-xs text-muted-foreground">
              <Eye className="h-3.5 w-3.5 text-primary" />
              <span>
                <strong className="text-foreground">{formatCount(visitorCount)}</strong> visitors
                and counting
              </span>
            </div>
          )}
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} PaperSimple. Built to make knowledge accessible.
          </p>
        </div>
      </div>
    </footer>
  );
}

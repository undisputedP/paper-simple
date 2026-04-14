"use client";

import { useState } from "react";
import { Share2, Copy, Check, MessageCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

const SITE_URL = "https://papersimple.app";
const SHARE_TEXT = "Check out PaperSimple — it explains research papers in simple English! No PhD required.";

export function ShareButton() {
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(SITE_URL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const shareNative = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: "PaperSimple", text: SHARE_TEXT, url: SITE_URL });
        return;
      } catch {
        // User cancelled or not supported, fall through to manual
      }
    }
    setOpen(!open);
  };

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(SHARE_TEXT)}&url=${encodeURIComponent(SITE_URL)}`;
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(SHARE_TEXT + " " + SITE_URL)}`;
  const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(SITE_URL)}&text=${encodeURIComponent(SHARE_TEXT)}`;

  return (
    <div className="relative inline-block">
      <Button
        variant="outline"
        className="gap-2"
        onClick={shareNative}
      >
        <Share2 className="h-4 w-4" />
        Share with Friends
      </Button>

      {open && (
        <div className="absolute bottom-full left-1/2 z-50 mb-2 -translate-x-1/2 rounded-xl border border-border bg-card p-3 shadow-xl">
          <div className="flex items-center gap-2">
            <a
              href={twitterUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
              title="Twitter / X"
            >
              <AtSignIcon className="h-4 w-4" />
            </a>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted text-muted-foreground transition-colors hover:bg-green-500 hover:text-white"
              title="WhatsApp"
            >
              <MessageCircle className="h-4 w-4" />
            </a>
            <a
              href={telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted text-muted-foreground transition-colors hover:bg-blue-500 hover:text-white"
              title="Telegram"
            >
              <Send className="h-4 w-4" />
            </a>
            <button
              onClick={copyLink}
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted text-muted-foreground transition-colors hover:bg-secondary hover:text-secondary-foreground"
              title="Copy link"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function AtSignIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4l11.733 16h4.267l-11.733 -16h-4.267z" />
      <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
    </svg>
  );
}

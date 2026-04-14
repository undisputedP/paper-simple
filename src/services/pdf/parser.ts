"use client";

import type { PaperMetadata } from "@/types/paper";

let pdfjsLib: typeof import("pdfjs-dist") | null = null;

async function getPdfjs() {
  if (!pdfjsLib) {
    pdfjsLib = await import("pdfjs-dist");
    pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
      "pdfjs-dist/build/pdf.worker.min.mjs",
      import.meta.url
    ).toString();
  }
  return pdfjsLib;
}

export async function extractTextFromPdf(file: File): Promise<string> {
  const pdfjs = await getPdfjs();
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
  const pages: string[] = [];

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const text = content.items
      .map((item) => ("str" in item ? item.str : ""))
      .join(" ");
    pages.push(text);
  }

  return pages.join("\n\n");
}

export function extractMetadata(text: string): PaperMetadata {
  const lines = text.split("\n").filter((l) => l.trim().length > 0);

  // Try to extract title (usually the first substantial line)
  let title = "Untitled Paper";
  for (const line of lines.slice(0, 5)) {
    const trimmed = line.trim();
    if (trimmed.length > 15 && trimmed.length < 300) {
      title = trimmed;
      break;
    }
  }

  // Try to extract authors (lines near the top with comma-separated names)
  const authors: string[] = [];
  for (const line of lines.slice(1, 8)) {
    const trimmed = line.trim();
    if (
      trimmed.includes(",") &&
      trimmed.length < 500 &&
      !trimmed.includes("Abstract") &&
      /[A-Z][a-z]+/.test(trimmed)
    ) {
      const parts = trimmed.split(",").map((s) => s.trim());
      if (parts.every((p) => p.length < 50 && p.length > 2)) {
        authors.push(...parts);
        break;
      }
    }
  }

  // Try to extract abstract
  let abstract = "";
  const fullText = text.toLowerCase();
  const abstractIdx = fullText.indexOf("abstract");
  if (abstractIdx !== -1) {
    const afterAbstract = text.substring(abstractIdx + 8).trim();
    const introIdx = afterAbstract.toLowerCase().indexOf("introduction");
    const keywordsIdx = afterAbstract.toLowerCase().indexOf("keywords");
    const endIdx = Math.min(
      introIdx > 0 ? introIdx : 2000,
      keywordsIdx > 0 ? keywordsIdx : 2000,
      2000
    );
    abstract = afterAbstract.substring(0, endIdx).trim();
  }

  if (!abstract && lines.length > 3) {
    abstract = lines.slice(2, 6).join(" ").substring(0, 500);
  }

  // Try to extract year
  const yearMatch = text.match(/\b(19|20)\d{2}\b/);
  const year = yearMatch ? yearMatch[0] : undefined;

  return {
    title,
    authors: authors.length > 0 ? authors : ["Unknown Author"],
    abstract: abstract || "No abstract available.",
    year,
  };
}

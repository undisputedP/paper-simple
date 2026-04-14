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

/**
 * Clean PDF-extracted text: fix double spaces, weird joins, etc.
 */
function cleanText(text: string): string {
  return text
    .replace(/\s+/g, " ") // collapse whitespace
    .replace(/- /g, "") // fix hyphenated line breaks
    .replace(/\s([.,;:!?])/g, "$1") // fix spaces before punctuation
    .trim();
}

/**
 * Split text into meaningful segments (sentences/phrases) for analysis
 */
function splitIntoSegments(text: string): string[] {
  return text
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 10);
}

/**
 * Score how likely a string is to be a paper title
 */
function titleScore(text: string): number {
  const t = text.trim();
  let score = 0;

  // Good length for a title (5-150 chars)
  if (t.length >= 5 && t.length <= 150) score += 3;
  else if (t.length > 150 || t.length < 5) return 0;

  // Doesn't end with a period (titles usually don't)
  if (!t.endsWith(".")) score += 2;

  // Title case or starts with capital
  if (/^[A-Z]/.test(t)) score += 1;

  // Contains no "abstract", "introduction", "university", email, URL
  const lc = t.toLowerCase();
  if (
    lc.includes("abstract") ||
    lc.includes("introduction") ||
    lc.includes("university") ||
    lc.includes("@") ||
    lc.includes("http") ||
    lc.includes("department") ||
    lc.includes("arxiv")
  ) {
    return 0;
  }

  // Not a number-heavy line (like page numbers, dates alone)
  if (/^\d+$/.test(t) || /^\d{4}$/.test(t)) return 0;

  // Not all caps single short word
  if (t.split(" ").length === 1 && t.length < 15) return 0;

  // Bonus: multi-word
  const words = t.split(/\s+/);
  if (words.length >= 3) score += 2;

  // Bonus: contains a colon (common in paper titles)
  if (t.includes(":")) score += 1;

  return score;
}

/**
 * Check if a line looks like an author list
 */
function isAuthorLine(text: string): boolean {
  const t = text.trim();

  // Too long or too short
  if (t.length > 600 || t.length < 5) return false;

  // Contains typical academic indicators
  const lc = t.toLowerCase();
  if (
    lc.includes("abstract") ||
    lc.includes("introduction") ||
    lc.includes("keywords")
  ) {
    return false;
  }

  // Has asterisks, daggers, or superscripts (common in author lists)
  const hasMarkers = /[*†‡§∗]/.test(t) || /\d{1,2}\s*[A-Z]/.test(t);

  // Has multiple capitalized names
  const namePattern = /[A-Z][a-z]+\s+[A-Z][a-z]+/g;
  const names = t.match(namePattern);
  if (names && names.length >= 2) return true;

  // Comma separated with names
  if (t.includes(",") && names && names.length >= 1) return true;

  // Has markers and names
  if (hasMarkers && names) return true;

  return false;
}

/**
 * Extract author names from an author line
 */
function parseAuthors(text: string): string[] {
  // Remove affiliations markers (superscripts, asterisks, etc.)
  let cleaned = text
    .replace(/[*†‡§∗]/g, "")
    .replace(/\b\d{1,2}\b/g, "")
    .replace(/\{[^}]*\}/g, "")
    .replace(/\([^)]*\)/g, "")
    .trim();

  // Split by common delimiters
  let parts: string[];
  if (cleaned.includes(" and ")) {
    // Handle "A, B, and C" pattern
    cleaned = cleaned.replace(/,?\s+and\s+/g, ", ");
    parts = cleaned.split(",");
  } else if (cleaned.includes(",")) {
    parts = cleaned.split(",");
  } else {
    parts = cleaned.split(/\s{3,}/); // multiple spaces
  }

  return parts
    .map((p) => p.trim())
    .filter(
      (p) =>
        p.length > 2 &&
        p.length < 60 &&
        /[A-Z]/.test(p) &&
        !p.toLowerCase().includes("university") &&
        !p.toLowerCase().includes("department") &&
        !p.includes("@")
    )
    .slice(0, 20);
}

export function extractMetadata(text: string): PaperMetadata {
  const cleaned = cleanText(text);
  const firstPage = text.split("\n\n")[0] || text.substring(0, 3000);
  const firstPageCleaned = cleanText(firstPage);

  // --- TITLE EXTRACTION ---
  // Try multiple approaches and pick the best
  let title = "Untitled Paper";
  let bestTitleScore = 0;

  // Approach 1: First substantial segment of first page
  const segments = firstPageCleaned
    .split(/\s{2,}/)
    .map((s) => s.trim())
    .filter((s) => s.length > 5);

  for (const seg of segments.slice(0, 10)) {
    const score = titleScore(seg);
    if (score > bestTitleScore) {
      bestTitleScore = score;
      title = seg;
    }
  }

  // Approach 2: Try splitting by period and checking first segments
  const sentences = splitIntoSegments(firstPageCleaned);
  for (const sent of sentences.slice(0, 5)) {
    // Titles often don't have periods, but the segment splitter may attach one
    const candidate = sent.replace(/\.$/, "");
    const score = titleScore(candidate);
    if (score > bestTitleScore) {
      bestTitleScore = score;
      title = candidate;
    }
  }

  // Clean up title
  title = title.replace(/^\d+\s*/, "").trim(); // remove leading numbers
  if (title.length > 150) {
    title = title.substring(0, 150).trim();
  }

  // --- AUTHOR EXTRACTION ---
  const authors: string[] = [];
  // Look at text after the title candidate
  const titleIdx = firstPageCleaned.indexOf(title);
  const afterTitle =
    titleIdx >= 0
      ? firstPageCleaned.substring(titleIdx + title.length)
      : firstPageCleaned;

  // Split into potential author sections
  const potentialAuthorLines = afterTitle
    .split(/\s{2,}/)
    .map((s) => s.trim())
    .filter((s) => s.length > 5 && s.length < 600);

  for (const line of potentialAuthorLines.slice(0, 10)) {
    if (isAuthorLine(line)) {
      const parsed = parseAuthors(line);
      if (parsed.length > 0) {
        authors.push(...parsed);
        break;
      }
    }
  }

  // --- ABSTRACT EXTRACTION ---
  let abstract = "";
  const lowerText = cleaned.toLowerCase();
  const abstractIdx = lowerText.indexOf("abstract");

  if (abstractIdx !== -1) {
    const afterAbstract = cleaned.substring(abstractIdx + 8).trim();
    // Find end of abstract (next section heading)
    const endPatterns = [
      /\b(1\.?\s*)?introduction\b/i,
      /\bkeywords?\b/i,
      /\b(1\.?\s*)?background\b/i,
      /\bindex terms\b/i,
    ];

    let endIdx = 2000;
    for (const pattern of endPatterns) {
      const match = afterAbstract.match(pattern);
      if (match && match.index && match.index > 20 && match.index < endIdx) {
        endIdx = match.index;
      }
    }

    abstract = afterAbstract.substring(0, endIdx).trim();
    // Clean abstract - remove leading/trailing non-text
    abstract = abstract.replace(/^[\s\-:]+/, "").trim();
  }

  if (!abstract || abstract.length < 50) {
    // Fallback: use first substantial paragraph
    const fallbackSegments = splitIntoSegments(cleaned);
    abstract = fallbackSegments.slice(0, 5).join(" ").substring(0, 800);
  }

  // Trim abstract to reasonable length
  if (abstract.length > 1500) {
    abstract = abstract.substring(0, 1500).trim() + "...";
  }

  // --- YEAR EXTRACTION ---
  // Look for arXiv ID pattern first (more reliable)
  const arxivMatch = text.match(/arXiv:\s*(\d{4})\./i);
  const dateMatch = text.match(
    /(?:published|submitted|received|accepted|date)[:\s]*\w*\s*\d{1,2}?,?\s*((?:19|20)\d{2})/i
  );
  // Fallback: find 4-digit year (prefer 2000s, in first page)
  const yearMatches = firstPage.match(/\b(20[0-2]\d)\b/g);
  const year =
    arxivMatch?.[1] ||
    dateMatch?.[1] ||
    (yearMatches ? yearMatches[0] : undefined) ||
    text.match(/\b(19|20)\d{2}\b/)?.[0];

  return {
    title,
    authors: authors.length > 0 ? authors : ["Unknown Author"],
    abstract: abstract || "No abstract available.",
    year,
  };
}

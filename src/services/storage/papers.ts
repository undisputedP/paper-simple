"use client";

import type { Paper } from "@/types/paper";

const STORAGE_KEY = "papersimple_papers";

export function getSavedPapers(): Paper[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function savePaper(paper: Paper): void {
  const papers = getSavedPapers();
  const idx = papers.findIndex((p) => p.id === paper.id);
  if (idx >= 0) {
    papers[idx] = paper;
  } else {
    papers.unshift(paper);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(papers));
}

export function deletePaper(id: string): void {
  const papers = getSavedPapers().filter((p) => p.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(papers));
}

export function getPaper(id: string): Paper | undefined {
  return getSavedPapers().find((p) => p.id === id);
}

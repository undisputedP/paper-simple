"use client";

import { useState, useEffect, useCallback } from "react";
import type { Paper } from "@/types/paper";
import {
  getSavedPapers,
  deletePaper as removeFromStorage,
} from "@/services/storage/papers";

export function usePaperLibrary() {
  const [papers, setPapers] = useState<Paper[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setPapers(getSavedPapers());
  }, []);

  const refresh = useCallback(() => {
    setPapers(getSavedPapers());
  }, []);

  const deletePaper = useCallback((id: string) => {
    removeFromStorage(id);
    setPapers((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const filtered = papers.filter(
    (p) =>
      !search ||
      p.metadata.title.toLowerCase().includes(search.toLowerCase()) ||
      p.metadata.authors.some((a) =>
        a.toLowerCase().includes(search.toLowerCase())
      )
  );

  return { papers: filtered, search, setSearch, deletePaper, refresh };
}

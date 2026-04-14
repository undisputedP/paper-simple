"use client";

import type { Paper } from "@/types/paper";
import { PaperCard } from "./PaperCard";
import { FileX } from "lucide-react";

interface PaperGridProps {
  papers: Paper[];
  onDelete: (id: string) => void;
}

export function PaperGrid({ papers, onDelete }: PaperGridProps) {
  if (papers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <FileX className="mb-3 h-12 w-12 text-muted-foreground/30" />
        <h3 className="text-lg font-semibold">No papers yet</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Papers you explain will appear here automatically.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {papers.map((paper) => (
        <PaperCard key={paper.id} paper={paper} onDelete={onDelete} />
      ))}
    </div>
  );
}

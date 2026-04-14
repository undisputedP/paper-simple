"use client";

import type { Paper } from "@/types/paper";
import { FileText, Trash2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface PaperCardProps {
  paper: Paper;
  onDelete: (id: string) => void;
}

export function PaperCard({ paper, onDelete }: PaperCardProps) {
  const date = new Date(paper.savedAt);
  const depthCount = Object.keys(paper.explanations).length;

  return (
    <div className="group rounded-xl border border-border/50 bg-card p-5 transition-shadow hover:shadow-lg hover:shadow-primary/5">
      <div className="mb-3 flex items-start justify-between">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <FileText className="h-5 w-5" />
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:text-destructive"
          onClick={() => onDelete(paper.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <h3 className="mb-1 font-semibold text-sm leading-tight line-clamp-2">
        {paper.metadata.title}
      </h3>

      <p className="mb-3 text-xs text-muted-foreground line-clamp-1">
        {paper.metadata.authors.slice(0, 2).join(", ")}
        {paper.metadata.authors.length > 2 && " et al."}
      </p>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="h-3 w-3" />
          {date.toLocaleDateString()}
        </div>
        <div className="flex gap-1">
          <Badge variant="outline" className="text-[10px] px-1.5 py-0">
            {depthCount} depth{depthCount !== 1 ? "s" : ""}
          </Badge>
          {paper.qaHistory.length > 0 && (
            <Badge variant="outline" className="text-[10px] px-1.5 py-0">
              {Math.floor(paper.qaHistory.length / 2)} Q&A
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}

import type { PaperMetadata } from "@/types/paper";
import { Badge } from "@/components/ui/badge";
import { User, Calendar } from "lucide-react";

interface PaperHeaderProps {
  metadata: PaperMetadata;
}

export function PaperHeader({ metadata }: PaperHeaderProps) {
  return (
    <div className="rounded-xl border border-border/50 bg-card p-6">
      <h2 className="text-xl font-bold leading-tight md:text-2xl">
        {metadata.title}
      </h2>

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <User className="h-3.5 w-3.5" />
          {metadata.authors.slice(0, 3).join(", ")}
          {metadata.authors.length > 3 && ` +${metadata.authors.length - 3} more`}
        </div>
        {metadata.year && (
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            {metadata.year}
          </div>
        )}
        {metadata.journal && (
          <Badge variant="secondary">{metadata.journal}</Badge>
        )}
      </div>

      {metadata.abstract && (
        <div className="mt-4">
          <h4 className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Abstract
          </h4>
          <p className="text-sm leading-relaxed text-muted-foreground line-clamp-4">
            {metadata.abstract}
          </p>
        </div>
      )}
    </div>
  );
}

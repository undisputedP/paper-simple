"use client";

import { usePaperLibrary } from "@/hooks/usePaperLibrary";
import { PaperGrid } from "@/components/library/PaperGrid";
import { Input } from "@/components/ui/input";
import { Search, Library } from "lucide-react";

export default function LibraryContent() {
  const { papers, search, setSearch, deletePaper } = usePaperLibrary();

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Library className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold">Your Library</h1>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            All the papers you&apos;ve explained, saved locally in your browser.
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search papers..."
            className="pl-9"
          />
        </div>
      </div>

      <PaperGrid papers={papers} onDelete={deletePaper} />
    </div>
  );
}

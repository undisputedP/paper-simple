"use client";

import { useCallback, useState } from "react";
import { Upload, FileText, AlertCircle, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { validatePdfFile } from "@/lib/security";

interface PdfUploaderProps {
  onFileSelect: (file: File) => void;
  disabled?: boolean;
}

export function PdfUploader({ onFileSelect, disabled }: PdfUploaderProps) {
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validating, setValidating] = useState(false);

  const handleFile = useCallback(
    async (file: File) => {
      setError(null);
      setValidating(true);

      const result = await validatePdfFile(file);

      setValidating(false);

      if (!result.valid) {
        setError(result.error || "Invalid file.");
        return;
      }

      onFileSelect(file);
    },
    [onFileSelect]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  return (
    <div className="mx-auto max-w-2xl">
      <div
        className={`relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-12 text-center transition-all ${
          dragging
            ? "border-primary bg-primary/5 scale-[1.02]"
            : "border-border hover:border-primary/50 hover:bg-muted/30"
        } ${disabled || validating ? "pointer-events-none opacity-50" : "cursor-pointer"}`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() =>
          !disabled &&
          !validating &&
          document.getElementById("pdf-upload-input")?.click()
        }
      >
        <input
          id="pdf-upload-input"
          type="file"
          accept=".pdf,application/pdf"
          className="hidden"
          onChange={handleChange}
          disabled={disabled || validating}
        />

        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          {validating ? (
            <Shield className="h-8 w-8 animate-pulse" />
          ) : dragging ? (
            <FileText className="h-8 w-8" />
          ) : (
            <Upload className="h-8 w-8" />
          )}
        </div>

        <h3 className="mb-1 text-lg font-semibold">
          {validating
            ? "Validating file..."
            : dragging
              ? "Drop it here!"
              : "Upload a Research Paper"}
        </h3>
        <p className="mb-4 text-sm text-muted-foreground">
          Drag and drop a PDF file, or click to browse
        </p>
        <Button variant="outline" size="sm" disabled={disabled || validating}>
          Browse Files
        </Button>
        <p className="mt-3 text-xs text-muted-foreground">
          PDF files up to 50MB &middot; Files are validated for security
        </p>
      </div>

      {error && (
        <div className="mt-3 flex items-center gap-2 rounded-lg bg-destructive/10 px-4 py-2 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}
    </div>
  );
}

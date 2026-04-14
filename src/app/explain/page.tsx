"use client";

import { useExplainer } from "@/hooks/useExplainer";
import { PdfUploader } from "@/components/explainer/PdfUploader";
import { PaperHeader } from "@/components/explainer/PaperHeader";
import { DepthSlider } from "@/components/explainer/DepthSlider";
import { Explanation } from "@/components/explainer/Explanation";
import { PaperMap } from "@/components/explainer/PaperMap";
import { SoWhat } from "@/components/explainer/SoWhat";
import { QAChat } from "@/components/explainer/QAChat";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, RotateCcw, BookOpen, Save } from "lucide-react";
import { motion } from "framer-motion";

export default function ExplainPage() {
  const {
    status,
    paper,
    currentDepth,
    currentExplanation,
    error,
    qaLoading,
    processFile,
    changeDepth,
    askQuestion,
    reset,
  } = useExplainer();

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      {/* Demo mode banner */}
      <div className="mb-6 flex items-center justify-center gap-2 rounded-lg border border-primary/20 bg-primary/5 px-4 py-2 text-sm text-primary">
        <BookOpen className="h-4 w-4" />
        <span>
          <strong>Demo Mode</strong> — Showing sample explanations. Live AI
          coming soon!
        </span>
      </div>

      {status === "idle" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Explain a Research Paper
            </h1>
            <p className="mt-2 text-muted-foreground">
              Upload any research paper PDF and we'll break it down for you.
            </p>
          </div>
          <PdfUploader onFileSelect={processFile} />
        </motion.div>
      )}

      {(status === "extracting" || status === "explaining") && (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="mb-4 h-10 w-10 animate-spin text-primary" />
          <h2 className="text-xl font-semibold">
            {status === "extracting"
              ? "Reading your paper..."
              : "Generating explanation..."}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {status === "extracting"
              ? "Extracting text from your PDF"
              : "Breaking it down into simple language"}
          </p>
        </div>
      )}

      {status === "error" && (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="mb-4 rounded-full bg-destructive/10 p-4 text-destructive">
            <span className="text-2xl">!</span>
          </div>
          <h2 className="text-xl font-semibold">Something went wrong</h2>
          <p className="mt-1 text-sm text-muted-foreground">{error}</p>
          <Button variant="outline" className="mt-4 gap-2" onClick={reset}>
            <RotateCcw className="h-4 w-4" />
            Try Again
          </Button>
        </div>
      )}

      {status === "ready" && paper && currentExplanation && (
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Paper Explanation</h1>
            <div className="flex gap-2">
              <Badge variant="secondary" className="gap-1">
                <Save className="h-3 w-3" />
                Saved
              </Badge>
              <Button variant="outline" size="sm" onClick={reset}>
                <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
                New Paper
              </Button>
            </div>
          </div>

          <PaperHeader metadata={paper.metadata} />

          <DepthSlider
            current={currentDepth}
            onChange={changeDepth}
            disabled={status !== "ready"}
          />

          <PaperMap nodes={currentExplanation.paperMap} />

          <Explanation sections={currentExplanation.sections} />

          {/* Key Terms */}
          {currentExplanation.keyTerms.length > 0 && (
            <div className="rounded-xl border border-border/50 bg-card p-5">
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Key Terms Glossary
              </h3>
              <div className="grid gap-2 sm:grid-cols-2">
                {currentExplanation.keyTerms.map((kt) => (
                  <div key={kt.term} className="rounded-lg bg-muted/30 p-3">
                    <span className="font-semibold text-sm">{kt.term}</span>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {kt.definition}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <SoWhat points={currentExplanation.soWhat} />

          <QAChat
            messages={paper.qaHistory}
            onSend={askQuestion}
            loading={qaLoading}
          />
        </motion.div>
      )}
    </div>
  );
}

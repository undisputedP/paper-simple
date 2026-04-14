"use client";

import { useState, useCallback } from "react";
import type {
  Paper,
  DepthLevel,
  Explanation,
  QAMessage,
} from "@/types/paper";
import { aiService } from "@/services/ai/mock";
import { extractTextFromPdf, extractMetadata } from "@/services/pdf/parser";
import { savePaper } from "@/services/storage/papers";
import { getCachedExplanation, cacheExplanation } from "@/services/cache/supabase-cache";
import { clientRateLimit, sanitizeText } from "@/lib/security";

interface ExplainerState {
  status: "idle" | "extracting" | "explaining" | "ready" | "error";
  paper: Paper | null;
  currentDepth: DepthLevel;
  currentExplanation: Explanation | null;
  error: string | null;
  qaLoading: boolean;
}

export function useExplainer() {
  const [state, setState] = useState<ExplainerState>({
    status: "idle",
    paper: null,
    currentDepth: "high-school",
    currentExplanation: null,
    error: null,
    qaLoading: false,
  });

  const processFile = useCallback(async (file: File) => {
    // Rate limit: max 5 papers per minute
    const rateCheck = clientRateLimit("explain", 5, 60_000);
    if (!rateCheck.allowed) {
      setState((s) => ({
        ...s,
        status: "error",
        error: `Too many requests. Please wait ${Math.ceil(rateCheck.retryAfterMs / 1000)} seconds.`,
      }));
      return;
    }

    setState((s) => ({
      ...s,
      status: "extracting",
      error: null,
    }));

    try {
      const rawText = await extractTextFromPdf(file);
      const metadata = extractMetadata(rawText);

      const paper: Paper = {
        id: crypto.randomUUID(),
        metadata,
        rawText,
        explanations: {},
        qaHistory: [],
        savedAt: Date.now(),
      };

      setState((s) => ({
        ...s,
        status: "explaining",
        paper,
      }));

      const depth: DepthLevel = "high-school";

      // Check Supabase cache first
      let explanation = await getCachedExplanation(rawText, depth);

      if (!explanation) {
        // Cache miss — generate and cache
        explanation = await aiService.explainPaper(rawText, depth);
        cacheExplanation(rawText, depth, explanation);
      }

      paper.explanations[depth] = explanation;
      savePaper(paper);

      setState({
        status: "ready",
        paper,
        currentDepth: depth,
        currentExplanation: explanation,
        error: null,
        qaLoading: false,
      });
    } catch (err) {
      setState((s) => ({
        ...s,
        status: "error",
        error:
          err instanceof Error
            ? err.message
            : "Failed to process PDF. Please try another file.",
      }));
    }
  }, []);

  const changeDepth = useCallback(
    async (depth: DepthLevel) => {
      if (!state.paper) return;

      // Check local cache first
      const localCached = state.paper.explanations[depth];
      if (localCached) {
        setState((s) => ({
          ...s,
          currentDepth: depth,
          currentExplanation: localCached,
        }));
        return;
      }

      setState((s) => ({
        ...s,
        status: "explaining",
        currentDepth: depth,
      }));

      try {
        // Check Supabase cache
        let explanation = await getCachedExplanation(state.paper.rawText, depth);

        if (!explanation) {
          explanation = await aiService.explainPaper(state.paper.rawText, depth);
          cacheExplanation(state.paper.rawText, depth, explanation);
        }

        const updatedPaper = {
          ...state.paper,
          explanations: { ...state.paper.explanations, [depth]: explanation },
        };
        savePaper(updatedPaper);

        setState((s) => ({
          ...s,
          status: "ready",
          paper: updatedPaper,
          currentExplanation: explanation,
        }));
      } catch {
        setState((s) => ({
          ...s,
          status: "ready",
          error: "Failed to generate explanation at this depth.",
        }));
      }
    },
    [state.paper]
  );

  const askQuestion = useCallback(
    async (question: string) => {
      if (!state.paper) return;

      // Rate limit: max 20 questions per minute
      const rateCheck = clientRateLimit("question", 20, 60_000);
      if (!rateCheck.allowed) return;

      // Sanitize input
      const cleanQuestion = sanitizeText(question);
      if (!cleanQuestion) return;

      const userMsg: QAMessage = {
        id: crypto.randomUUID(),
        role: "user",
        content: cleanQuestion,
        timestamp: Date.now(),
      };

      const updatedHistory = [...state.paper.qaHistory, userMsg];
      setState((s) => ({
        ...s,
        qaLoading: true,
        paper: s.paper
          ? { ...s.paper, qaHistory: updatedHistory }
          : null,
      }));

      try {
        const response = await aiService.askQuestion(
          state.paper.rawText,
          cleanQuestion,
          updatedHistory
        );

        const assistantMsg: QAMessage = {
          id: crypto.randomUUID(),
          role: "assistant",
          content: response,
          timestamp: Date.now(),
        };

        const finalHistory = [...updatedHistory, assistantMsg];
        const updatedPaper = {
          ...state.paper,
          qaHistory: finalHistory,
        };
        savePaper(updatedPaper);

        setState((s) => ({
          ...s,
          qaLoading: false,
          paper: updatedPaper,
        }));
      } catch {
        setState((s) => ({
          ...s,
          qaLoading: false,
        }));
      }
    },
    [state.paper]
  );

  const reset = useCallback(() => {
    setState({
      status: "idle",
      paper: null,
      currentDepth: "high-school",
      currentExplanation: null,
      error: null,
      qaLoading: false,
    });
  }, []);

  return {
    ...state,
    processFile,
    changeDepth,
    askQuestion,
    reset,
  };
}

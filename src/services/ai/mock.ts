import type {
  AIService,
  Explanation,
  DepthLevel,
  QAMessage,
} from "@/types/paper";

// ─────────────────────────────────────────────
// Common English stopwords to filter out
// ─────────────────────────────────────────────
const STOPWORDS = new Set([
  "the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for", "of",
  "with", "by", "from", "is", "are", "was", "were", "be", "been", "being",
  "have", "has", "had", "do", "does", "did", "will", "would", "could",
  "should", "may", "might", "can", "shall", "that", "this", "these", "those",
  "it", "its", "we", "our", "they", "their", "them", "he", "she", "his",
  "her", "not", "no", "if", "then", "than", "as", "so", "also", "more",
  "most", "such", "each", "which", "where", "when", "what", "how", "who",
  "all", "both", "any", "some", "many", "much", "very", "just", "only",
  "still", "even", "well", "back", "about", "up", "out", "into", "over",
  "after", "before", "between", "through", "during", "while", "because",
  "since", "until", "although", "however", "therefore", "thus", "hence",
  "use", "used", "using", "one", "two", "three", "new", "first", "show",
  "shown", "shows", "based", "paper", "approach", "propose", "proposed",
  "result", "results", "method", "table", "figure", "section", "et", "al",
  "work", "different", "number", "set", "see", "given", "following",
  "respectively", "i.e", "e.g", "fig", "eq", "ref", "able", "per",
]);

// ─────────────────────────────────────────────
// Text Analysis Engine
// ─────────────────────────────────────────────

interface PaperAnalysis {
  abstract: string;
  sectionContents: Map<string, string>;
  sectionOrder: string[];
  keyTerms: { term: string; count: number }[];
  keySentences: {
    problem: string[];
    method: string[];
    results: string[];
    impact: string[];
  };
  metrics: string[];
  mainTopic: string;
}

/**
 * Find sentences in text that match certain criteria
 */
function findSentences(
  text: string,
  keywords: string[],
  maxCount: number = 3
): string[] {
  const sentences = text
    .replace(/\s+/g, " ")
    .split(/(?<=[.!?])\s+/)
    .filter((s) => s.length > 30 && s.length < 400);

  const scored = sentences.map((s) => {
    const lower = s.toLowerCase();
    let score = 0;
    for (const kw of keywords) {
      if (lower.includes(kw.toLowerCase())) score++;
    }
    // Prefer sentences that aren't just references
    if (/\[\d+\]/.test(s)) score -= 0.5;
    if (/fig\w*\s*\d/i.test(s)) score -= 0.5;
    return { sentence: s, score };
  });

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, maxCount)
    .filter((s) => s.score > 0)
    .map((s) => s.sentence.trim());
}

/**
 * Extract the most frequent meaningful terms from the text
 */
function extractKeyTerms(
  text: string,
  count: number = 10
): { term: string; count: number }[] {
  const words = text.toLowerCase().match(/[a-z][a-z-]{2,}/g) || [];
  const freq = new Map<string, number>();

  for (const word of words) {
    if (STOPWORDS.has(word) || word.length < 4) continue;
    freq.set(word, (freq.get(word) || 0) + 1);
  }

  // Also find bigrams (two-word terms are often more meaningful)
  const tokens = text.toLowerCase().split(/\s+/);
  for (let i = 0; i < tokens.length - 1; i++) {
    const a = tokens[i].replace(/[^a-z-]/g, "");
    const b = tokens[i + 1].replace(/[^a-z-]/g, "");
    if (
      a.length >= 3 &&
      b.length >= 3 &&
      !STOPWORDS.has(a) &&
      !STOPWORDS.has(b)
    ) {
      const bigram = `${a} ${b}`;
      freq.set(bigram, (freq.get(bigram) || 0) + 2); // weight bigrams higher
    }
  }

  return Array.from(freq.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, count)
    .map(([term, c]) => ({
      term: term
        .split(" ")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" "),
      count: c,
    }));
}

/**
 * Detect and extract paper sections
 */
function extractSections(text: string): {
  contents: Map<string, string>;
  order: string[];
} {
  const contents = new Map<string, string>();
  const order: string[] = [];

  // Common section heading patterns
  const headingPattern =
    /(?:^|\n)\s*(?:\d+\.?\s+)?(Abstract|Introduction|Related\s+Work|Background|Methodology|Methods?|Model(?:\s+Architecture)?|Approach|Framework|Experiments?|Results?(?:\s+and\s+Discussion)?|Discussion|Conclusion|Summary|Training|Evaluation|Analysis|Implementation)\b/gi;

  const matches: { name: string; index: number }[] = [];
  let match;
  while ((match = headingPattern.exec(text)) !== null) {
    matches.push({
      name: match[1].trim(),
      index: match.index,
    });
  }

  for (let i = 0; i < matches.length; i++) {
    const start = matches[i].index + matches[i].name.length;
    const end = i + 1 < matches.length ? matches[i + 1].index : start + 5000;
    const content = text
      .substring(start, Math.min(end, start + 5000))
      .replace(/\s+/g, " ")
      .trim();
    if (content.length > 50) {
      const name = matches[i].name;
      contents.set(name.toLowerCase(), content);
      order.push(name);
    }
  }

  return { contents, order };
}

/**
 * Extract numerical metrics and results from text
 */
function extractMetrics(text: string): string[] {
  const patterns = [
    // BLEU, accuracy, F1 scores etc.
    /(?:achieve|obtain|reach|score|improve)\w*\s+(?:a\s+)?(?:(?:BLEU|accuracy|F1|precision|recall|score)\s+(?:of\s+)?)?(\d+\.?\d*)\s*%?\s*(?:BLEU|accuracy|F1|points?)?/gi,
    // "X% improvement"
    /(\d+\.?\d*)\s*%?\s*(?:improvement|reduction|increase|better|higher|lower)/gi,
    // "state-of-the-art" or "SOTA"
    /(?:state-of-the-art|SOTA|new record|best[\s-]?(?:known|result)|outperform)/gi,
  ];

  const results: string[] = [];
  for (const pattern of patterns) {
    let m;
    while ((m = pattern.exec(text)) !== null) {
      const context = text.substring(
        Math.max(0, m.index - 40),
        Math.min(text.length, m.index + m[0].length + 40)
      );
      results.push(context.replace(/\s+/g, " ").trim());
    }
  }

  return [...new Set(results)].slice(0, 5);
}

/**
 * Analyze the full paper text and extract structured information
 */
function analyzePaper(text: string): PaperAnalysis {
  const cleaned = text.replace(/\s+/g, " ");

  // Extract abstract
  let abstract = "";
  const absIdx = cleaned.toLowerCase().indexOf("abstract");
  if (absIdx !== -1) {
    const after = cleaned.substring(absIdx + 8, absIdx + 2000);
    const endMatch = after.match(
      /\b(?:1\.?\s*)?(?:introduction|keywords?|index\s+terms)\b/i
    );
    abstract = after.substring(0, endMatch?.index || 1000).trim();
  }
  if (abstract.length < 50) {
    abstract = cleaned.substring(0, 1000);
  }

  // Extract sections
  const { contents: sectionContents, order: sectionOrder } =
    extractSections(text);

  // Extract key terms
  const keyTerms = extractKeyTerms(text, 12);

  // Detect main topic from abstract + title
  const mainTopic =
    keyTerms.length > 0
      ? keyTerms
          .slice(0, 3)
          .map((t) => t.term)
          .join(", ")
      : "this research topic";

  // Extract key sentences for each section type
  const problemKeywords = [
    "problem",
    "challenge",
    "limitation",
    "gap",
    "issue",
    "difficult",
    "lack",
    "fail",
    "suffer",
    "bottleneck",
    "drawback",
    "expensive",
    "slow",
    "sequential",
    "constraint",
  ];
  const methodKeywords = [
    "propose",
    "introduce",
    "present",
    "novel",
    "architecture",
    "framework",
    "mechanism",
    "algorithm",
    "design",
    "develop",
    "model",
    "technique",
    "component",
    "layer",
    "function",
  ];
  const resultKeywords = [
    "achieve",
    "outperform",
    "improve",
    "accuracy",
    "score",
    "BLEU",
    "F1",
    "state-of-the-art",
    "better",
    "faster",
    "superior",
    "significant",
    "baseline",
    "compared",
  ];
  const impactKeywords = [
    "impact",
    "enable",
    "future",
    "potential",
    "application",
    "demonstrate",
    "open",
    "extend",
    "foundation",
    "widely",
    "broadly",
    "significant",
    "advance",
    "contribute",
  ];

  const introText =
    sectionContents.get("introduction") || cleaned.substring(0, 3000);
  const methodText =
    sectionContents.get("method") ||
    sectionContents.get("methods") ||
    sectionContents.get("model architecture") ||
    sectionContents.get("methodology") ||
    sectionContents.get("approach") ||
    sectionContents.get("framework") ||
    "";
  const resultsText =
    sectionContents.get("results") ||
    sectionContents.get("experiments") ||
    sectionContents.get("results and discussion") ||
    sectionContents.get("evaluation") ||
    "";
  const conclusionText =
    sectionContents.get("conclusion") ||
    sectionContents.get("discussion") ||
    sectionContents.get("summary") ||
    "";

  const keySentences = {
    problem: findSentences(introText || abstract, problemKeywords, 3),
    method: findSentences(methodText || abstract, methodKeywords, 3),
    results: findSentences(resultsText || abstract, resultKeywords, 3),
    impact: findSentences(
      conclusionText || abstract,
      impactKeywords,
      3
    ),
  };

  // Extract metrics
  const metrics = extractMetrics(text);

  return {
    abstract,
    sectionContents,
    sectionOrder,
    keyTerms,
    keySentences,
    metrics,
    mainTopic,
  };
}

// ─────────────────────────────────────────────
// Explanation Generator
// ─────────────────────────────────────────────

function trimToSentence(text: string, maxLen: number): string {
  if (text.length <= maxLen) return text;
  const cut = text.substring(0, maxLen);
  const lastPeriod = cut.lastIndexOf(".");
  if (lastPeriod > maxLen * 0.5) {
    return cut.substring(0, lastPeriod + 1);
  }
  return cut.trim() + "...";
}

function generateExplanation(
  text: string,
  depth: DepthLevel
): Explanation {
  const analysis = analyzePaper(text);
  const isHS = depth === "high-school";
  const isUG = depth === "undergrad";
  const isGrad = depth === "graduate";

  const topTerms = analysis.keyTerms.slice(0, 5).map((t) => t.term);
  const topicLabel =
    topTerms.length > 0 ? topTerms.slice(0, 2).join(" and ") : "this topic";

  // ── Build Sections ──

  const problemSentences = analysis.keySentences.problem;
  const methodSentences = analysis.keySentences.method;
  const resultSentences = analysis.keySentences.results;
  const impactSentences = analysis.keySentences.impact;

  const abstractSummary = trimToSentence(analysis.abstract, 500);

  const sections = [
    {
      title: "The Problem",
      icon: "help-circle",
      content: isHS
        ? `Here's what this paper is tackling: ${abstractSummary}\n\nIn simpler terms, the researchers saw that existing approaches to ${topicLabel} had real limitations. ${problemSentences.length > 0 ? problemSentences[0] : "They wanted to find a better way."} This is a big deal because if we can solve this, it opens up much better technology for everyone.`
        : isUG
          ? `This paper addresses key limitations in the field of ${topicLabel}. ${abstractSummary}\n\n${problemSentences.length > 0 ? problemSentences.map((s) => s).join(" ") : "The existing approaches had significant shortcomings that motivated this work."}`
          : isGrad
            ? `The paper identifies fundamental limitations in current approaches to ${topicLabel}. ${problemSentences.length > 0 ? problemSentences.join(" ") : abstractSummary}\n\nThe abstract states: "${trimToSentence(analysis.abstract, 300)}"`
            : `${abstractSummary}\n\n${problemSentences.length > 0 ? "Specific limitations identified: " + problemSentences.join(" ") : "The work addresses gaps in the existing literature on " + topicLabel + "."}`,
    },
    {
      title: "The Approach",
      icon: "lightbulb",
      content: isHS
        ? `The researchers came up with a creative solution involving ${topicLabel}. ${methodSentences.length > 0 ? methodSentences[0] : "They designed a new approach that works differently from what came before."}\n\n${methodSentences.length > 1 ? "Specifically, " + methodSentences[1] : "Their key idea was to rethink the standard approach and build something that addresses the core problem directly."} Think of it as building a completely new tool instead of just patching the old one.`
        : isUG
          ? `The authors propose a novel approach centered on ${topicLabel}. ${methodSentences.join(" ")}\n\n${analysis.metrics.length > 0 ? "The method was evaluated with metrics including: " + analysis.metrics.slice(0, 2).join("; ") + "." : ""}`
          : isGrad
            ? `The core technical contribution involves ${topicLabel}. ${methodSentences.join(" ")}\n\nKey components include: ${topTerms.join(", ")}. ${analysis.metrics.length > 0 ? "Evaluation metrics: " + analysis.metrics.join("; ") : ""}`
            : `${methodSentences.join(" ")}\n\nThe paper introduces advances in: ${topTerms.join(", ")}. ${analysis.metrics.length > 0 ? "\n\nQuantitative evaluation: " + analysis.metrics.join("; ") : ""}`,
    },
    {
      title: "The Discovery",
      icon: "sparkles",
      content: isHS
        ? `The results were impressive. ${resultSentences.length > 0 ? resultSentences[0] : "Their new approach performed significantly better than previous methods."}\n\n${analysis.metrics.length > 0 ? "In numbers, they found: " + analysis.metrics[0] + ". " : ""}${resultSentences.length > 1 ? resultSentences[1] : "This isn't just a small improvement — it represents a real step forward in the field."}`
        : isUG
          ? `The experimental results demonstrate significant improvements. ${resultSentences.join(" ")}\n\n${analysis.metrics.length > 0 ? "Key results: " + analysis.metrics.join("; ") : "The approach outperformed existing baselines across evaluation metrics."}`
          : isGrad
            ? `${resultSentences.join(" ")}\n\n${analysis.metrics.length > 0 ? "Quantitative results:\n" + analysis.metrics.map((m) => "- " + m).join("\n") : "Results demonstrate improvements over existing approaches."}`
            : `${resultSentences.join(" ")}\n\n${analysis.metrics.length > 0 ? "Empirical results:\n" + analysis.metrics.map((m) => "- " + m).join("\n") : ""}`,
    },
    {
      title: "The Impact",
      icon: "rocket",
      content: isHS
        ? `So why does this matter? ${impactSentences.length > 0 ? impactSentences[0] : "This research on " + topicLabel + " could change how we build technology."}\n\nThe advances in ${topicLabel} from this paper could lead to better tools that affect your daily life — from smarter apps to better translation services to more capable AI assistants. ${impactSentences.length > 1 ? impactSentences[1] : "It's the kind of research that other scientists will build on for years to come."}`
        : isUG
          ? `This work has significant implications for ${topicLabel} and adjacent fields. ${impactSentences.join(" ")}\n\nThe contributions extend the current state of the art and open new research directions.`
          : isGrad
            ? `${impactSentences.join(" ")}\n\nThe theoretical and practical contributions to ${topicLabel} establish a new foundation for future work in this area.`
            : `${impactSentences.join(" ")}\n\nBroader implications span ${topicLabel} and related domains, with potential for significant impact on both theoretical understanding and practical applications.`,
    },
  ];

  // ── Build Paper Map (from actual sections) ──
  const detectColor = (name: string): string => {
    const n = name.toLowerCase();
    if (
      n.includes("intro") ||
      n.includes("problem") ||
      n.includes("background") ||
      n.includes("related")
    )
      return "#EF4444";
    if (
      n.includes("method") ||
      n.includes("model") ||
      n.includes("approach") ||
      n.includes("architecture") ||
      n.includes("framework")
    )
      return "#F97316";
    if (
      n.includes("result") ||
      n.includes("experiment") ||
      n.includes("eval") ||
      n.includes("training")
    )
      return "#10B981";
    if (
      n.includes("conclu") ||
      n.includes("discuss") ||
      n.includes("summary") ||
      n.includes("future")
    )
      return "#7C3AED";
    return "#6B7280";
  };

  let paperMap;
  if (analysis.sectionOrder.length >= 3) {
    // Use actual paper sections
    paperMap = analysis.sectionOrder.slice(0, 6).map((name, i) => {
      const content = analysis.sectionContents.get(name.toLowerCase()) || "";
      const firstSentence = content.split(/[.!?]/)[0]?.trim() || "";
      return {
        id: name.toLowerCase().replace(/\s+/g, "-"),
        label: name,
        description: isHS
          ? trimToSentence(firstSentence, 60)
          : trimToSentence(firstSentence, 80),
        color: detectColor(name),
      };
    });
  } else {
    // Fallback: generic structure with paper-specific content
    paperMap = [
      {
        id: "problem",
        label: "Problem",
        description: isHS
          ? `Limitations in ${topicLabel}`
          : `Addressing gaps in ${topicLabel}`,
        color: "#EF4444",
      },
      {
        id: "method",
        label: "Method",
        description: isHS
          ? `New approach using ${topTerms[0] || "novel techniques"}`
          : `Proposed framework for ${topicLabel}`,
        color: "#F97316",
      },
      {
        id: "findings",
        label: "Findings",
        description: isHS
          ? "Significant improvements found"
          : "Demonstrated improvements over baselines",
        color: "#10B981",
      },
      {
        id: "impact",
        label: "Impact",
        description: isHS
          ? `Advances ${topicLabel}`
          : `Broad implications for ${topicLabel}`,
        color: "#7C3AED",
      },
    ];
  }

  // ── Key Terms (from actual paper) ──
  const keyTerms = analysis.keyTerms.slice(0, 6).map((t) => {
    // Try to find a definition/context sentence in the text
    const termLower = t.term.toLowerCase();
    const contextPattern = new RegExp(
      `[^.]*\\b${termLower.replace(/\s+/g, "\\s+")}\\b[^.]*\\.`,
      "i"
    );
    const contextMatch = text.match(contextPattern);
    const contextSentence = contextMatch
      ? contextMatch[0].trim()
      : "";

    const definition = isHS
      ? contextSentence
        ? `From the paper: "${trimToSentence(contextSentence, 120)}"`
        : `A key concept in this paper (mentioned ${t.count} times)`
      : contextSentence
        ? trimToSentence(contextSentence, 150)
        : `Central concept in this work (frequency: ${t.count})`;

    return { term: t.term, definition };
  });

  // ── So What ──
  const soWhat = isHS
    ? [
        `This research on ${topicLabel} pushes the boundaries of what's possible in this field`,
        impactSentences[0] ||
          `The findings could lead to better tools and technology that affect everyday life`,
        `It demonstrates that challenging established approaches can lead to breakthroughs`,
        `Students and researchers can build on this work to create even better solutions`,
      ]
    : [
        impactSentences[0] ||
          `Establishes new benchmarks for ${topicLabel}`,
        `Provides a framework that can be extended to related domains`,
        analysis.metrics[0] ||
          `Demonstrates significant improvements over existing approaches`,
        `Opens new research directions at the intersection of ${topTerms.slice(0, 3).join(", ")}`,
      ];

  return { depth, sections, paperMap, soWhat, keyTerms };
}

// ─────────────────────────────────────────────
// Q&A (uses paper text for context)
// ─────────────────────────────────────────────

function generateQAResponse(paperText: string, question: string): string {
  const analysis = analyzePaper(paperText);
  const q = question.toLowerCase();
  const topTerms = analysis.keyTerms.slice(0, 5).map((t) => t.term);

  if (q.includes("method") || q.includes("how") || q.includes("approach")) {
    const methodSentences = analysis.keySentences.method;
    if (methodSentences.length > 0) {
      return `Based on the paper, here's what the researchers did:\n\n${methodSentences.join("\n\n")}\n\nThe key technical concepts involved are: ${topTerms.join(", ")}.`;
    }
    return `The paper's approach centers on ${topTerms.join(", ")}. The researchers built on existing work but introduced key innovations in these areas.`;
  }

  if (q.includes("result") || q.includes("find") || q.includes("found") || q.includes("performance")) {
    const resultSentences = analysis.keySentences.results;
    if (resultSentences.length > 0 || analysis.metrics.length > 0) {
      return `Here are the key findings:\n\n${resultSentences.join("\n\n")}${analysis.metrics.length > 0 ? "\n\nSpecific metrics reported: " + analysis.metrics.join("; ") : ""}`;
    }
    return `The paper reports improvements in ${topTerms.join(", ")} over existing approaches. The results demonstrate the effectiveness of the proposed method.`;
  }

  if (q.includes("why") || q.includes("important") || q.includes("matter") || q.includes("significance")) {
    const impactSentences = analysis.keySentences.impact;
    return `This paper matters because:\n\n${impactSentences.length > 0 ? impactSentences.join("\n\n") : "It advances our understanding of " + topTerms.join(", ") + "."}\n\nThe work on ${analysis.mainTopic} has broad implications for the field and potential real-world applications.`;
  }

  if (q.includes("limit") || q.includes("weakness") || q.includes("drawback") || q.includes("future")) {
    // Look for limitation sentences
    const limitSentences = findSentences(paperText, [
      "limitation",
      "future work",
      "drawback",
      "challenge",
      "remain",
      "further",
      "not yet",
      "beyond the scope",
    ], 3);
    if (limitSentences.length > 0) {
      return `The paper acknowledges several limitations:\n\n${limitSentences.join("\n\n")}`;
    }
    return `While the paper makes significant contributions to ${analysis.mainTopic}, as with any research, there are areas for future work. The authors' approach to ${topTerms[0] || "the problem"} could be extended and validated in additional settings.`;
  }

  if (q.includes("abstract") || q.includes("summary") || q.includes("about")) {
    return `Here's what this paper is about:\n\n${trimToSentence(analysis.abstract, 600)}\n\nThe main topics covered are: ${topTerms.join(", ")}.`;
  }

  // Generic response using paper content
  const relevant = findSentences(paperText, question.split(/\s+/).filter((w) => w.length > 3), 3);
  if (relevant.length > 0) {
    return `Based on the paper, here's what I found relevant to your question:\n\n${relevant.join("\n\n")}\n\nThis relates to the paper's work on ${analysis.mainTopic}.`;
  }

  return `This paper focuses on ${analysis.mainTopic}. The key concepts are ${topTerms.join(", ")}.\n\nFrom the abstract: "${trimToSentence(analysis.abstract, 300)}"\n\nCould you rephrase your question? I can help with the method, results, limitations, or significance of this paper.`;
}

// ─────────────────────────────────────────────
// Service Export
// ─────────────────────────────────────────────

export class MockAIService implements AIService {
  async explainPaper(
    text: string,
    depth: DepthLevel
  ): Promise<Explanation> {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    return generateExplanation(text, depth);
  }

  async askQuestion(
    paperText: string,
    question: string,
    _history: QAMessage[]
  ): Promise<string> {
    await new Promise((resolve) => setTimeout(resolve, 800));
    return generateQAResponse(paperText, question);
  }
}

export const aiService = new MockAIService();

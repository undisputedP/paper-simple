export type DepthLevel = "high-school" | "undergrad" | "graduate" | "expert";

export interface PaperMetadata {
  title: string;
  authors: string[];
  abstract: string;
  year?: string;
  journal?: string;
}

export interface ExplanationSection {
  title: string;
  icon: string;
  content: string;
}

export interface PaperMapNode {
  id: string;
  label: string;
  description: string;
  color: string;
}

export interface Explanation {
  depth: DepthLevel;
  sections: ExplanationSection[];
  paperMap: PaperMapNode[];
  soWhat: string[];
  keyTerms: { term: string; definition: string }[];
}

export interface QAMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

export interface Paper {
  id: string;
  metadata: PaperMetadata;
  rawText: string;
  explanations: Partial<Record<DepthLevel, Explanation>>;
  qaHistory: QAMessage[];
  savedAt: number;
}

export interface AIService {
  explainPaper(text: string, depth: DepthLevel): Promise<Explanation>;
  askQuestion(
    paperText: string,
    question: string,
    history: QAMessage[]
  ): Promise<string>;
}

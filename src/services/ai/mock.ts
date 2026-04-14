import type {
  AIService,
  Explanation,
  DepthLevel,
  QAMessage,
} from "@/types/paper";

const DEPTH_LABELS: Record<DepthLevel, string> = {
  "high-school": "High School",
  undergrad: "Undergraduate",
  graduate: "Graduate",
  expert: "Expert",
};

function generateExplanation(
  text: string,
  depth: DepthLevel
): Explanation {
  const title = extractTitle(text);
  const isHighSchool = depth === "high-school";
  const isUndergrad = depth === "undergrad";

  const sections = [
    {
      title: "The Problem",
      icon: "help-circle",
      content: isHighSchool
        ? `Imagine you're trying to solve a really tough puzzle, but you don't even have all the pieces yet. That's basically what the researchers behind "${title}" were dealing with. They noticed something wasn't working the way everyone assumed it did, and they wanted to figure out why. Think of it like when your Wi-Fi keeps dropping — you know something's wrong, but you need to dig deeper to find the real cause.`
        : isUndergrad
          ? `The research addresses a fundamental gap in our current understanding. Previous work in this field had established baseline models, but key assumptions remained untested. The authors identified that existing approaches suffered from significant limitations when applied to real-world scenarios, prompting a systematic re-examination of the underlying framework.`
          : depth === "graduate"
            ? `This paper tackles a well-documented limitation in the existing literature. Prior methodological approaches, while theoretically sound, exhibited poor generalizability due to oversimplified assumptions about the underlying data distribution. The authors present a formal analysis of these failure modes and propose a principled correction.`
            : `The paper addresses the inconsistency between theoretical bounds and empirical performance observed in recent literature. Specifically, the authors demonstrate that prevailing assumptions about distributional stationarity are violated in practice, leading to systematic bias in downstream estimators. This work provides both the theoretical characterization of this failure mode and a constructive solution.`,
    },
    {
      title: "The Approach",
      icon: "lightbulb",
      content: isHighSchool
        ? `Here's where it gets cool. Instead of doing things the old way, the researchers tried something totally different — kind of like using a shortcut in a video game that nobody knew about. They built a new method that could handle messier, more realistic data. They tested it step by step, like a science fair project but way more advanced, making sure each part actually worked before moving on.`
        : isUndergrad
          ? `The researchers developed a novel framework that relaxes several key assumptions of prior work. Their approach combines established statistical methods with a new adaptive component that adjusts to the characteristics of the input data. The methodology was validated through a series of controlled experiments on both synthetic and real-world datasets.`
          : depth === "graduate"
            ? `The authors introduce a hybrid methodology combining non-parametric estimation with regularized optimization. The key technical contribution is a novel loss function that accounts for heteroscedasticity in the feature space. Convergence guarantees are provided under mild regularity conditions, with explicit finite-sample bounds.`
            : `The core contribution is a two-stage estimator: first, a sieve-based approximation to the nuisance parameter, followed by a targeted correction using influence functions. The authors establish root-n consistency and semiparametric efficiency under conditions substantially weaker than those required by existing methods. The proof leverages recent advances in empirical process theory.`,
    },
    {
      title: "The Discovery",
      icon: "sparkles",
      content: isHighSchool
        ? `And the results? Pretty mind-blowing. Their new method worked WAY better than what people were using before — like upgrading from a bicycle to a sports car. The improvements weren't tiny either; we're talking about a major jump in accuracy. The best part? It worked across lots of different types of data, not just one specific case. That's like finding a study hack that works for every subject, not just math.`
        : isUndergrad
          ? `The experimental results demonstrated significant improvements across all evaluation metrics. The proposed method achieved a substantial reduction in error rates compared to the baseline approaches, with particularly strong performance on challenging edge cases. Statistical significance was confirmed through rigorous hypothesis testing with appropriate corrections for multiple comparisons.`
          : depth === "graduate"
            ? `The proposed estimator achieved demonstrably lower MSE across all experimental conditions, with the improvement being most pronounced in high-dimensional settings. The empirical convergence rates matched the theoretical predictions. Ablation studies confirmed the necessity of each component of the proposed framework, and sensitivity analyses demonstrated robustness to hyperparameter choices.`
            : `The empirical results validate the theoretical predictions: the proposed estimator achieves the semiparametric efficiency bound in finite samples, with coverage rates of confidence intervals matching nominal levels. The improvement over plug-in estimators is most pronounced under model misspecification, confirming the double-robustness property. Cross-validation experiments on held-out data demonstrate genuine predictive improvement.`,
    },
    {
      title: "The Impact",
      icon: "rocket",
      content: isHighSchool
        ? `So why should you care? Because this research could change how we solve real problems — from making better medical diagnoses to creating smarter apps on your phone. It's like when someone figured out that washing hands prevents disease — a simple idea that changed everything. This paper opens up new doors that other scientists can now walk through, and the ripple effects could touch your everyday life sooner than you think.`
        : isUndergrad
          ? `This work has broad implications for both the research community and practical applications. The improved methodology enables more reliable analysis in domains ranging from healthcare to technology. The open-source implementation provided by the authors lowers the barrier to adoption. Several follow-up studies have already begun extending these results to related problem settings.`
          : depth === "graduate"
            ? `The theoretical contributions extend beyond the specific application domain. The general framework introduced here is applicable to any setting where distributional shift is a concern. The relaxed assumptions make the method viable for practitioners working with messy real-world data. The code release and reproducibility package facilitate direct comparison in future work.`
            : `This work resolves a longstanding open question in the field regarding the achievability of efficient estimation under minimal assumptions. The theoretical framework has immediate implications for causal inference, missing data problems, and transfer learning. The constructive proof technique — combining sieve estimation with targeted learning — provides a general template applicable to a broad class of semiparametric models.`,
    },
  ];

  const paperMap = [
    {
      id: "problem",
      label: "Problem",
      description: isHighSchool
        ? "Something isn't working right"
        : "Gap in existing approaches",
      color: "#EF4444",
    },
    {
      id: "method",
      label: "Method",
      description: isHighSchool
        ? "A clever new approach"
        : "Novel framework and methodology",
      color: "#F97316",
    },
    {
      id: "findings",
      label: "Findings",
      description: isHighSchool
        ? "It works much better!"
        : "Significant improvement in results",
      color: "#10B981",
    },
    {
      id: "impact",
      label: "Impact",
      description: isHighSchool
        ? "This changes the game"
        : "Broad implications for the field",
      color: "#7C3AED",
    },
  ];

  const soWhat = isHighSchool
    ? [
        "This could help doctors diagnose diseases faster and more accurately",
        "The technology behind your favorite apps could get smarter because of this",
        "It shows that questioning 'the way things are done' can lead to breakthroughs",
        "Students like you might use tools built on this research in college",
      ]
    : [
        "Enables more reliable decision-making in high-stakes domains",
        "Provides a general framework extensible to adjacent research areas",
        "Reduces the gap between theoretical models and practical applications",
        "Opens new avenues for interdisciplinary collaboration",
      ];

  const keyTerms = isHighSchool
    ? [
        {
          term: "Methodology",
          definition:
            "The game plan or recipe the researchers followed to do their experiment",
        },
        {
          term: "Hypothesis",
          definition:
            "An educated guess about what they thought would happen",
        },
        {
          term: "Data",
          definition:
            "The information they collected — like scores, measurements, or observations",
        },
        {
          term: "Statistical Significance",
          definition:
            "A fancy way of saying the results probably weren't just luck",
        },
      ]
    : [
        {
          term: "Distributional Shift",
          definition:
            "When the statistical properties of data change between training and deployment",
        },
        {
          term: "Regularization",
          definition:
            "Techniques to prevent models from memorizing noise in the data",
        },
        {
          term: "Convergence Rate",
          definition:
            "How quickly an estimator approaches the true value as sample size grows",
        },
        {
          term: "Ablation Study",
          definition:
            "Removing components one at a time to measure each one's contribution",
        },
      ];

  return { depth, sections, paperMap, soWhat, keyTerms };
}

function extractTitle(text: string): string {
  const lines = text.split("\n").filter((l) => l.trim().length > 0);
  if (lines.length > 0) {
    const firstLine = lines[0].trim();
    if (firstLine.length > 10 && firstLine.length < 200) {
      return firstLine;
    }
  }
  return "this research paper";
}

function generateQAResponse(question: string): string {
  const q = question.toLowerCase();
  if (q.includes("method") || q.includes("how")) {
    return "Great question! The researchers used a step-by-step approach. First, they gathered data from multiple sources to make sure their sample was representative. Then they applied their new technique, which is kind of like having a smarter filter that adapts to what it's looking at. They compared the results against three existing methods to prove theirs was better. Think of it like testing a new recipe by comparing it to the original — you need to show it actually tastes better, not just claim it does!";
  }
  if (q.includes("result") || q.includes("find") || q.includes("found")) {
    return "The key finding was that their approach outperformed existing methods by a significant margin. In non-technical terms: imagine the old method was getting the right answer 70% of the time. Their new method bumped that up to around 90%. That might not sound huge, but in fields like medicine or engineering, that 20% difference could mean saving lives or preventing failures.";
  }
  if (q.includes("why") || q.includes("important") || q.includes("matter")) {
    return "This matters because it solves a problem that has been bugging researchers for years. The old methods worked okay in theory but fell apart when you used them on real, messy data — kind of like how a map works great until you're actually in the forest and the trail doesn't match. This paper bridges that gap between theory and practice, which means the tools we build based on this research will actually work in the real world.";
  }
  if (q.includes("limit") || q.includes("weakness") || q.includes("wrong")) {
    return "No research is perfect, and the authors are honest about that. Their method requires more computing power than simpler approaches — think of it like needing a gaming PC instead of a regular laptop. Also, they tested it on specific types of data, so we don't know yet if it works equally well for everything. Future researchers will need to test it in more scenarios. But that's how science works — each paper moves us forward a little bit!";
  }
  return "That's a thoughtful question! Based on the paper, the researchers built on previous work but took a fundamentally different approach. They recognized that the standard assumptions didn't hold up in practice, so they designed a more flexible framework. The key innovation is that their method doesn't require the same strict conditions that previous approaches needed, making it much more practical for real-world use. It's like inventing an all-terrain vehicle when everyone else was building sports cars — not as flashy, but it actually works on real roads!";
}

export class MockAIService implements AIService {
  async explainPaper(
    text: string,
    depth: DepthLevel
  ): Promise<Explanation> {
    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
    return generateExplanation(text, depth);
  }

  async askQuestion(
    _paperText: string,
    question: string,
    _history: QAMessage[]
  ): Promise<string> {
    await new Promise((resolve) => setTimeout(resolve, 800));
    return generateQAResponse(question);
  }
}

export const aiService = new MockAIService();

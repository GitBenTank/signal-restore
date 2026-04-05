export type AppPhase = "boot" | "prompts" | "scanning" | "result";

export type SignalStrength = "low" | "moderate" | "strong";

export type Prompt = {
  id: string;
  text: string;
};

export type Pattern = {
  id: string;
  /** Substring matches; each hit adds base weight. */
  keywords: readonly string[];
  /** Higher-signal phrases; each hit adds extra weight. Do not duplicate `keywords` entries. */
  anchors?: readonly string[];
  suggest: string;
  possibility: string;
  tryNext: string;
};

export type AnalysisResult = {
  surfaceNamed: string;
  suggest: string;
  possibility: string;
  tryNext: string;
  signalStrength: SignalStrength;
  patternId: string;
  /** Present only on fallback: soft, non-pattern hints from language cues. */
  directionalHints?: string[];
};

export type PatternDiagnostics = {
  id: string;
  uncappedScore: number;
  cappedScore: number;
  anchorMatches: string[];
  keywordMatches: string[];
  anchorPoints: number;
  keywordPoints: number;
  griefConditionalPoints: number;
  griefConditionalLabels: string[];
  metaBonus: number;
};

export type FallbackReasonCode =
  | "winner"
  | "below_minimum"
  | "ambiguity"
  | "short_vague_cap";

export type ReflectionDiagnostics = {
  rawAnswers: string[];
  normalizedAnswers: string[];
  scoringBlob: string;
  reflectionWordCount: number;
  vagueGuardActive: boolean;
  vagueGuardBlobMatched: boolean;
  /** Human-readable why the guard fired or not. */
  vagueGuardNote: string;
  scoreCapApplied: boolean;
  scoreCapValue: number | null;
  patterns: PatternDiagnostics[];
  rankedCapped: { id: string; score: number }[];
  rankedUncapped: { id: string; score: number }[];
  thresholds: {
    minPatternScore: number;
    ambiguityMargin: number;
    runnerUpFloor: number;
  };
  checks: {
    topCappedScore: number;
    secondCappedScore: number | null;
    topUncappedScore: number;
    secondUncappedScore: number | null;
    passedMinimum: boolean;
    passedAmbiguity: boolean;
  };
  decision: {
    fallbackReason: FallbackReasonCode;
    summary: string;
    winnerId: string | null;
  };
  resultSignalStrength: string;
};

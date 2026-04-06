import type {
  FallbackReasonCode,
  PatternDiagnostics,
  ReflectionDiagnostics,
} from "./diagnosticsTypes";
import {
  blobLooksVagueForGuard,
  inferDirectionalSignals,
  metaScoreBonus,
} from "./metaSignals";
import { buildScoringBlob, normalizeAnswerForScoring } from "./normalizer";
import { REFLECTION_PATTERNS } from "./patterns";
import type { AnalysisResult, Pattern, SignalStrength } from "./types";

const KEYWORD_WEIGHT = 1;
const ANCHOR_WEIGHT = 2;

/** Weighted score needed before any pattern is trusted. */
const MIN_PATTERN_SCORE = 3;

/** If the runner-up is this close (in weighted points), treat the match as ambiguous. */
const AMBIGUITY_MARGIN = 1;

/** Runner-up must be at least this strong for ambiguity to apply. */
const RUNNER_UP_FLOOR = 3;

/** When total reflection is very short and vague-shaped, cap pattern scores below MIN_PATTERN_SCORE. */
const SHORT_VAGUE_WORD_THRESHOLD = 5;
const SHORT_VAGUE_SCORE_CAP = 2;

const FALLBACK: Omit<AnalysisResult, "surfaceNamed" | "signalStrength"> = {
  patternId: "fallback",
  suggest:
    "The pattern is not sharp enough to name cleanly from this pass—your language is circling something, but the center is still fuzzy.",
  possibility:
    "One possibility is that you are still mid-sentence with yourself: the situation has texture, but the headline has not settled.",
  tryNext:
    "Try again with fewer adjectives: what happened, who was involved, and what bothered you most in plain language.",
};

/** First-answer labels that are intentionally generic—keep default fallback copy. */
const GENERIC_SURFACE_NAMED = new Set([
  "Something unnamed, for now",
  "Tension not fully labeled yet",
  "A hard-to-name ‘off’ feeling",
]);

function fallbackSuggestForSurface(surfaceNamed: string): string {
  if (GENERIC_SURFACE_NAMED.has(surfaceNamed)) {
    return FALLBACK.suggest;
  }
  return `${surfaceNamed} comes through in what you shared. Even so, the full reflection didn’t settle on one pattern underneath—the signal stayed mixed or soft, or more than one honest thread is in play. Nothing below forces a single label on purpose.`;
}

const SURFACE_RULES: ReadonlyArray<{
  keywords: readonly string[];
  label: string;
}> = [
  { keywords: ["anxious", "nervous", "worry", "worried", "scared", "panic", "interview"], label: "Nerves about what’s next" },
  { keywords: ["sad", "cry", "crying"], label: "Low or heavy mood" },
  { keywords: ["angry", "mad", "furious", "rage", "resent"], label: "Anger or resentment" },
  { keywords: ["frustrated", "annoyed", "irritated", "pissed"], label: "Frustration" },
  { keywords: ["tired", "exhausted", "drained", "burnt", "burned out", "overwhelmed"], label: "Depletion or overload" },
  { keywords: ["stress", "stressed", "pressure"], label: "Pressure" },
  { keywords: ["unsure", "uncertain", "don't know", "dont know", "confused"], label: "Something hard to pin down" },
  { keywords: ["feel bad", "should have said", "said it wrong"], label: "Regret about how it went" },
  { keywords: ["guilt", "guilty", "ashamed", "blame"], label: "Self-blame or shame" },
  { keywords: ["lonely", "alone", "isolated"], label: "Loneliness or disconnection" },
  { keywords: ["they left", "still carrying"], label: "Loss or an ended bond" },
  { keywords: ["grief", "miss", "loss", "died", "death"], label: "Loss or change" },
  { keywords: ["avoid", "procrast", "putting off", "dreading"], label: "Avoidance" },
];

const MAX_SURFACE_LEN = 40;

/** Substrings that count as “loss/change present” for conditional grief cues (e.g. last conversation, loose everything-feels bundle). */
const GRIEF_PAIR_SIGNALS: readonly string[] = [
  "they left",
  "it ended",
  "still carrying",
  "still miss",
  "i miss",
  "miss them",
  "miss her",
  "miss him",
  "not enough",
  "wasn't i enough",
  "wasnt i enough",
  "broke up",
  "breakup",
  "left me",
  "passed away",
  "died",
  "grief",
  "no longer",
  "gone",
];

function griefPairPresent(blob: string): boolean {
  const b = blob.toLowerCase();
  return GRIEF_PAIR_SIGNALS.some((s) => b.includes(s));
}

/**
 * Contextual grief weight: never fires without a separate loss/change signal in the blob.
 */
function griefConditionalScore(blob: string, matchedAnchorNeedles: readonly string[]): number {
  const b = blob.toLowerCase();
  let add = 0;

  if (b.includes("last conversation") && griefPairPresent(b)) {
    add += ANCHOR_WEIGHT;
  }

  const hasExplicitEverythingFeelsCompound = matchedAnchorNeedles.some((m) =>
    [
      "everything feels different",
      "everything feels different now",
      "everything feels wrong",
      "everything feels empty",
    ].some((p) => m === p || m.includes(p)),
  );

  if (
    !hasExplicitEverythingFeelsCompound &&
    b.includes("everything") &&
    b.includes("feels") &&
    (b.includes("different") || b.includes("wrong") || b.includes("empty")) &&
    griefPairPresent(b)
  ) {
    add += ANCHOR_WEIGHT;
  }

  return add;
}

function griefConditionalLabels(
  blob: string,
  matchedAnchorNeedles: readonly string[],
): string[] {
  const b = blob.toLowerCase();
  const out: string[] = [];
  if (b.includes("last conversation") && griefPairPresent(b)) {
    out.push("+2: last conversation + grief pair signal");
  }
  const hasExplicitEverythingFeelsCompound = matchedAnchorNeedles.some((m) =>
    [
      "everything feels different",
      "everything feels different now",
      "everything feels wrong",
      "everything feels empty",
    ].some((p) => m === p || m.includes(p)),
  );
  if (
    !hasExplicitEverythingFeelsCompound &&
    b.includes("everything") &&
    b.includes("feels") &&
    (b.includes("different") || b.includes("wrong") || b.includes("empty")) &&
    griefPairPresent(b)
  ) {
    out.push("+2: everything/feels + change cue + grief pair signal");
  }
  return out;
}

type PatternScoreParts = {
  uncapped: number;
  anchorMatched: string[];
  keywordMatched: string[];
  anchorPoints: number;
  keywordPoints: number;
  griefConditional: number;
  griefLabels: string[];
  metaBonus: number;
};

function scorePatternDetailed(blob: string, pattern: Pattern): PatternScoreParts {
  const anchors = pattern.anchors ?? [];
  const anchorLayer = matchWeightedPhrases(blob, anchors, ANCHOR_WEIGHT, []);
  const keywordLayer = matchWeightedPhrases(
    blob,
    pattern.keywords,
    KEYWORD_WEIGHT,
    [...anchorLayer.matched],
  );
  let griefConditional = 0;
  let griefLabels: string[] = [];
  if (pattern.id === "grief") {
    griefConditional = griefConditionalScore(blob, anchorLayer.matched);
    griefLabels = griefConditionalLabels(blob, anchorLayer.matched);
  }
  const metaBonus = metaScoreBonus(pattern.id, blob);
  const uncapped =
    anchorLayer.score + keywordLayer.score + griefConditional + metaBonus;
  return {
    uncapped,
    anchorMatched: [...anchorLayer.matched],
    keywordMatched: [...keywordLayer.matched],
    anchorPoints: anchorLayer.score,
    keywordPoints: keywordLayer.score,
    griefConditional,
    griefLabels,
    metaBonus,
  };
}

/**
 * Longest phrases first; skip a phrase if it is already contained in a matched longer phrase
 * (prevents "avoid" + "avoiding" double-counting on the same token).
 */
function matchWeightedPhrases(
  blob: string,
  phrases: readonly string[],
  weight: number,
  supersededBy: readonly string[],
): { score: number; matched: string[] } {
  const sorted = [...phrases].sort((a, b) => b.length - a.length);
  const matched: string[] = [];
  let score = 0;
  for (const phrase of sorted) {
    const needle = phrase.toLowerCase();
    if (needle.length === 0 || !blob.includes(needle)) continue;
    if (supersededBy.some((m) => m.includes(needle))) continue;
    if (matched.some((m) => m.includes(needle))) continue;
    matched.push(needle);
    score += weight;
  }
  return { score, matched };
}

function scorePattern(blob: string, pattern: Pattern): number {
  return scorePatternDetailed(blob, pattern).uncapped;
}

function signalStrengthFromScore(score: number): SignalStrength {
  if (score >= 10) return "strong";
  if (score >= 7) return "moderate";
  return "low";
}

function shortenLabel(text: string): string {
  const t = text.trim();
  if (t.length <= MAX_SURFACE_LEN) return t;
  const cut = t.slice(0, MAX_SURFACE_LEN);
  const lastSpace = cut.lastIndexOf(" ");
  const base = (lastSpace > 12 ? cut.slice(0, lastSpace) : cut).trimEnd();
  return `${base}…`;
}

function inferSurfaceNamed(firstAnswer: string): string {
  const trimmed = firstAnswer.trim();
  if (!trimmed) return "Something unnamed, for now";

  const lower = trimmed.toLowerCase();

  if (lower.includes("feel") && (lower.includes("off") || lower.includes("weird") || lower.includes("wrong"))) {
    return "A hard-to-name ‘off’ feeling";
  }

  for (const rule of SURFACE_RULES) {
    if (rule.keywords.some((kw) => lower.includes(kw))) {
      return rule.label;
    }
  }

  const wordCount = trimmed.split(/\s+/).filter(Boolean).length;
  if (wordCount <= 5 && trimmed.length <= 36) {
    return shortenLabel(trimmed);
  }

  return "Tension not fully labeled yet";
}

type Scored = { pattern: Pattern; score: number };

function reflectionWordCount(answers: readonly string[]): number {
  return answers
    .map((a) => a.trim())
    .filter(Boolean)
    .join(" ")
    .split(/\s+/)
    .filter(Boolean).length;
}

function shortVagueScoreCap(answers: readonly string[], blob: string): number {
  if (reflectionWordCount(answers) >= SHORT_VAGUE_WORD_THRESHOLD) {
    return Number.POSITIVE_INFINITY;
  }
  if (!blobLooksVagueForGuard(blob)) {
    return Number.POSITIVE_INFINITY;
  }
  return SHORT_VAGUE_SCORE_CAP;
}

function vagueGuardNoteText(answers: readonly string[], blob: string): string {
  const wc = reflectionWordCount(answers);
  if (wc >= SHORT_VAGUE_WORD_THRESHOLD) {
    return `Inactive: word count (${wc}) ≥ ${SHORT_VAGUE_WORD_THRESHOLD}`;
  }
  if (!blobLooksVagueForGuard(blob)) {
    return "Inactive: blob does not match vague-shape heuristics";
  }
  return `Active: all pattern scores capped at ${SHORT_VAGUE_SCORE_CAP}`;
}

function rankPatterns(blob: string, answers: readonly string[]): Scored[] {
  const cap = shortVagueScoreCap(answers, blob);
  return REFLECTION_PATTERNS.map((pattern) => ({
    pattern,
    score: Math.min(cap, scorePattern(blob, pattern)),
  })).sort((a, b) => b.score - a.score);
}

function pickBestPattern(
  blob: string,
  answers: readonly string[],
): { pattern: Pattern; score: number } | null {
  const ranked = rankPatterns(blob, answers);
  const top = ranked[0];
  const second = ranked[1];

  if (!top || top.score < MIN_PATTERN_SCORE) return null;

  if (
    second &&
    second.score >= RUNNER_UP_FLOOR &&
    top.score - second.score <= AMBIGUITY_MARGIN
  ) {
    return null;
  }

  return { pattern: top.pattern, score: top.score };
}

export function analyzeReflection(answers: readonly string[]): AnalysisResult {
  const blob = buildScoringBlob(answers);
  const first = answers[0] ?? "";
  const surfaceNamed = inferSurfaceNamed(first);

  const picked = pickBestPattern(blob, answers);

  if (!picked) {
    const directionalHints = inferDirectionalSignals(blob);
    return {
      surfaceNamed,
      ...FALLBACK,
      suggest: fallbackSuggestForSurface(surfaceNamed),
      signalStrength: "low",
      ...(directionalHints.length > 0 ? { directionalHints } : {}),
    };
  }

  const { pattern, score } = picked;

  return {
    surfaceNamed,
    patternId: pattern.id,
    suggest: pattern.suggest,
    possibility: pattern.possibility,
    tryNext: pattern.tryNext,
    signalStrength: signalStrengthFromScore(score),
  };
}

export type PatternScore = { id: string; score: number };

/** For tuning: full scoreboard + final result. Safe to import from scripts only. */
export function explainReflection(answers: readonly string[]): {
  blob: string;
  ranked: PatternScore[];
  result: AnalysisResult;
} {
  const blob = buildScoringBlob(answers);
  const ranked = rankPatterns(blob, answers).map(({ pattern, score }) => ({
    id: pattern.id,
    score,
  }));
  return {
    blob,
    ranked,
    result: analyzeReflection(answers),
  };
}

function isAmbiguousPair(
  topScore: number,
  secondScore: number | null,
): boolean {
  return (
    secondScore !== null &&
    secondScore >= RUNNER_UP_FLOOR &&
    topScore - secondScore <= AMBIGUITY_MARGIN
  );
}

/**
 * Full engine diagnostics for dev/debug UI. Does not change scoring rules;
 * mirrors pickBestPattern + rank logic.
 */
export function buildReflectionDiagnostics(
  answers: readonly string[],
): ReflectionDiagnostics {
  const raw = [...answers];
  const normalizedAnswers = answers.map((a) => normalizeAnswerForScoring(a));
  const blob = buildScoringBlob(answers);
  const cap = shortVagueScoreCap(answers, blob);
  const scoreCapApplied = cap !== Number.POSITIVE_INFINITY;
  const vagueGuardBlobMatched = blobLooksVagueForGuard(blob);
  const vagueGuardActive = scoreCapApplied;
  const wc = reflectionWordCount(answers);

  const patterns: PatternDiagnostics[] = REFLECTION_PATTERNS.map((pattern) => {
    const d = scorePatternDetailed(blob, pattern);
    const capped = Math.min(cap, d.uncapped);
    return {
      id: pattern.id,
      uncappedScore: d.uncapped,
      cappedScore: capped,
      anchorMatches: d.anchorMatched,
      keywordMatches: d.keywordMatched,
      anchorPoints: d.anchorPoints,
      keywordPoints: d.keywordPoints,
      griefConditionalPoints: d.griefConditional,
      griefConditionalLabels: d.griefLabels,
      metaBonus: d.metaBonus,
    };
  });

  const rankedUncapped = [...patterns]
    .sort((a, b) => b.uncappedScore - a.uncappedScore)
    .map((p) => ({ id: p.id, score: p.uncappedScore }));
  const rankedCapped = [...patterns]
    .sort((a, b) => b.cappedScore - a.cappedScore)
    .map((p) => ({ id: p.id, score: p.cappedScore }));

  const topC = rankedCapped[0]!;
  const secondC = rankedCapped[1] ?? null;
  const topU = rankedUncapped[0]!;
  const secondU = rankedUncapped[1] ?? null;

  const passedMinimum = topC.score >= MIN_PATTERN_SCORE;
  const ambiguity = isAmbiguousPair(topC.score, secondC?.score ?? null);
  const passedAmbiguity = !ambiguity;

  const picked = pickBestPattern(blob, answers);

  let fallbackReason: FallbackReasonCode;
  let summary: string;
  let winnerId: string | null = null;

  if (picked) {
    fallbackReason = "winner";
    winnerId = picked.pattern.id;
    summary = `Winner: ${winnerId} (capped score ${picked.score}).`;
  } else if (
    scoreCapApplied &&
    topU.score >= MIN_PATTERN_SCORE &&
    topC.score < MIN_PATTERN_SCORE
  ) {
    fallbackReason = "short_vague_cap";
    summary = `Fallback: short + vague guard capped scores at ${SHORT_VAGUE_SCORE_CAP}. Uncapped leader ${topU.id} (${topU.score}) would pass minimum; capped leader ${topC.id} (${topC.score}) does not.`;
  } else if (topC.score < MIN_PATTERN_SCORE) {
    fallbackReason = "below_minimum";
    summary = `Fallback: top capped score ${topC.score} < minimum ${MIN_PATTERN_SCORE}.`;
  } else if (ambiguity) {
    fallbackReason = "ambiguity";
    summary = `Fallback: ${topC.id} (${topC.score}) vs ${secondC!.id} (${secondC!.score}) within ambiguity margin (${AMBIGUITY_MARGIN}), runner-up ≥ ${RUNNER_UP_FLOOR}.`;
  } else {
    fallbackReason = "below_minimum";
    summary = "Fallback: no clear winner (unexpected; check engine).";
  }

  const resultStrength = picked
    ? signalStrengthFromScore(picked.score)
    : ("low" as const);

  return {
    rawAnswers: raw,
    normalizedAnswers,
    scoringBlob: blob,
    reflectionWordCount: wc,
    vagueGuardActive,
    vagueGuardBlobMatched,
    vagueGuardNote: vagueGuardNoteText(answers, blob),
    scoreCapApplied,
    scoreCapValue: scoreCapApplied ? SHORT_VAGUE_SCORE_CAP : null,
    patterns,
    rankedCapped,
    rankedUncapped,
    thresholds: {
      minPatternScore: MIN_PATTERN_SCORE,
      ambiguityMargin: AMBIGUITY_MARGIN,
      runnerUpFloor: RUNNER_UP_FLOOR,
    },
    checks: {
      topCappedScore: topC.score,
      secondCappedScore: secondC?.score ?? null,
      topUncappedScore: topU.score,
      secondUncappedScore: secondU?.score ?? null,
      passedMinimum,
      passedAmbiguity,
    },
    decision: { fallbackReason, summary, winnerId },
    resultSignalStrength: resultStrength,
  };
}

/** Explain + full diagnostics object for debug panels. */
export function explainReflectionWithDiagnostics(answers: readonly string[]): {
  blob: string;
  ranked: PatternScore[];
  result: AnalysisResult;
  diagnostics: ReflectionDiagnostics;
} {
  const diagnostics = buildReflectionDiagnostics(answers);
  return {
    blob: diagnostics.scoringBlob,
    ranked: diagnostics.rankedCapped,
    result: analyzeReflection(answers),
    diagnostics,
  };
}

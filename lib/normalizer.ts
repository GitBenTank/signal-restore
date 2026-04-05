import { blobFromAnswers, preprocessAnswer } from "./utils";

/**
 * Deterministic phrase normalizations so casual or fragmented language can still
 * match the reflection engine. Longer patterns first; word-boundary safe where it matters.
 *
 * Most rules are “Type A” (slang → plain words). A few are “Type B” (light inference),
 * e.g. `whatever` → `minimizing`—kept scoring-only, paired with meta caps + short-vague guard.
 */
const NORMALIZATION_RULES: ReadonlyArray<{ match: RegExp; replace: string }> = [
  { match: /\bpissed off\b/gi, replace: "frustrated" },
  {
    match: /\b(can't|cant|won't|wont)\s+stop\s+thinking\b/gi,
    replace: "repeatedly thinking",
  },
  { match: /\b(can't|cant|won't|wont)\s+stop\b/gi, replace: "keep repeating" },
  { match: /\bdon't know\b|\bdont know\b|\bdunno\b|\bduno\b/gi, replace: "unsure" },
  { match: /\bidk\b|\bidek\b|\bidrk\b/gi, replace: "unsure" },
  { match: /\blowkey\b|\blow key\b/gi, replace: "somewhat" },
  { match: /\bhighkey\b/gi, replace: "clearly" },
  { match: /\bkind of\b|\bkinda\b/gi, replace: "somewhat" },
  { match: /\bsort of\b|\bsorta\b/gi, replace: "somewhat" },
  { match: /\bpissed\b/gi, replace: "frustrated" },
  { match: /\btilted\b|\bsalty\b/gi, replace: "frustrated" },
  { match: /\bugh+\b|\bugh\b/gi, replace: "frustrated" },
  { match: /\bover it\b|\bdone with this\b/gi, replace: "fed up frustrated" },
  { match: /\bcan't deal\b|\bcant deal\b|\bcan't even\b|\bcant even\b/gi, replace: "overwhelmed" },
  { match: /\bwhatever\b/gi, replace: "minimizing" },
  { match: /\bim like\b|\bi'm like\b/gi, replace: "i feel" },
  { match: /\?\?\?+/g, replace: " confused " },
  { match: /\bngl\b/gi, replace: "honestly" },
  { match: /\btbh\b/gi, replace: "honestly" },
  { match: /\bgonna\b/gi, replace: "going to" },
  { match: /\bwanna\b/gi, replace: "want to" },
  { match: /\bgotta\b/gi, replace: "have to" },
  { match: /\bnvm\b|\bnever mind\b/gi, replace: "forget it" },
];

function applyNormalizationRules(lower: string): string {
  let out = lower;
  for (const { match, replace } of NORMALIZATION_RULES) {
    out = out.replace(match, replace);
  }
  return out.replace(/\s+/g, " ").trim();
}

/** One answer: format cleanup → lowercase slang / fragment expansion for scoring only. */
export function normalizeAnswerForScoring(raw: string): string {
  const base = preprocessAnswer(raw);
  if (!base) return "";
  return applyNormalizationRules(base);
}

/** Full blob passed to the pattern engine (does not change user-visible answers). */
export function buildScoringBlob(answers: readonly string[]): string {
  const normalized = answers.map((a) => normalizeAnswerForScoring(a));
  return blobFromAnswers(normalized);
}

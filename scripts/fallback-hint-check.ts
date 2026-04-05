/**
 * Quick manual QA: fallback + directionalHints per fuzzy input.
 * Run: npx tsx scripts/fallback-hint-check.ts
 */
import { analyzeReflection } from "../lib/analyzer";
import { inferDirectionalSignals } from "../lib/metaSignals";
import { buildScoringBlob } from "../lib/normalizer";

const CASES = [
  "idk just feel weird",
  "fine but not really",
  "whatever i guess",
  "keep thinking about it",
  "tired and kinda over it",
  "???",
  "lowkey annoyed but it's fine",
];

function pad(s: string, n: number): string {
  return s.length >= n ? s.slice(0, n - 2) + "…" : s + " ".repeat(n - s.length);
}

const emptyTail = ["", "", ""] as const;

for (const line of CASES) {
  const answers = [line, ...emptyTail] as string[];
  const blob = buildScoringBlob(answers);
  const result = analyzeReflection(answers);
  const hints = inferDirectionalSignals(blob);
  const isFallback = result.patternId === "fallback";
  console.log("—".repeat(72));
  console.log(pad(`"${line}"`, 50), isFallback ? "fallback" : "WINNER");
  console.log("  blob:", blob.slice(0, 120) + (blob.length > 120 ? "…" : ""));
  console.log("  hints:", hints.length ? hints.join(" | ") : "(none)");
  if (result.directionalHints?.length) {
    console.log("  on result:", result.directionalHints.join(" | "));
  }
}

const MIXED =
  "there may be mixed or conflicting signals in how you're describing this";
const SOFTENING =
  "your language suggests you're softening or minimizing something";

const lowkeyAnswers = ["lowkey annoyed but it's fine", "", "", ""] as const;
const lowkeyBlob = buildScoringBlob([...lowkeyAnswers]);
const lowkeyResult = analyzeReflection([...lowkeyAnswers]);
const lowkeyHints = inferDirectionalSignals(lowkeyBlob);

const lowkeyOk =
  lowkeyResult.patternId === "fallback" &&
  lowkeyHints.includes(MIXED) &&
  lowkeyHints.includes(SOFTENING) &&
  lowkeyResult.directionalHints?.includes(MIXED) &&
  lowkeyResult.directionalHints?.includes(SOFTENING);

console.log("—".repeat(72));
if (!lowkeyOk) {
  console.error("ASSERT lowkey annoyed but it's fine:");
  console.error("  expected fallback + mixed + softening hints");
  console.error("  patternId:", lowkeyResult.patternId);
  console.error("  hints:", lowkeyHints.join(" | ") || "(none)");
  process.exit(1);
}
console.log('OK: "lowkey annoyed but it\'s fine" → fallback + mixed + softening');

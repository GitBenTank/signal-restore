/**
 * Final QA: npx tsx scripts/final-qa-ten.ts
 */
import { analyzeReflection } from "../lib/analyzer";

const CASES: { id: string; line: string; expect: string }[] = [
  {
    id: "A1",
    line: "I'm stressed about my interview and keep thinking about what if I mess it up",
    expect: "uncertainty",
  },
  {
    id: "A2",
    line: "I feel drained and overwhelmed and have nothing left to give",
    expect: "burnout",
  },
  {
    id: "A3",
    line: "I feel bad about how I handled that conversation",
    expect: "guilt",
  },
  {
    id: "A4",
    line: "I miss them more than I expected to and everything feels different now",
    expect: "grief",
  },
  {
    id: "A5",
    line: "I keep putting it off and telling myself I'll deal with it tomorrow",
    expect: "avoidance",
  },
  { id: "B6", line: "idk just feel weird", expect: "fallback" },
  { id: "B7", line: "whatever i guess", expect: "fallback" },
  { id: "B8", line: "lowkey annoyed but it's fine", expect: "fallback" },
  { id: "B9", line: "fine but not really", expect: "fallback" },
  { id: "B10", line: "???", expect: "fallback" },
];

const tail = ["", "", ""] as const;

/** Mirrors RestoreResult copy (approximate UI line). */
function displayStrengthUi(r: {
  patternId: string;
  signalStrength: string;
}): string {
  if (r.patternId === "fallback") {
    return "pattern not named (+ fallback subtitle)";
  }
  if (r.signalStrength === "low") return "early signal (+ subtitle)";
  if (r.signalStrength === "moderate") return "clear signal";
  if (r.signalStrength === "strong") return "strong signal";
  return r.signalStrength;
}

for (const { id, line, expect } of CASES) {
  const r = analyzeReflection([line, ...tail]);
  const ok = r.patternId === expect ? "PASS" : "FAIL";
  console.log(
    `${id}\t${ok}\tgot=${r.patternId}\texp=${expect}\t${r.signalStrength}\t${displayStrengthUi(r)}`,
  );
  if (r.directionalHints?.length) {
    console.log(`\thints:\t${r.directionalHints.join(" | ")}`);
  }
}

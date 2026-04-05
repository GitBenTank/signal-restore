/**
 * Hotfix verification: npx tsx scripts/hotfix-five-tests.ts
 */
import { analyzeReflection } from "../lib/analyzer";

const CASES = [
  "I'm stressed about my interview and keep thinking about what if I mess it up",
  "I feel drained and overwhelmed and have nothing left to give",
  "I feel bad about how I handled that conversation",
  "idk just feel weird",
  "lowkey annoyed but it's fine",
];

const tail = ["", "", ""] as const;

for (const line of CASES) {
  const r = analyzeReflection([line, ...tail]);
  console.log(
    r.patternId.padEnd(14),
    r.signalStrength.padEnd(10),
    line.slice(0, 56) + (line.length > 56 ? "…" : ""),
  );
}

/**
 * Stress-test messy / minimal input. Expect: mostly fallback, never strong, no crashes.
 * Run: npx tsx scripts/chaos-input.ts
 */

import { explainReflection } from "../lib/analyzer";

/** One-liner chaos: pack into first slot, minimal fillers so total word count stays tiny. */
const CHAOS: { name: string; answers: string[] }[] = [
  { name: "idk bro just off", answers: ["idk bro just off", "", "", ""] },
  { name: "fine lol", answers: ["fine lol", "", "", ""] },
  { name: "whatever", answers: ["whatever", "", "", ""] },
  { name: "im chilling but also not", answers: ["im chilling but also not", "", "", ""] },
  { name: "she said something idk", answers: ["she said something idk", "", "", ""] },
  { name: "i keep thinking about it idk why", answers: ["i keep thinking about it idk why", "", "", ""] },
  { name: "just tired man", answers: ["just tired man", "", "", ""] },
  { name: "???", answers: ["???", "", "", ""] },
  { name: "nah im good", answers: ["nah im good", "", "", ""] },
  {
    name: "lowkey annoyed but its fine",
    answers: ["lowkey annoyed but its fine", "", "", ""],
  },
  { name: "ugh", answers: ["ugh", "", "", ""] },
  { name: "nvm", answers: ["nvm", "", "", ""] },
  { name: "…", answers: ["…", "", "", ""] },
];

let strong = 0;
let fallback = 0;

for (const { name, answers } of CHAOS) {
  const { result, ranked } = explainReflection(answers);
  if (result.signalStrength === "strong") strong++;
  if (result.patternId === "fallback") fallback++;

  const top = ranked[0];
  console.log(
    `${name.padEnd(36)} → ${result.patternId} (${result.signalStrength})  top=${top?.id}:${top?.score}  surface=${JSON.stringify(result.surfaceNamed)}`,
  );
}

const n = CHAOS.length;
console.log("\n---");
console.log(`Fallback: ${fallback}/${n}  (${Math.round((100 * fallback) / n)}%)`);
console.log(`Strong:   ${strong}/${n}  (must be 0)`);

if (strong > 0) {
  console.error("FAIL: at least one chaos case hit signal strength strong.");
  process.exit(1);
}

console.log("OK");

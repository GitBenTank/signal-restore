import { explainReflection } from "../lib/analyzer";
import { buildScoringBlob } from "../lib/normalizer";

const cases: { name: string; answers: string[] }[] = [
  {
    name: "Slang + vague",
    answers: [
      "idk man just feel weird lately",
      "off and on",
      "she said something and now im like ???",
      "whatever i guess",
    ],
  },
  {
    name: "Lowkey anger + minimize",
    answers: [
      "lowkey pissed but whatever",
      "today",
      "not a big deal",
      "ugh",
    ],
  },
  {
    name: "Fine / not really",
    answers: [
      "i'm fine but also not really",
      "work was fine",
      "i keep thinking about it",
      "nvm",
    ],
  },
  {
    name: "Bullet dump",
    answers: [
      "- tired\n- annoyed\n- don't want to deal with anything",
      "all day",
      "just over it",
      "idk",
    ],
  },
  {
    name: "Fragment vent",
    answers: [
      "annoyed. tired. over it.",
      "rn",
      "can't stop thinking about the interview ngl",
      "wanna sleep",
    ],
  },
];

for (const { name, answers } of cases) {
  const { blob, ranked, result } = explainReflection(answers);
  const top = ranked
    .slice(0, 4)
    .map((x) => `${x.id}:${x.score}`)
    .join(" | ");
  console.log(`--- ${name} → ${result.patternId} (${result.signalStrength})`);
  console.log(`    surface: ${JSON.stringify(result.surfaceNamed)}`);
  console.log(`    blob: ${JSON.stringify(blob.slice(0, 120))}${blob.length > 120 ? "…" : ""}`);
  console.log(`    ${top}`);
}

console.log("\nRaw vs scoring blob (first case, first answer only):");
const raw = cases[0]!.answers[0]!;
console.log("  raw:", JSON.stringify(raw));
console.log("  blob:", JSON.stringify(buildScoringBlob([raw])));

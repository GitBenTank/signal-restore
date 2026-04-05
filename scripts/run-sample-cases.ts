import { explainReflection } from "../lib/analyzer";

type Case = {
  name: string;
  acceptable: readonly string[];
  answers: string[];
};

const cases: Case[] = [
  {
    name: "1 Interview uncertainty",
    acceptable: ["uncertainty"],
    answers: [
      "I've been stressed about my interview.",
      "This morning before I got up.",
      "What if I mess it up and don't know what to say?",
      "Preparing as much as I should because I'm nervous.",
    ],
  },
  {
    name: "2 Control frustration",
    acceptable: ["control"],
    answers: [
      "I'm frustrated that things keep slipping out of my hands.",
      "At work today.",
      "Why won't anything go the way I planned?",
      "Letting go of stuff I can't fix.",
    ],
  },
  {
    name: "3 Avoidance",
    acceptable: ["avoidance"],
    answers: [
      "I keep putting off something I need to do.",
      "Last night when I knew I should start.",
      "I'll deal with it tomorrow.",
      "Starting the task at all.",
    ],
  },
  {
    name: "4 Burnout",
    acceptable: ["burnout"],
    answers: [
      "I feel drained and kind of numb.",
      "This afternoon.",
      "I do not have anything left to give today.",
      "Answering people and keeping up.",
    ],
  },
  {
    name: "5 Grief / loss",
    acceptable: ["grief"],
    answers: [
      "I still miss them more than I expected to.",
      "Late at night.",
      "I keep thinking about how different everything feels now.",
      "Looking at old photos.",
    ],
  },
  {
    name: "6 Guilt",
    acceptable: ["guilt"],
    answers: [
      "I feel bad about how I handled something.",
      "Right after the conversation.",
      "I should have said it differently.",
      "Owning up to it directly.",
    ],
  },
  {
    name: "7 Mixed uncertainty + avoidance",
    acceptable: ["fallback"],
    answers: [
      "I'm anxious about what's coming next, so I keep avoiding it.",
      "This morning.",
      "What if I'm not ready?",
      "Actually starting.",
    ],
  },
  {
    name: "8 Vague low-signal",
    acceptable: ["fallback"],
    answers: [
      "I just feel weird lately.",
      "Off and on this week.",
      "Something feels off but I can't really explain it.",
      "Not sure.",
    ],
  },
  {
    name: "9 Anger / annoyance",
    acceptable: ["control", "fallback"],
    answers: [
      "I'm annoyed at how that went.",
      "Earlier today.",
      "That was so stupid.",
      "Talking to that person again.",
    ],
  },
  {
    name: "10 Relationship loss",
    acceptable: ["grief", "fallback"],
    answers: [
      "They left and I'm still carrying it.",
      "At night when things get quiet.",
      "Why wasn't I enough?",
      "Thinking about our last conversation.",
    ],
  },
  {
    name: "A1 Tired + miss them",
    acceptable: ["grief", "burnout", "fallback"],
    answers: [
      "I'm tired of thinking about it but I also miss them.",
      "Random times, honestly.",
      "I replay what I could have said.",
      "Mostly when I'm trying to sleep.",
    ],
  },
  {
    name: "A2 Guilt + avoiding",
    acceptable: ["fallback", "guilt", "avoidance"],
    answers: [
      "I should have handled that better, and now I'm avoiding them.",
      "Right after I saw the message.",
      "I keep putting it off.",
      "Saying anything real.",
    ],
  },
  {
    name: "A3 Work chaos (not grief)",
    acceptable: ["burnout", "uncertainty", "control", "fallback"],
    answers: [
      "Everything feels weird since work started getting chaotic.",
      "All week.",
      "I can't keep up with the pace.",
      "Email and Slack mostly.",
    ],
  },
  {
    name: "A4 Know what to do, haven't started",
    acceptable: ["avoidance", "fallback"],
    answers: [
      "I know what I need to do, I just haven't started.",
      "For a few days.",
      "I'll do it when I have a clear morning.",
      "The first email.",
    ],
  },
  {
    name: "A5 Frustrated + unknown next",
    acceptable: ["fallback", "uncertainty", "control"],
    answers: [
      "I'm frustrated, but mostly because I don't know what happens next.",
      "Today especially.",
      "What if this blows up in my face?",
      "Making a plan I actually believe in.",
    ],
  },
];

for (const { name, acceptable, answers } of cases) {
  const { ranked, result } = explainReflection(answers);
  const top = ranked
    .slice(0, 5)
    .map((x) => `${x.id}:${x.score}`)
    .join(" | ");
  const ok = acceptable.includes(result.patternId) ? "OK" : "CHECK";
  console.log(
    `${name} [${ok}] → ${result.patternId} (${result.signalStrength}) surface=${JSON.stringify(result.surfaceNamed)}`,
  );
  console.log(`   ${top}`);
}

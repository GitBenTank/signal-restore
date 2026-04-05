import type { Prompt } from "./types";

export const REFLECTION_PROMPTS: readonly Prompt[] = [
  {
    id: "weight",
    text: "What has been weighing on you lately?",
  },
  {
    id: "when",
    text: "When did you feel it most strongly?",
  },
  {
    id: "thought",
    text: "What thought keeps replaying in your head?",
  },
  {
    id: "avoid",
    text: "What have you been avoiding, if anything?",
  },
] as const;

/**
 * Light behavioral nudges on top of content matching. At most +1 point per pattern
 * from this layer—never enough to invent a category from silence.
 */

const RUMINATION =
  /\b(keep|keeps|kept)\s+(thinking|worrying|replaying|going over)\b|\bover and over\b|\b(can't stop|cant stop|won't stop|wont stop)(\s+thinking)?\b|\brepeatedly thinking\b/;

const CONTRADICTION =
  /\b(fine|ok|okay|alright|good)\b[^.!?]{0,45}\b(but|except|not really)\b|\bbut also not\b|\bnot really fine\b|\bfine but\b/;

export const VAGUE =
  /\b(something|stuff|things)\s+(is|are|feels?|going)\b|\bthis whole thing\b|\bsome stuff\b|\bunsure\b|\?{2,}/;

export const MINIMIZING =
  /\bminimizing\b|\bno big deal\b|\bdoesn't matter\b|\bdoesnt matter\b|\bnot a big deal\b/;

/** For the short-reflection score cap: vague shape in the scoring blob (post-normalization). */
const VAGUE_GUARD_EXTRA =
  /\b(confused|idk|idek|dunno|lol|nah|bro|whatever|maybe|kinda|sorta|chilling)\b|\?{2,}/;

export function blobLooksVagueForGuard(blob: string): boolean {
  return (
    VAGUE.test(blob) || MINIMIZING.test(blob) || VAGUE_GUARD_EXTRA.test(blob)
  );
}

const AVOIDANCE_HINT =
  /\b(avoid|avoiding|putting off|later|tomorrow|starting|start|haven't|havent)\b/;

/** Max total meta bonus per pattern (integer scoring). */
const META_CAP = 1;

/** Fallback directional hints only — not used in scoring (see CONTRADICTION for meta). */
const DIRECTIONAL_MIXED_FORWARD =
  /\b(fine|ok|okay|alright|good)\b[^.!?]{0,45}\b(but|except|not really)\b/;
const DIRECTIONAL_MIXED_EXTRA = /\bnot really fine\b|\bfine but\b/;
/** `but` / `except` then soft landing or hedge (e.g. “annoyed but it's fine”, “but not really”). */
const DIRECTIONAL_MIXED_REVERSE =
  /\b(but|except)\b[^.!?]{0,55}\b(?:not really|it'?s\s+fine|i'?m\s+fine|okay|ok|alright|good|fine)\b/;

function directionalMixedSignalsPresent(b: string): boolean {
  return (
    DIRECTIONAL_MIXED_FORWARD.test(b) ||
    DIRECTIONAL_MIXED_EXTRA.test(b) ||
    DIRECTIONAL_MIXED_REVERSE.test(b)
  );
}

/**
 * Low-confidence cues for fallback UX only. Runs on the same normalized scoring blob as
 * pattern matching; does not affect scores or pattern selection.
 */
export function inferDirectionalSignals(blob: string): string[] {
  const b = blob.toLowerCase();
  const signals: string[] = [];

  if (
    /\b(again|over and over|repeatedly|repeatedly thinking|keep repeating)\b/.test(b) ||
    /\bkeep\s+thinking\b/.test(b)
  ) {
    signals.push("your thoughts may be looping or circling");
  }

  if (/\bunsure\b|\bconfused\b|\?{2,}/.test(b)) {
    signals.push("there may be difficulty clearly naming what you're feeling");
  }

  if (directionalMixedSignalsPresent(b)) {
    signals.push("there may be mixed or conflicting signals in how you're describing this");
  }

  if (/\b(minimizing|somewhat)\b/.test(b)) {
    signals.push("your language suggests you're softening or minimizing something");
  }

  if (/\b(tired|exhausted|overwhelmed|drained)\b/.test(b)) {
    signals.push("there may be some mental or emotional fatigue present");
  }

  return signals;
}

export function metaScoreBonus(patternId: string, blob: string): number {
  const b = blob;
  let n = 0;

  switch (patternId) {
    case "uncertainty": {
      if (RUMINATION.test(b)) n++;
      if (CONTRADICTION.test(b)) n++;
      if (VAGUE.test(b)) n++;
      if (MINIMIZING.test(b)) n++;
      return Math.min(META_CAP, n);
    }
    case "avoidance": {
      if (RUMINATION.test(b) && AVOIDANCE_HINT.test(b)) return 1;
      return 0;
    }
    default:
      return 0;
  }
}

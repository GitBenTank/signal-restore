/** Strip bullets, collapse lines—before slang normalization. Output lowercase, single-space. */
export function preprocessAnswer(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return "";
  const lines = trimmed
    .split(/\r?\n/)
    .map((line) => line.replace(/^[\s•\-\*·]+/, "").trim())
    .filter(Boolean);
  const joined = lines.join(" ");
  return joined.toLowerCase().replace(/\s+/g, " ").trim();
}

export function normalizeAnswers(answers: readonly string[]): string {
  return answers.map((a) => a.trim().toLowerCase()).join(" \n ");
}

export function blobFromAnswers(answers: readonly string[]): string {
  return answers
    .map((a) => a.trim())
    .filter(Boolean)
    .join(" \n ")
    .replace(/\s+/g, " ")
    .trim();
}

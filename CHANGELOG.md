# Changelog

## 2026-04-05 — Production hotfix (over-fallback)

**Why:** Real reflections were falling back too often; vague one-liners should still hold back.

**Changes:**

- `lib/analyzer.ts`: `MIN_PATTERN_SCORE` **5 → 4** (winner still needs clear weighted signal; ambiguity + short-vague guard unchanged).
- `lib/patterns.ts`: guilt keyword **`that conversation`** so a common regret-shaped line (“how I handled that conversation”) reaches the new floor without lowering trust rules globally.

**Explicitly not changed:** `AMBIGUITY_MARGIN`, `SHORT_VAGUE_SCORE_CAP`, normalization, fallback copy, directional hints, app architecture.

**Smoke tests** (first prompt only, rest empty): `npx tsx scripts/hotfix-five-tests.ts`

**Follow-up (later):** Consider replacing standalone `that conversation` with a tighter compound cue if false positives show up in tuning.

---

## 2026-04-05 — Signal strength UX (display only)

**Why:** `low` + “insufficient clarity” read like the user failed; same engine, kinder framing.

**Changes (`components/RestoreResult.tsx` only):**

- `low` → label **early signal**, subtitle **(present, but not fully formed)**
- `moderate` → **clear signal**
- `strong` → **strong signal**

Copy-to-clipboard matches the UI. No scoring or `SignalStrength` logic changes.

---

## 2026-04-05 — Final QA: fallback signal copy

**Why:** Fallback still used internal `low` → UI showed “early signal,” which implied a named pattern was forming.

**Changes (`components/RestoreResult.tsx` only):**

- When `patternId === "fallback"`: **pattern not named** + subtitle **(signal stayed mixed or thin — nothing forced)**.
- Named patterns unchanged: early / clear / strong signal as before.

**Regression:** `npx tsx scripts/final-qa-ten.ts` (10 cases: A1–A5 named, B6–B10 fallback + hints where expected).

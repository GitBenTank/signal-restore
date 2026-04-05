# Changelog

## 2026-04-05 — Production hotfix (over-fallback)

**Why:** Real reflections were falling back too often; vague one-liners should still hold back.

**Changes:**

- `lib/analyzer.ts`: `MIN_PATTERN_SCORE` **5 → 4** (winner still needs clear weighted signal; ambiguity + short-vague guard unchanged).
- `lib/patterns.ts`: guilt keyword **`that conversation`** so a common regret-shaped line (“how I handled that conversation”) reaches the new floor without lowering trust rules globally.

**Explicitly not changed:** `AMBIGUITY_MARGIN`, `SHORT_VAGUE_SCORE_CAP`, normalization, fallback copy, directional hints, app architecture.

**Smoke tests** (first prompt only, rest empty): `npx tsx scripts/hotfix-five-tests.ts`

**Follow-up (later):** Consider replacing standalone `that conversation` with a tighter compound cue if false positives show up in tuning.

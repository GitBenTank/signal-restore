"use client";

import { useEffect, useState } from "react";

const STEPS = [
  "parsing language...",
  "identifying repeated signals...",
  "restoring buried pattern...",
] as const;

const STEP_DELAYS_MS = [0, 540, 1120] as const;
const DONE_MS = 1820;

type ScanSequenceProps = {
  onComplete: () => void;
};

export function ScanSequence({ onComplete }: ScanSequenceProps) {
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    const timers: number[] = [];

    STEPS.forEach((_, i) => {
      timers.push(
        window.setTimeout(() => setVisibleCount(i + 1), STEP_DELAYS_MS[i]),
      );
    });

    const done = window.setTimeout(onComplete, DONE_MS);
    timers.push(done);

    return () => {
      timers.forEach((id) => window.clearTimeout(id));
    };
  }, [onComplete]);

  return (
    <div
      className="min-h-[10rem] space-y-4 font-mono text-sm leading-relaxed text-emerald-400/92 sm:min-h-[11rem] sm:text-[15px]"
      aria-live="polite"
    >
      <p className="text-[11px] uppercase tracking-[0.25em] text-emerald-600/80">Scan</p>
      {STEPS.map((line, i) => (
        <p
          key={line}
          className={
            i < visibleCount
              ? "scan-line-visible text-emerald-300/90"
              : "opacity-0"
          }
        >
          <span className="mr-2 text-emerald-600/75">&gt;</span>
          {line}
        </p>
      ))}
      {visibleCount >= STEPS.length && (
        <p className="scan-line-visible pt-1 text-sm text-emerald-500/55">
          <span className="inline-block h-3 w-px translate-y-0.5 bg-emerald-500/50 motion-safe:animate-pulse" aria-hidden />
          <span className="sr-only">Working</span>
        </p>
      )}
    </div>
  );
}

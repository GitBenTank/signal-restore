"use client";

import { useCallback, useState } from "react";
import type { AnalysisResult, SignalStrength } from "@/lib/types";

type RestoreResultProps = {
  result: AnalysisResult;
  onRestart: () => void;
  onRescan: () => void;
};

/** User-facing copy only — internal `SignalStrength` values unchanged. */
function strengthDisplayLabel(s: SignalStrength, patternId: string): string {
  if (patternId === "fallback") {
    return "pattern not named";
  }
  switch (s) {
    case "low":
      return "early signal";
    case "moderate":
      return "clear signal";
    case "strong":
      return "strong signal";
    default:
      return s;
  }
}

function strengthSubtitle(s: SignalStrength, patternId: string): string | null {
  if (patternId === "fallback") {
    return "signal stayed mixed or thin — nothing forced";
  }
  if (s === "low") {
    return "present, but not fully formed";
  }
  return null;
}

export function RestoreResult({ result, onRestart, onRescan }: RestoreResultProps) {
  const [copied, setCopied] = useState(false);

  const strengthLine1 = strengthDisplayLabel(
    result.signalStrength,
    result.patternId,
  );
  const strengthLine2 = strengthSubtitle(result.signalStrength, result.patternId);
  const strengthForCopy =
    strengthLine2 != null
      ? `${strengthLine1}\n(${strengthLine2})`
      : strengthLine1;

  const textParts = [
    "[RESTORE RESULT]",
    "",
    `What you named:\n${result.surfaceNamed}`,
    "",
    `What your words suggest:\n${result.suggest}`,
    "",
  ];
  if (result.directionalHints && result.directionalHints.length > 0) {
    textParts.push(
      "EARLY SIGNALS",
      ...result.directionalHints.map((h) => `- ${h}`),
      "",
    );
  }
  textParts.push(
    `One possibility:\n${result.possibility}`,
    "",
    `What you could try:\n${result.tryNext}`,
    "",
    `Signal strength:\n${strengthForCopy}`,
    "",
    "This is a reflection, not a diagnosis.",
    "Take what fits. Ignore what doesn’t.",
  );
  const textBlock = textParts.join("\n");

  const copy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(textBlock);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }, [textBlock]);

  return (
    <div className="space-y-8">
      <div className="rounded-lg border border-emerald-500/[0.14] bg-black/30 p-5 sm:p-7">
        <p className="mb-6 font-mono text-[10px] tracking-[0.28em] text-amber-500/80 sm:text-[11px]">
          [RESTORE RESULT]
        </p>

        <dl className="divide-y divide-emerald-500/[0.08] font-mono text-[15px] leading-[1.65] text-emerald-100/93 sm:text-base sm:leading-[1.7]">
          <div className="pb-6">
            <dt className="mb-2 text-[10px] font-medium uppercase tracking-[0.2em] text-emerald-600/85 sm:text-[11px]">
              What you named
            </dt>
            <dd className="text-lg font-medium tracking-tight text-emerald-50/98 sm:text-xl">
              {result.surfaceNamed}
            </dd>
          </div>
          <div className="space-y-6 py-6">
            <div>
              <dt className="mb-2 text-[10px] font-medium uppercase tracking-[0.2em] text-emerald-600/85 sm:text-[11px]">
                What your words suggest
              </dt>
              <dd className="text-emerald-100/92">{result.suggest}</dd>
            </div>
            {result.directionalHints && result.directionalHints.length > 0 && (
              <div>
                <dt className="mb-2 text-[10px] font-medium uppercase tracking-[0.22em] text-emerald-600/85 sm:text-[11px]">
                  EARLY SIGNALS
                </dt>
                <dd>
                  <ul className="list-disc space-y-2 pl-5 text-emerald-100/88 marker:text-emerald-600/60">
                    {result.directionalHints.map((hint, i) => (
                      <li key={`${i}-${hint.slice(0, 24)}`}>{hint}</li>
                    ))}
                  </ul>
                </dd>
              </div>
            )}
            <div>
              <dt className="mb-2 text-[10px] font-medium uppercase tracking-[0.2em] text-emerald-600/85 sm:text-[11px]">
                One possibility
              </dt>
              <dd className="text-emerald-100/90">{result.possibility}</dd>
            </div>
            <div>
              <dt className="mb-2 text-[10px] font-medium uppercase tracking-[0.2em] text-emerald-600/85 sm:text-[11px]">
                What you could try
              </dt>
              <dd className="text-emerald-100/92">{result.tryNext}</dd>
            </div>
            <div>
              <dt className="mb-2 text-[10px] font-medium uppercase tracking-[0.2em] text-emerald-600/85 sm:text-[11px]">
                Signal strength
              </dt>
              <dd className="text-amber-400/88">
                <span className="tabular-nums">{strengthLine1}</span>
                {strengthLine2 != null && (
                  <span className="mt-1.5 block text-sm font-normal normal-case tracking-normal text-emerald-600/80">
                    ({strengthLine2})
                  </span>
                )}
              </dd>
            </div>
          </div>
        </dl>
      </div>

      <footer className="space-y-1.5 border-t border-emerald-500/[0.06] pt-6 font-mono text-[11px] leading-relaxed text-emerald-800/80 sm:text-xs sm:text-emerald-900/60">
        <p>This is a reflection, not a diagnosis.</p>
        <p>Take what fits. Ignore what doesn’t.</p>
      </footer>

      <div className="flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:gap-3">
        <button
          type="button"
          onClick={onRestart}
          className="min-h-[44px] rounded-lg border border-emerald-500/32 bg-transparent px-5 py-2.5 font-mono text-sm font-medium text-emerald-200/95 transition-colors hover:border-emerald-400/48 hover:bg-emerald-950/35 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400/55 sm:min-w-[7rem]"
        >
          Restart
        </button>
        <button
          type="button"
          onClick={onRescan}
          className="min-h-[44px] rounded-lg border border-emerald-500/38 bg-emerald-950/45 px-5 py-2.5 font-mono text-sm font-medium text-emerald-100/95 transition-colors hover:border-emerald-400/52 hover:bg-emerald-900/38 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400/55 sm:min-w-[7rem]"
        >
          Rescan
        </button>
        <button
          type="button"
          onClick={copy}
          className="min-h-[44px] rounded-lg border border-amber-500/28 bg-amber-950/15 px-5 py-2.5 font-mono text-sm font-medium text-amber-100/90 transition-colors hover:border-amber-400/42 hover:bg-amber-950/28 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400/45 sm:min-w-[8.5rem]"
        >
          {copied ? "Copied" : "Copy result"}
        </button>
      </div>
    </div>
  );
}

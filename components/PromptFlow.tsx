"use client";

import { useEffect, useRef, useState } from "react";
import type { Prompt } from "@/lib/types";

type PromptFlowProps = {
  prompts: readonly Prompt[];
  currentIndex: number;
  onAnswer: (index: number, text: string) => void;
};

export function PromptFlow({
  prompts,
  currentIndex,
  onAnswer,
}: PromptFlowProps) {
  const prompt = prompts[currentIndex];
  const [draft, setDraft] = useState("");
  const areaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    areaRef.current?.focus();
  }, [currentIndex]);

  const progress = `${currentIndex + 1} / ${prompts.length}`;
  const canSubmit = draft.trim().length > 0;

  function submit() {
    if (!canSubmit) return;
    onAnswer(currentIndex, draft.trim());
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3 font-mono text-[11px] text-emerald-600/90 sm:text-xs">
        <span className="uppercase tracking-[0.2em]">Reflection</span>
        <span className="tabular-nums text-amber-500/85">{progress}</span>
      </div>

      <div
        className="h-1 w-full overflow-hidden rounded-full bg-emerald-950/90"
        role="progressbar"
        aria-valuenow={currentIndex + 1}
        aria-valuemin={1}
        aria-valuemax={prompts.length}
        aria-label="Prompt progress"
      >
        <div
          className="h-full rounded-full bg-emerald-500/40 transition-[width] duration-500 ease-out"
          style={{
            width: `${((currentIndex + 1) / prompts.length) * 100}%`,
          }}
        />
      </div>

      <p className="max-w-prose pt-1 font-mono text-base leading-relaxed text-emerald-50/96 sm:text-lg sm:leading-relaxed">
        {prompt.text}
      </p>

      <div className="space-y-4">
        <label htmlFor="reflection-input" className="sr-only">
          Your answer
        </label>
        <textarea
          id="reflection-input"
          ref={areaRef}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
              e.preventDefault();
              submit();
            }
          }}
          rows={5}
          className="w-full resize-y rounded-lg border border-emerald-500/22 bg-black/55 px-3 py-3 font-mono text-sm leading-relaxed text-emerald-100/95 placeholder:text-emerald-800/85 outline-none transition-shadow focus:border-emerald-400/38 focus:shadow-[0_0_0_2px_rgba(16,185,129,0.1)] sm:px-4 sm:py-3.5 sm:text-[15px]"
          placeholder="Write freely. There is no wrong answer."
        />
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-[11px] text-emerald-800/90 sm:text-xs">
            <kbd className="rounded border border-emerald-800/55 bg-emerald-950/55 px-1.5 py-0.5 text-[10px] text-emerald-500/90">
              ⌘
            </kbd>
            {" + "}
            <kbd className="rounded border border-emerald-800/55 bg-emerald-950/55 px-1.5 py-0.5 text-[10px] text-emerald-500/90">
              Enter
            </kbd>
            {" to submit"}
          </p>
          <button
            type="button"
            disabled={!canSubmit}
            onClick={submit}
            className="min-h-[44px] rounded-lg border border-emerald-500/38 bg-emerald-950/45 px-5 py-2.5 font-mono text-sm font-medium text-emerald-100/95 transition-colors enabled:hover:border-emerald-400/52 enabled:hover:bg-emerald-900/38 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400/55 disabled:cursor-not-allowed disabled:opacity-35"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}

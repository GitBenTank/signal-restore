"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { BootScreen } from "@/components/BootScreen";
import { EngineDebugPanel } from "@/components/EngineDebugPanel";
import { PromptFlow } from "@/components/PromptFlow";
import { RestoreResult } from "@/components/RestoreResult";
import { ScanSequence } from "@/components/ScanSequence";
import { TerminalShell } from "@/components/TerminalShell";
import { analyzeReflection, buildReflectionDiagnostics } from "@/lib/analyzer";
import type { ReflectionDiagnostics } from "@/lib/diagnosticsTypes";
import { REFLECTION_PROMPTS } from "@/lib/prompts";
import type { AnalysisResult, AppPhase } from "@/lib/types";

export function HomeClient() {
  const searchParams = useSearchParams();
  const debugEnabled =
    process.env.NODE_ENV === "development" &&
    searchParams.get("debug") === "1";

  const [phase, setPhase] = useState<AppPhase>("boot");
  const [promptIndex, setPromptIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [scanKey, setScanKey] = useState(0);
  const answersRef = useRef<string[]>([]);

  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);

  const debugDiagnostics = useMemo((): ReflectionDiagnostics | null => {
    if (phase !== "result" || !debugEnabled) return null;
    const full = REFLECTION_PROMPTS.map((_, i) => answers[i] ?? "");
    return buildReflectionDiagnostics(full);
  }, [phase, debugEnabled, answers]);

  const handleBegin = useCallback(() => {
    setPhase("prompts");
    setPromptIndex(0);
    setAnswers([]);
    answersRef.current = [];
    setAnalysis(null);
    setScanKey(0);
  }, []);

  const handleAnswer = useCallback((index: number, text: string) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[index] = text;
      answersRef.current = next;
      return next;
    });
    if (index < REFLECTION_PROMPTS.length - 1) {
      setPromptIndex((i) => i + 1);
    } else {
      setPhase("scanning");
      setScanKey((k) => k + 1);
    }
  }, []);

  const completeScan = useCallback(() => {
    const full = REFLECTION_PROMPTS.map((_, i) => answersRef.current[i] ?? "");
    setAnalysis(analyzeReflection(full));
    setPhase("result");
  }, []);

  const handleRestart = useCallback(() => {
    setPhase("boot");
    setPromptIndex(0);
    setAnswers([]);
    answersRef.current = [];
    setAnalysis(null);
    setScanKey(0);
  }, []);

  const handleRescan = useCallback(() => {
    setPhase("scanning");
    setScanKey((k) => k + 1);
  }, []);

  return (
    <div className="flex min-h-full flex-1 flex-col items-center justify-center bg-[#030504] px-4 py-10 sm:px-6 sm:py-14">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(16,185,129,0.12),transparent)]" />

      <main className="relative z-10 w-full max-w-2xl">
        <TerminalShell>
          <div
            key={`${phase}-${phase === "scanning" || phase === "result" ? scanKey : phase === "prompts" ? promptIndex : 0}`}
            className="phase-panel"
          >
            {phase === "boot" && <BootScreen onBegin={handleBegin} />}

            {phase === "prompts" && (
              <PromptFlow
                prompts={REFLECTION_PROMPTS}
                currentIndex={promptIndex}
                onAnswer={handleAnswer}
              />
            )}

            {phase === "scanning" && (
              <ScanSequence key={scanKey} onComplete={completeScan} />
            )}

            {phase === "result" && analysis && (
              <RestoreResult
                result={analysis}
                onRestart={handleRestart}
                onRescan={handleRescan}
              />
            )}
          </div>
        </TerminalShell>

        {debugEnabled && phase === "result" && debugDiagnostics && (
          <EngineDebugPanel diagnostics={debugDiagnostics} />
        )}

        <div className="mx-auto mt-10 max-w-lg space-y-4 text-center sm:mt-12">
          <p className="font-mono text-[11px] leading-relaxed text-emerald-900/55 sm:text-xs">
            Signal: Restore reads patterns in your language with a rule-based engine—no diagnosis, no
            clinical claims. When the signal is mixed, it holds back instead of forcing a label.
          </p>
          <p>
            <Link
              href="/"
              className="font-mono text-[11px] text-emerald-700/50 underline decoration-emerald-800/40 underline-offset-2 transition-colors hover:text-emerald-600/70 sm:text-xs"
            >
              Back to introduction
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}

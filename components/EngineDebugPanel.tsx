import type { ReactNode } from "react";
import type { ReflectionDiagnostics } from "@/lib/diagnosticsTypes";

type EngineDebugPanelProps = {
  diagnostics: ReflectionDiagnostics;
};

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h3 className="mt-5 border-b border-emerald-500/15 pb-1 font-mono text-[10px] uppercase tracking-[0.18em] text-emerald-500/80 first:mt-0">
      {children}
    </h3>
  );
}

function PreBlock({ children }: { children: string }) {
  return (
    <pre className="mt-2 max-h-48 overflow-auto whitespace-pre-wrap break-words rounded border border-emerald-500/10 bg-black/40 px-3 py-2 font-mono text-[11px] leading-relaxed text-emerald-100/85">
      {children}
    </pre>
  );
}

function Row({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="mt-1.5 flex flex-wrap gap-x-2 gap-y-0.5 font-mono text-[11px] text-emerald-100/80">
      <span className="shrink-0 text-emerald-600/70">{label}</span>
      <span className="min-w-0">{value}</span>
    </div>
  );
}

export function EngineDebugPanel({ diagnostics: d }: EngineDebugPanelProps) {
  return (
    <div className="mt-8 w-full rounded-xl border border-amber-500/25 bg-[#0a0c0a]/95 px-4 py-4 shadow-[0_0_40px_-12px_rgba(245,158,11,0.15)] sm:px-5 sm:py-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-amber-500/20 pb-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-amber-500/90">
          Engine debug
        </p>
        <p className="font-mono text-[10px] text-amber-700/80">dev · ?debug=1</p>
      </div>

      <SectionTitle>Engine input</SectionTitle>
      <Row label="Raw answers" value={`${d.rawAnswers.length} field(s)`} />
      <PreBlock>{JSON.stringify(d.rawAnswers, null, 2)}</PreBlock>
      <Row label="Normalized (per field)" value="" />
      <PreBlock>{JSON.stringify(d.normalizedAnswers, null, 2)}</PreBlock>
      <Row label="Scoring blob" value="" />
      <PreBlock>{d.scoringBlob || "(empty)"}</PreBlock>

      <SectionTitle>Scoring</SectionTitle>
      <Row label="Word count" value={String(d.reflectionWordCount)} />
      <Row label="Signal strength (result)" value={d.resultSignalStrength} />
      <Row
        label="Ranked (capped)"
        value={d.rankedCapped.map((r) => `${r.id}:${r.score}`).join(" · ")}
      />
      <Row
        label="Ranked (uncapped)"
        value={d.rankedUncapped.map((r) => `${r.id}:${r.score}`).join(" · ")}
      />
      <Row
        label="Threshold"
        value={`min ${d.thresholds.minPatternScore} · ambiguity ±${d.thresholds.ambiguityMargin} · runner-up floor ${d.thresholds.runnerUpFloor}`}
      />
      <Row
        label="Minimum check"
        value={d.checks.passedMinimum ? "passed" : "failed (top capped below min)"}
      />
      <Row
        label="Ambiguity check"
        value={
          d.checks.passedAmbiguity
            ? "passed (clear leader)"
            : "failed (runner-up too close)"
        }
      />

      <SectionTitle>Bonuses / guards</SectionTitle>
      <Row label="Vague short-input guard" value={d.vagueGuardActive ? "active" : "inactive"} />
      <Row label="Blob matches vague heuristics" value={d.vagueGuardBlobMatched ? "yes" : "no"} />
      <Row label="Note" value={d.vagueGuardNote} />
      <Row label="Score cap applied" value={d.scoreCapApplied ? "yes" : "no"} />
      {d.scoreCapValue !== null && (
        <Row label="Cap value" value={String(d.scoreCapValue)} />
      )}
      <p className="mt-3 font-mono text-[10px] uppercase tracking-wider text-emerald-600/60">
        Per-pattern breakdown
      </p>
      <ul className="mt-2 space-y-3">
        {d.patterns.map((p) => (
          <li
            key={p.id}
            className="rounded border border-emerald-500/10 bg-black/30 px-3 py-2 font-mono text-[11px] text-emerald-100/75"
          >
            <div className="text-emerald-400/90">
              {p.id}{" "}
              <span className="text-emerald-700/80">
                capped {p.cappedScore} / uncapped {p.uncappedScore}
              </span>
            </div>
            <div className="mt-1 text-[10px] text-emerald-600/70">
              anchors +{p.anchorPoints} · keywords +{p.keywordPoints}
              {p.griefConditionalPoints > 0
                ? ` · grief conditional +${p.griefConditionalPoints}`
                : ""}
              {p.metaBonus > 0 ? ` · meta +${p.metaBonus}` : " · meta +0"}
            </div>
            {p.anchorMatches.length > 0 && (
              <div className="mt-1 text-[10px] text-emerald-500/55">
                anchors: {p.anchorMatches.join(", ")}
              </div>
            )}
            {p.keywordMatches.length > 0 && (
              <div className="mt-1 text-[10px] text-emerald-500/55">
                keywords: {p.keywordMatches.join(", ")}
              </div>
            )}
            {p.griefConditionalLabels.length > 0 && (
              <div className="mt-1 text-[10px] text-amber-600/70">
                {p.griefConditionalLabels.join(" · ")}
              </div>
            )}
          </li>
        ))}
      </ul>

      <SectionTitle>Decision</SectionTitle>
      <Row
        label="Outcome"
        value={
          d.decision.fallbackReason === "winner"
            ? `winner → ${d.decision.winnerId}`
            : "fallback"
        }
      />
      <Row
        label="Fallback reason code"
        value={d.decision.fallbackReason === "winner" ? "—" : d.decision.fallbackReason}
      />
      <PreBlock>{d.decision.summary}</PreBlock>
    </div>
  );
}

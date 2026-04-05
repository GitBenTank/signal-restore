import Link from "next/link";
import { TerminalShell } from "@/components/TerminalShell";

function SectionRule() {
  return (
    <div
      className="my-9 h-px max-w-md bg-gradient-to-r from-emerald-500/20 via-emerald-500/10 to-transparent"
      aria-hidden
    />
  );
}

export function LandingPage() {
  return (
    <div className="flex min-h-full flex-1 flex-col items-center justify-center bg-[#030504] px-4 py-10 sm:px-6 sm:py-14">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(16,185,129,0.12),transparent)]" />

      <main className="relative z-10 w-full max-w-2xl">
        <TerminalShell>
          <div className="space-y-0">
            <header className="space-y-5">
              <p className="font-mono text-[10px] font-medium uppercase tracking-[0.32em] text-emerald-500/65 sm:text-[11px]">
                Signal: Restore
              </p>
              <h1 className="max-w-xl font-sans text-2xl font-medium leading-snug tracking-tight text-emerald-100/95 sm:text-3xl sm:leading-snug">
                Bring unclear feelings into clearer view.
              </h1>
              <p className="max-w-lg font-sans text-[15px] leading-relaxed text-emerald-500/88 sm:text-base sm:leading-relaxed">
                Signal: Restore is a terminal-style reflection tool that reads your language locally,
                surfaces patterns, and stays honest when the signal is mixed.
              </p>
              <div className="flex flex-col gap-4 pt-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-5">
                <Link
                  href="/reflect"
                  className="inline-flex min-h-[44px] items-center justify-center rounded-lg border border-emerald-500/38 bg-emerald-950/50 px-6 py-2.5 font-mono text-sm font-medium text-emerald-100/95 transition-colors hover:border-emerald-400/55 hover:bg-emerald-900/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400/55 active:bg-emerald-950/70"
                >
                  Begin reflection
                </Link>
                <p className="font-mono text-[11px] leading-relaxed text-emerald-700/75 sm:text-xs">
                  Rule-based · no diagnosis · falls back when unclear
                </p>
              </div>
            </header>

            <SectionRule />

            <section aria-labelledby="how-heading">
              <h2
                id="how-heading"
                className="font-mono text-[10px] uppercase tracking-[0.28em] text-emerald-600/80 sm:text-[11px]"
              >
                How it works
              </h2>
              <ol className="mt-5 space-y-4 font-sans text-[15px] leading-relaxed text-emerald-200/90 sm:text-base">
                <li className="flex gap-3">
                  <span className="shrink-0 font-mono text-sm text-emerald-600/80">1.</span>
                  <span>Write what’s been weighing on you</span>
                </li>
                <li className="flex gap-3">
                  <span className="shrink-0 font-mono text-sm text-emerald-600/80">2.</span>
                  <span>The system scans your language for patterns</span>
                </li>
                <li className="flex gap-3">
                  <span className="shrink-0 font-mono text-sm text-emerald-600/80">3.</span>
                  <span>Get a grounded reflection, not a diagnosis</span>
                </li>
              </ol>
            </section>

            <SectionRule />

            <section aria-labelledby="trust-heading">
              <h2
                id="trust-heading"
                className="font-mono text-[10px] uppercase tracking-[0.28em] text-emerald-600/80 sm:text-[11px]"
              >
                Why trust it
              </h2>
              <ul className="mt-5 space-y-3 font-sans text-[15px] leading-relaxed text-emerald-200/88 sm:text-base">
                <li className="flex gap-3">
                  <span className="mt-[0.35em] h-1 w-1 shrink-0 rounded-full bg-emerald-500/45" aria-hidden />
                  <span>
                    <span className="font-medium text-emerald-100/90">Local-first:</span> your
                    reflection is analyzed in the app
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-[0.35em] h-1 w-1 shrink-0 rounded-full bg-emerald-500/45" aria-hidden />
                  <span>
                    <span className="font-medium text-emerald-100/90">Rule-based:</span> no
                    black-box guessing
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-[0.35em] h-1 w-1 shrink-0 rounded-full bg-emerald-500/45" aria-hidden />
                  <span>
                    <span className="font-medium text-emerald-100/90">Cautious by design:</span>{" "}
                    mixed or vague input falls back instead of forcing certainty
                  </span>
                </li>
              </ul>
            </section>

            <SectionRule />

            <section aria-labelledby="example-heading">
              <h2
                id="example-heading"
                className="font-mono text-[10px] uppercase tracking-[0.28em] text-emerald-600/80 sm:text-[11px]"
              >
                Example output
              </h2>
              <p className="mt-3 max-w-lg font-mono text-[11px] leading-relaxed text-emerald-700/70 sm:text-xs">
                Example only — your input shapes the result
              </p>
              <div className="mt-5 rounded-lg border border-emerald-500/[0.14] bg-black/30 p-5 sm:p-6">
                <p className="mb-5 font-mono text-[10px] tracking-[0.22em] text-amber-500/75 sm:text-[11px]">
                  [RESTORE RESULT]
                </p>
                <dl className="divide-y divide-emerald-500/[0.08] font-mono text-[13px] leading-[1.65] text-emerald-100/90 sm:text-[14px]">
                  <div className="pb-5">
                    <dt className="mb-1.5 text-[10px] font-medium uppercase tracking-[0.18em] text-emerald-600/85">
                      What you named
                    </dt>
                    <dd className="text-[15px] font-medium text-emerald-50/95 sm:text-base">
                      Pressure after a conversation that didn’t land
                    </dd>
                  </div>
                  <div className="py-5">
                    <dt className="mb-1.5 text-[10px] font-medium uppercase tracking-[0.18em] text-emerald-600/85">
                      What your words suggest
                    </dt>
                    <dd>
                      Your phrasing points to unfinished emotional processing—not a verdict on you,
                      but weight you may still be carrying.
                    </dd>
                  </div>
                  <div className="py-5">
                    <dt className="mb-1.5 text-[10px] font-medium uppercase tracking-[0.18em] text-emerald-600/85">
                      One possibility
                    </dt>
                    <dd>
                      Part of you might be replaying the exchange because the closure you wanted
                      didn’t quite arrive in the room.
                    </dd>
                  </div>
                  <div className="pt-5">
                    <dt className="mb-1.5 text-[10px] font-medium uppercase tracking-[0.18em] text-emerald-600/85">
                      What you could try
                    </dt>
                    <dd>
                      Say one sentence you wish you’d said, without polishing it—then notice whether
                      you needed them to hear it, or you needed to hear yourself say it.
                    </dd>
                  </div>
                </dl>
              </div>
            </section>

            <SectionRule />

            <footer className="space-y-5 pb-1">
              <p className="max-w-md font-sans text-[15px] leading-relaxed text-emerald-400/90 sm:text-base">
                Start when you’re ready.
                <br />
                <span className="text-emerald-500/80">
                  You don’t need the right words—just somewhere to begin.
                </span>
              </p>
              <Link
                href="/reflect"
                className="inline-flex min-h-[44px] items-center justify-center rounded-lg border border-emerald-500/32 bg-transparent px-6 py-2.5 font-mono text-sm font-medium text-emerald-200/95 transition-colors hover:border-emerald-400/45 hover:bg-emerald-950/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400/55"
              >
                Open Signal: Restore
              </Link>
            </footer>
          </div>
        </TerminalShell>

        <p className="mx-auto mt-10 max-w-lg text-center font-mono text-[11px] leading-relaxed text-emerald-800/75 sm:mt-12 sm:text-xs sm:text-emerald-700/80">
          Not a substitute for professional care. If you’re in crisis, reach out to local emergency
          services or a crisis line you trust.
        </p>
      </main>
    </div>
  );
}

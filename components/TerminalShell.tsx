import type { ReactNode } from "react";

type TerminalShellProps = {
  children: ReactNode;
  className?: string;
};

export function TerminalShell({ children, className = "" }: TerminalShellProps) {
  return (
    <div
      className={[
        "relative w-full max-w-2xl overflow-hidden rounded-xl border border-emerald-500/[0.18]",
        "bg-[#040806]/[0.97] shadow-[0_0_0_1px_rgba(16,185,129,0.05),0_24px_80px_-32px_rgba(0,0,0,0.75),0_0_56px_-18px_rgba(16,185,129,0.12)]",
        "backdrop-blur-[2px]",
        className,
      ].join(" ")}
    >
      <div className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-b from-emerald-500/[0.04] via-transparent to-amber-500/[0.02]" />
      <div className="relative border-b border-emerald-500/[0.08] px-5 py-2.5 sm:px-8">
        <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-emerald-700/90 sm:text-[11px]">
          <span className="flex gap-1" aria-hidden>
            <span className="h-2 w-2 rounded-full bg-emerald-500/35" />
            <span className="h-2 w-2 rounded-full bg-emerald-500/20" />
            <span className="h-2 w-2 rounded-full bg-emerald-500/12" />
          </span>
          <span className="text-emerald-600/80">signal.restore</span>
        </div>
      </div>
      <div className="relative px-5 py-7 sm:px-9 sm:py-9">{children}</div>
    </div>
  );
}

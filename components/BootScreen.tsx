"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type BootScreenProps = {
  onBegin: () => void;
};

export function BootScreen({ onBegin }: BootScreenProps) {
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const tryBegin = useCallback(() => {
    if (value.trim().toLowerCase() === "begin") {
      onBegin();
    }
  }, [value, onBegin]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className="space-y-8">
      <header className="space-y-4 font-mono text-sm leading-relaxed text-emerald-400/95 sm:text-base">
        <p className="text-[11px] font-medium uppercase tracking-[0.35em] text-emerald-500/70 sm:text-xs">
          Session
        </p>
        <div className="space-y-3">
          <h1 className="text-xl font-medium tracking-[0.08em] text-emerald-200/95 sm:text-2xl">
            SIGNAL: RESTORE
          </h1>
          <p className="max-w-md text-emerald-500/85">
            Bring attention back to what you may already sense, but haven’t named clearly—using only
            the language you type here.
          </p>
        </div>
        <div className="h-px max-w-xs bg-gradient-to-r from-emerald-500/25 to-transparent" aria-hidden />
        <p className="pt-1 text-amber-500/90">
          <span className="text-emerald-600/75">type:</span> begin
        </p>
      </header>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch">
        <div className="flex min-h-[44px] min-w-0 flex-1 items-center gap-2 rounded-lg border border-emerald-500/22 bg-black/45 px-3 py-2 font-mono text-sm text-emerald-200/90 transition-shadow focus-within:border-emerald-400/40 focus-within:shadow-[0_0_0_2px_rgba(16,185,129,0.12)]">
          <span className="shrink-0 select-none text-emerald-600/80">&gt;</span>
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                tryBegin();
              }
            }}
            spellCheck={false}
            autoComplete="off"
            aria-label="Type begin to start"
            className="min-w-0 flex-1 bg-transparent py-1 text-emerald-100 outline-none"
            placeholder=""
          />
          <span className="terminal-cursor shrink-0" aria-hidden />
        </div>
        <button
          type="button"
          onClick={onBegin}
          className="min-h-[44px] shrink-0 rounded-lg border border-emerald-500/38 bg-emerald-950/50 px-5 py-2.5 font-mono text-sm font-medium text-emerald-100/95 transition-colors hover:border-emerald-400/55 hover:bg-emerald-900/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400/55 active:bg-emerald-950/70 sm:min-w-[7.5rem]"
        >
          Begin
        </button>
      </div>
      <p className="font-mono text-[11px] leading-relaxed text-emerald-800/95 sm:text-xs">
        Press Enter after typing <span className="text-emerald-500/90">begin</span>, or use the button.
      </p>
    </div>
  );
}

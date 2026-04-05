import type { Metadata } from "next";
import { Suspense } from "react";
import { HomeClient } from "@/components/HomeClient";

export const metadata: Metadata = {
  title: "Reflect · Signal: Restore",
  description:
    "Run a guided reflection in the terminal-style session. Your words stay in the browser; the engine is rule-based and holds back when the signal is unclear.",
};

function ReflectFallback() {
  return (
    <div className="flex min-h-full flex-1 flex-col items-center justify-center bg-[#030504] px-4 py-10">
      <p className="font-mono text-xs text-emerald-700/60">Loading…</p>
    </div>
  );
}

export default function ReflectPage() {
  return (
    <Suspense fallback={<ReflectFallback />}>
      <HomeClient />
    </Suspense>
  );
}

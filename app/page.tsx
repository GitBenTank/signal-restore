import type { Metadata } from "next";
import { LandingPage } from "@/components/LandingPage";

export const metadata: Metadata = {
  title: "Signal: Restore — Bring unclear feelings into clearer view",
  description:
    "A terminal-style reflection tool that reads your language locally, surfaces possible emotional patterns, and stays honest when the signal is mixed. Rule-based, not diagnostic.",
};

export default function Home() {
  return <LandingPage />;
}

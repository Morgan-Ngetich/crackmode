import { createFileRoute } from "@tanstack/react-router";
import { lazy } from "react";

// Lazy load the MDX component
const LazyLongestConsecutiveSequence= lazy(() => import("@/components/docs/problems/longest-consecutive-sequence.mdx"));

function LongestConsecutiveSequence() {
  return (
      <LazyLongestConsecutiveSequence />
  );
}

export const Route = createFileRoute("/_layout/docs/problems/longest-consecutive-sequence")({
  component: LongestConsecutiveSequence,
});
import { Spinner } from "@chakra-ui/react";
import { createFileRoute } from "@tanstack/react-router";
import { Suspense, lazy } from "react";

// Lazy load the MDX component
const LazyLongestConsecutiveSequence= lazy(() => import("@/components/docs/problems/longest-consecutive-sequence.mdx"));

function LongestConsecutiveSequence() {
  return (
    <Suspense fallback={<Spinner />}>
      <LazyLongestConsecutiveSequence />
    </Suspense>
  );
}

export const Route = createFileRoute("/_layout/docs/problems/longest-consecutive-sequence")({
  component: LongestConsecutiveSequence,
});
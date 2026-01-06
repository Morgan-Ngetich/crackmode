import { Spinner } from "@chakra-ui/react";
import { createFileRoute } from "@tanstack/react-router";
import { Suspense, lazy } from "react";

// Lazy load the MDX component
const LazyIncreasingTripletSubsequence = lazy(() => import("@/components/docs/leetcode75/arrays-strings/increasing-triplet-subsequence.mdx"));

function IncreasingTripletSubsequence() {
  return (
    <Suspense fallback={<Spinner />}>
      <LazyIncreasingTripletSubsequence />
    </Suspense>
  );
}

export const Route = createFileRoute("/_layout/docs/leetcode75/arrays-strings/increasing-triplet-subsequence")({
  component: IncreasingTripletSubsequence,
});
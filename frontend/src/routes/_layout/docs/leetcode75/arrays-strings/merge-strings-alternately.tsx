import { createFileRoute } from "@tanstack/react-router";
import { lazy } from "react";

// Lazy load the MDX component
const LazyMergeStrings = lazy(() => import("@/components/docs/leetcode75/arrays-strings/merge-strings-alternately.mdx"));

function MergeStrings() {
  return (
    <LazyMergeStrings />

  );
}

export const Route = createFileRoute("/_layout/docs/leetcode75/arrays-strings/merge-strings-alternately")({
  component: MergeStrings,
});
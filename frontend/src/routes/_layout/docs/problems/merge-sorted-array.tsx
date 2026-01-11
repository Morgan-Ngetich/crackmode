import { createFileRoute } from "@tanstack/react-router";
import { lazy } from "react";

// Lazy load the MDX component
const LazyMergeSortedArray= lazy(() => import("@/components/docs/problems/merge-sorted-array.mdx"));

function MergeSortedArray() {
  return (
      <LazyMergeSortedArray />
  );
}

export const Route = createFileRoute("/_layout/docs/problems/merge-sorted-array")({
  component: MergeSortedArray,
});
import { createFileRoute } from "@tanstack/react-router";
import { lazy } from "react";

// Lazy load the MDX component
const LazyUniqueNumberOfOccurrences= lazy(() => import("@/components/docs/problems/unique-number-of-occurrences.mdx"));

function UniqueNumberOfOccurrences() {
  return (
      <LazyUniqueNumberOfOccurrences />
  );
}

export const Route = createFileRoute("/_layout/docs/problems/unique-number-of-occurrences")({
  component: UniqueNumberOfOccurrences,
});
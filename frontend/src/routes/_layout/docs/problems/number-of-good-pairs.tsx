import { createFileRoute } from "@tanstack/react-router";
import { lazy } from "react";

// Lazy load the MDX component
const LazyNumberOfGoodPairs= lazy(() => import("@/components/docs/problems/number-of-good-pairs.mdx"));

function NumberOfGoodPairs() {
  return (
      <LazyNumberOfGoodPairs />
  );
}

export const Route = createFileRoute("/_layout/docs/problems/number-of-good-pairs")({
  component: NumberOfGoodPairs,
});
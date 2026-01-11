import { createFileRoute } from "@tanstack/react-router";
import { lazy } from "react";

// Lazy load the MDX component
const LazyMostCommonWord = lazy(() => import("@/components/docs/problems/most-common-word.mdx"));

function MostCommonWord() {
  return (
    <LazyMostCommonWord />
  );
}

export const Route = createFileRoute("/_layout/docs/problems/most-common-word")({
  component: MostCommonWord,
});
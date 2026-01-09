import { createFileRoute } from "@tanstack/react-router";
import { lazy } from "react";

// Lazy load the MDX component
const LazyKidsWithGreatestCandies = lazy(() => import("@/components/docs/leetcode75/arrays-strings/kids-with-greatest-candies.mdx"));

function KidsWithGreatestCandies() {
  return (
      <LazyKidsWithGreatestCandies />
  );
}

export const Route = createFileRoute("/_layout/docs/leetcode75/arrays-strings/kids-with-greatest-candies")({
  component: KidsWithGreatestCandies,
});
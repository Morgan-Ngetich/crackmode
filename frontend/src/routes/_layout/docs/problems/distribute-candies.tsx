import { createFileRoute } from "@tanstack/react-router";
import { lazy } from "react";

// Lazy load the MDX component
const LazyDistributeCandies= lazy(() => import("@/components/docs/problems/distribute-candies.mdx"));

function DistributeCandies() {
  return (
      <LazyDistributeCandies />
  );
}

export const Route = createFileRoute("/_layout/docs/problems/distribute-candies")({
  component: DistributeCandies,
});
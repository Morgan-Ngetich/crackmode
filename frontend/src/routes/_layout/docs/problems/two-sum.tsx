import { createFileRoute } from "@tanstack/react-router";
import { lazy } from "react";

// Lazy load the MDX component
const LazyTwoSum = lazy(() => import("@/components/docs/problems/two-sum.mdx"));

function TwoSum() {
  return (
    <LazyTwoSum />
  );
}

export const Route = createFileRoute("/_layout/docs/problems/two-sum")({
  component: TwoSum,
});
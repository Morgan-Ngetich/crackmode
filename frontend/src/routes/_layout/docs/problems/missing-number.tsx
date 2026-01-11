import { createFileRoute } from "@tanstack/react-router";
import { lazy } from "react";

// Lazy load the MDX component
const LazyMissingNumber= lazy(() => import("@/components/docs/problems/missing-number.mdx"));

function MissingNumber() {
  return (
      <LazyMissingNumber />
  );
}

export const Route = createFileRoute("/_layout/docs/problems/missing-number")({
  component: MissingNumber,
});
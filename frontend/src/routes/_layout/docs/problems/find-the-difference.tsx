import { createFileRoute } from "@tanstack/react-router";
import { lazy } from "react";

// Lazy load the MDX component
const LazyFindTheDifference= lazy(() => import("@/components/docs/problems/find-the-difference.mdx"));

function FindTheDifference() {
  return (
      <LazyFindTheDifference />
  );
}

export const Route = createFileRoute("/_layout/docs/problems/find-the-difference")({
  component: FindTheDifference,
});
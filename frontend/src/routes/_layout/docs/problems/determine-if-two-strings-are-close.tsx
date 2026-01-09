import { createFileRoute } from "@tanstack/react-router";
import { lazy } from "react";

// Lazy load the MDX component
const LazyDetermineIfTwoStringsAreClose= lazy(() => import("@/components/docs/problems/determine-if-two-strings-are-close.mdx"));

function DetermineIfTwoStringsAreClose() {
  return (
      <LazyDetermineIfTwoStringsAreClose />
  );
}

export const Route = createFileRoute("/_layout/docs/problems/determine-if-two-strings-are-close")({
  component: DetermineIfTwoStringsAreClose,
});
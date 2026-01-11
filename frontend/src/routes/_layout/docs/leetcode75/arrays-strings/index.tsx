import { createFileRoute } from "@tanstack/react-router";
import { lazy } from "react";

// Lazy load the MDX component
const LazyArraysStrings = lazy(() => import("@/components/docs/leetcode75/arrays-strings.mdx"));

function DocsIndex() {
  return (
    <LazyArraysStrings />
  );
}

export const Route = createFileRoute("/_layout/docs/leetcode75/arrays-strings/")({
  component: DocsIndex,
});
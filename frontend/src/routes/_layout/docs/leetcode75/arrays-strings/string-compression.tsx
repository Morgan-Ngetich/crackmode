import { createFileRoute } from "@tanstack/react-router";
import { lazy } from "react";

// Lazy load the MDX component
const LazyStringCompression = lazy(() => import("@/components/docs/leetcode75/arrays-strings/string-compression.mdx"));

function StringCompression() {
  return (
      <LazyStringCompression />
  );
}

export const Route = createFileRoute("/_layout/docs/leetcode75/arrays-strings/string-compression")({
  component: StringCompression,
});
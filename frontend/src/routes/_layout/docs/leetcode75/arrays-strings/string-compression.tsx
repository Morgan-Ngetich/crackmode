import { Spinner } from "@chakra-ui/react";
import { createFileRoute } from "@tanstack/react-router";
import { Suspense, lazy } from "react";

// Lazy load the MDX component
const LazyStringCompression = lazy(() => import("@/components/docs/leetcode75/arrays-strings/string-compression.mdx"));

function StringCompression() {
  return (
    <Suspense fallback={<Spinner />}>
      <LazyStringCompression />
    </Suspense>
  );
}

export const Route = createFileRoute("/_layout/docs/leetcode75/arrays-strings/string-compression")({
  component: StringCompression,
});
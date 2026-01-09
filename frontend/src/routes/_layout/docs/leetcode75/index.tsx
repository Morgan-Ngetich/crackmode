import { Spinner } from "@chakra-ui/react";
import { createFileRoute } from "@tanstack/react-router";
import { Suspense, lazy } from "react";

// Lazy load the MDX component
const LazyLeetcode75 = lazy(() => import("@/components/docs/leetcode75/leetcode75.mdx"));

function Leetcode75() {
  return (
    // <Suspense fallback={<Spinner />}>
      <LazyLeetcode75 />
    // </Suspense>
  );
}

export const Route = createFileRoute("/_layout/docs/leetcode75/")({
  component: Leetcode75,
});
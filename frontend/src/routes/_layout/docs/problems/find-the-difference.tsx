import { Spinner } from "@chakra-ui/react";
import { createFileRoute } from "@tanstack/react-router";
import { Suspense, lazy } from "react";

// Lazy load the MDX component
const LazyFindTheDifference= lazy(() => import("@/components/docs/problems/find-the-difference.mdx"));

function FindTheDifference() {
  return (
    <Suspense fallback={<Spinner />}>
      <LazyFindTheDifference />
    </Suspense>
  );
}

export const Route = createFileRoute("/_layout/docs/problems/find-the-difference")({
  component: FindTheDifference,
});
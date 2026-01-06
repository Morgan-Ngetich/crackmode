import { Spinner } from "@chakra-ui/react";
import { createFileRoute } from "@tanstack/react-router";
import { Suspense, lazy } from "react";

// Lazy load the MDX component
const LazyMergeSortedArray= lazy(() => import("@/components/docs/problems/merge-sorted-array.mdx"));

function MergeSortedArray() {
  return (
    <Suspense fallback={<Spinner />}>
      <LazyMergeSortedArray />
    </Suspense>
  );
}

export const Route = createFileRoute("/_layout/docs/problems/merge-sorted-array")({
  component: MergeSortedArray,
});
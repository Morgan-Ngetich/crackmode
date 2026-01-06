import { Spinner } from "@chakra-ui/react";
import { createFileRoute } from "@tanstack/react-router";
import { Suspense, lazy } from "react";

// Lazy load the MDX component
const LazyFindTheDifferenceOfTwoArrays= lazy(() => import("@/components/docs/problems/find-the-difference-of-two-arrays.mdx"));

function FindTheDifferenceOfTwoArrays() {
  return (
    <Suspense fallback={<Spinner />}>
      <LazyFindTheDifferenceOfTwoArrays />
    </Suspense>
  );
}

export const Route = createFileRoute("/_layout/docs/problems/find-the-difference-of-two-arrays")({
  component: FindTheDifferenceOfTwoArrays,
});
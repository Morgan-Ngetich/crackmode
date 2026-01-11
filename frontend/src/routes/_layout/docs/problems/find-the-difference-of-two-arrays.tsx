import { createFileRoute } from "@tanstack/react-router";
import { lazy } from "react";

// Lazy load the MDX component
const LazyFindTheDifferenceOfTwoArrays= lazy(() => import("@/components/docs/problems/find-the-difference-of-two-arrays.mdx"));

function FindTheDifferenceOfTwoArrays() {
  return (
      <LazyFindTheDifferenceOfTwoArrays />
  );
}

export const Route = createFileRoute("/_layout/docs/problems/find-the-difference-of-two-arrays")({
  component: FindTheDifferenceOfTwoArrays,
});
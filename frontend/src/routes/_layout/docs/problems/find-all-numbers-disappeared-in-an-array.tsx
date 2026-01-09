import { createFileRoute } from "@tanstack/react-router";
import { lazy } from "react";

// Lazy load the MDX component
const LazyFindAllNumbersDisappearedInArray= lazy(() => import("@/components/docs/problems/find-all-numbers-disappeared-in-an-array.mdx"));

function FindAllNumbersDisappearedInArray() {
  return (
      <LazyFindAllNumbersDisappearedInArray />
  );
}

export const Route = createFileRoute("/_layout/docs/problems/find-all-numbers-disappeared-in-an-array")({
  component: FindAllNumbersDisappearedInArray,
});
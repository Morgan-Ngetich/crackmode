import { Spinner } from "@chakra-ui/react";
import { createFileRoute } from "@tanstack/react-router";
import { Suspense, lazy } from "react";

// Lazy load the MDX component
const LazyFindAllDuplicatesInAnArray= lazy(() => import("@/components/docs/problems/find-all-duplicates-in-an-array.mdx"));

function FindAllDuplicatesInAnArray() {
  return (
    <Suspense fallback={<Spinner />}>
      <LazyFindAllDuplicatesInAnArray />
    </Suspense>
  );
}

export const Route = createFileRoute("/_layout/docs/problems/find-all-duplicates-in-an-array")({
  component: FindAllDuplicatesInAnArray,
});
import { Spinner } from "@chakra-ui/react";
import { createFileRoute } from "@tanstack/react-router";
import { Suspense, lazy } from "react";

// Lazy load the MDX component
const LazyIntroDoc = lazy(() => import("@/components/docs/introduction.mdx"));

function DocsIndex() {
  return (
    <Suspense fallback={<Spinner />}>
      <LazyIntroDoc />
    </Suspense>
  );
}

export const Route = createFileRoute("/_layout/docs/introduction/")({
  component: DocsIndex,
});
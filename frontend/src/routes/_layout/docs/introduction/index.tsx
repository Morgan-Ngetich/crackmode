import { createFileRoute } from "@tanstack/react-router";
import { lazy } from "react";

// Lazy load the MDX component
const LazyIntroDoc = lazy(() => import("@/components/docs/introduction.mdx"));

function DocsIndex() {
  return (
      <LazyIntroDoc />

  );
}

export const Route = createFileRoute("/_layout/docs/introduction/")({
  component: DocsIndex,
});
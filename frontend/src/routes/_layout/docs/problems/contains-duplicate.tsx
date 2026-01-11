import { createFileRoute } from "@tanstack/react-router";
import { lazy } from "react";

// Lazy load the MDX component
const LazyContainsDuplicate = lazy(() => import("@/components/docs/problems/contains-duplicate.mdx"));

function ContainsDuplicate() {
  return (
    <LazyContainsDuplicate />
  );
}

export const Route = createFileRoute("/_layout/docs/problems/contains-duplicate")({
  component: ContainsDuplicate,
});
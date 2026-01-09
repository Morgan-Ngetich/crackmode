import { createFileRoute } from "@tanstack/react-router";
import { lazy } from "react";

// Lazy load the MDX component
const LazyNumberOf1Bits= lazy(() => import("@/components/docs/problems/number-of-1-bits.mdx"));

function NumberOf1Bits() {
  return (
      <LazyNumberOf1Bits />
  );
}

export const Route = createFileRoute("/_layout/docs/problems/number-of-1-bits")({
  component: NumberOf1Bits,
});
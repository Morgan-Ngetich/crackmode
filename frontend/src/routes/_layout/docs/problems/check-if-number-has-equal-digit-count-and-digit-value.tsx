import { createFileRoute } from "@tanstack/react-router";
import { lazy } from "react";

// Lazy load the MDX component
const LazyCheckIfNumberHasEqualDigitCountAndDigitValue = lazy(() => import("@/components/docs/problems/check-if-number-has-equal-digit-count-and-digit-value.mdx"));

function CheckIfNumberHasEqualDigitCountAndDigitValue() {
  return (
    <LazyCheckIfNumberHasEqualDigitCountAndDigitValue />
  );
}

export const Route = createFileRoute("/_layout/docs/problems/check-if-number-has-equal-digit-count-and-digit-value")({
  component: CheckIfNumberHasEqualDigitCountAndDigitValue,
});
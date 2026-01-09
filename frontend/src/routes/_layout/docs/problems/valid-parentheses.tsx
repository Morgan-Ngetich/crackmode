import { createFileRoute } from "@tanstack/react-router";
import { lazy } from "react";

// Lazy load the MDX component
const LazyValidParentheses= lazy(() => import("@/components/docs/problems/valid-parentheses.mdx"));

function ValidParentheses() {
  return (
      <LazyValidParentheses />
  );
}

export const Route = createFileRoute("/_layout/docs/problems/valid-parentheses")({
  component: ValidParentheses,
});
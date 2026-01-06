import { Spinner } from "@chakra-ui/react";
import { createFileRoute } from "@tanstack/react-router";
import { Suspense, lazy } from "react";

// Lazy load the MDX component
const LazyProductOfArrayExceptSelf = lazy(() => import("@/components/docs/leetcode75/arrays-strings/product-of-array-except-self.mdx"));

function ProductOfArrayExceptSelf() {
  return (
    <Suspense fallback={<Spinner />}>
      <LazyProductOfArrayExceptSelf />
    </Suspense>
  );
}

export const Route = createFileRoute("/_layout/docs/leetcode75/arrays-strings/product-of-array-except-self")({
  component: ProductOfArrayExceptSelf,
});
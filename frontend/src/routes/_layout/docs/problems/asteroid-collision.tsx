import { Spinner } from "@chakra-ui/react";
import { createFileRoute } from "@tanstack/react-router";
import { Suspense, lazy } from "react";

// Lazy load the MDX component
const LazyAsteroidCollision = lazy(() => import("@/components/docs/problems/asteroid-collision.mdx"));

function AsteroidCollision() {
  return (
    <Suspense fallback={<Spinner />}>
      <LazyAsteroidCollision />
    </Suspense>
  );
}

export const Route = createFileRoute("/_layout/docs/problems/asteroid-collision")({
  component: AsteroidCollision,
});